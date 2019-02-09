import request from "request";
import moment from "moment";

import properties from "../properties";
import {telegramLogger} from "../bot/telegramServerBot";
import models from "../model";
import {createCentralBankDetail, deleteCentralBankDetail} from "./centralBankDetailService";

export function getCentralBankDataByCurrencyTypeAndRange(currencyType = "USD") {
  return models.CentralBank.findOne({
    where: {
      currency_id: currencyType
    },
    include: [
      {
        model: models.CentralBankDetail,
        order: "period",
        attributes: ['id', 'period', 'buy_price', "sell_price"]
      }
    ]
  });
}

export function postCentralBank(centralBankPayload) {
  if (!centralBankPayload) {
    return;
  }

  return getCentralBankDataByCurrencyTypeAndRange(centralBankPayload.dataHeader.currency_id)
    .then((data) => {
      if (data === null) {
        return models.CentralBank.create({
          title_eng: centralBankPayload.dataHeader.title_eng,
          title_th: centralBankPayload.dataHeader.title_th,
          subtitle_eng: centralBankPayload.dataHeader.subtitle_eng,
          subtitle_th: centralBankPayload.dataHeader.subtitle_th,
          source_of_data_eng: centralBankPayload.dataHeader.source_of_data_eng,
          source_of_data_th: centralBankPayload.dataHeader.source_of_data_th,
          currency_name_eng: centralBankPayload.dataHeader.currency_name_eng,
          currency_name_th: centralBankPayload.dataHeader.currency_name_th,
          currency_id: centralBankPayload.dataHeader.currency_id,
          last_updated: centralBankPayload.dataHeader.last_updated
        }).then(centralBank => {
          return createCentralBankDetail(centralBank.id, centralBankPayload.dataDetail);
        });
      } else {
        return createCentralBankDetail(data.dataValues.id, centralBankPayload.dataDetail);
      }
    });
}

function deleteCentralBank(currencyType) {
  return getCentralBankDataByCurrencyTypeAndRange(currencyType)
    .then((data) => {
      if (data !== null && data.id) {
        return deleteCentralBankDetail(data.id);
      }
    })
    .catch((ex) => {
      return Promise.reject(ex);
    })
}

const DATE_FORMAT = "YYYY-MM-DD";

function getOption(startPeriod, endPeriod, currencyType) {
  return {
    method: 'GET',
    url: 'https://apigw1.bot.or.th/bot/public/Stat-ExchangeRate/v2/DAILY_AVG_EXG_RATE/',
    qs:
      {
        start_period: startPeriod,
        end_period: endPeriod,
        currency: currencyType
      },
    headers: {'x-ibm-client-id': properties.X_IBM_CLIENT_ID}
  };
}

function promiseRequest(options) {
  return new Promise((resolve, reject) => {
    request(options, function (error, response, body) {
      if (error) {
        telegramLogger(error);
        reject(error);
      }

      resolve(body);
    });
  })
}

function parseDataHeader(dataHeader, dataDetail) {
  if (dataHeader && dataDetail) {
    const sourceOfData = dataHeader.report_source_of_data && dataHeader.report_source_of_data.length !== 0
      ? dataHeader.report_source_of_data[0] : null;
    const firstDataDetail = dataDetail && dataDetail.length !== 0 ? dataDetail[0] : null;

    return {
      title_eng: dataHeader.report_name_eng,
      title_th: dataHeader.report_name_th,
      subtitle_eng: dataHeader.report_uoq_name_eng,
      subtitle_th: dataHeader.report_uoq_name_th,
      source_of_data_eng: sourceOfData.source_of_data_eng,
      source_of_data_th: sourceOfData.source_of_data_th,
      last_updated: dataHeader.last_updated,
      currency_id: firstDataDetail.currency_id,
      currency_name_eng: firstDataDetail.currency_name_eng,
      currency_name_th: firstDataDetail.currency_name_th,
    }
  }

  return null;
}

function parseDataDetail(dataDetail) {
  if (dataDetail && Array.isArray(dataDetail)) {
    return dataDetail.map(detail => {
      return {
        period: detail.period,
        lines: {
          buy_price: detail.buying_sight,
          sell_price: detail.selling
        }
      }
    })
  }

  return null;
}

function parseResponse(response) {
  const parsedData = { dataHeader: null, dataDetail: null };

  if (response && response.result && response.result.data) {
    const data = response.result.data;
    parsedData.dataHeader = parseDataHeader(data.data_header, data.data_detail);
    parsedData.dataDetail = parseDataDetail(data.data_detail);

    return parsedData;
  }

  return null;
}

async function getCentralBankData(currencyType) {
  let isErrorExist = false;
  const responseObject = { dataHeader: null, dataDetail: [] };

  for (let i = 12; i > 0; i--) {
    if (isErrorExist) {
      break;
    }

    const startPeriod = moment().subtract(i, 'months').format(DATE_FORMAT);
    const endPeriod = moment().subtract(i - 1, 'months').format(DATE_FORMAT);

    await promiseRequest(getOption(startPeriod, endPeriod, currencyType))
      .then(response => {
        const parsedResponse = parseResponse(JSON.parse(response));

        if (!parsedResponse || !parsedResponse.dataHeader || !parsedResponse.dataDetail) {
          telegramLogger(JSON.stringify(response));
          throw new Error("Parse error");
        }

        if (!responseObject.dataHeader) {
          responseObject.dataHeader = parsedResponse.dataHeader;
        }

        responseObject.dataDetail = responseObject.dataDetail.concat(parsedResponse.dataDetail);
      }, () => {
        isErrorExist = true;
      });
  }

  return responseObject;
}

export const CentralBankSingleton = (function () {
  let isSchedulerRunning;
  let intervalId;

  function getUsdData() {
    getCentralBankData("USD")
      .then((data) => {
        if (data && data.dataHeader) {
          deleteCentralBank("USD")
            .then(() => {
              const usdData = Object.assign({}, data, {
                dataDetail: data.dataDetail.sort((a, b) =>
                  a.period >= b.period ? 1 : -1)
              });
              postCentralBank(usdData);
            })
        }
      })
      .catch((ex) => {
        telegramLogger(ex.toString());
      });
  }

  function getEurData() {
    getCentralBankData("EUR")
      .then((data) => {
        if (data && data.dataHeader) {
          deleteCentralBank("EUR")
            .then(() => {
              const eurData = Object.assign({}, data, {
                dataDetail: data.dataDetail.sort((a, b) =>
                  a.period >= b.period ? 1 : -1)
              });
              postCentralBank(eurData);
            });
        }
      })
      .catch((ex) => {
        telegramLogger(ex.toString());
      });
  }

  function run(interval = 1200000) {
    isSchedulerRunning = true;
    getUsdData();
    getEurData();

    intervalId = setTimeout(function tick() {
      getUsdData();
      getEurData();
      intervalId = setTimeout(tick, interval);
    }, interval);
  }

  function stop() {
    if (isSchedulerRunning) {
      clearTimeout(intervalId);
      isSchedulerRunning = false;
    }
  }

  return {
    run: function(interval) {
      if (isSchedulerRunning) {
        return "Scheduler already is running";
      }

      run(interval);
      return `Scheduler is running with interval: ${interval}ms`
    },
    restart: function(interval) {
      if (isSchedulerRunning) {
        stop();
        run(interval);

        return `Scheduler is running with interval: ${interval}ms`;
      }

      return "Scheduler wasn't started yet";
    },
    stop: function() {
      if (!isSchedulerRunning) {
        return "Scheduler wasn't started yet";
      }
      stop();
      return "Scheduler was stopped";
    }
  };
})();
