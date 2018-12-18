import request from "request";
import moment from "moment";
import properties from "../properties";
import {telegramLogger} from "../bot/telegramServerBot";

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
          telegramLogger("Central Bank parse error");
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
  let instance;
  let intervalId;

  function createInstance() {
    return {
      usd: null,
      eur: null,
      errorMessage: null
    };
  }

  function getUsdData() {
    getCentralBankData("USD")
      .then((data) => {
        if (instance) {
          instance.usd = Object.assign({}, data, {
            dataDetail: data.dataDetail.sort((a, b) =>
              a.period >= b.period ? 1 : -1)
          })
        }
      }, (ex) => {
        throw new Error(ex);
      })
      .catch((ex) => {
        instance.errorMessage = ex.message;
      });
  }

  function getEurData() {
    getCentralBankData("EUR")
      .then((data) => {
        if (instance) {
          instance.eur = Object.assign({}, data, {
            dataDetail: data.dataDetail.sort((a, b) =>
              a.period >= b.period ? 1 : -1)
          })
        }
      }, (ex) => {
        throw new Error(ex);
      })
      .catch((ex) => {
        instance.errorMessage = ex;
      });
  }

  function run(currencyType, interval = 1200000) {
    getUsdData();
    getEurData();

    intervalId = setTimeout(function tick() {
      getUsdData();
      getEurData();
      intervalId = setTimeout(tick, interval);
    }, interval);
  }

  function stop() {
    if (intervalId) {
      clearTimeout(intervalId);
    }
  }

  return {
    getEurPortion: function(portion = "all") {
      const portionInLowerCase = portion.toLowerCase();

      if (instance && instance.errorMessage) {
        return instance.errorMessage
      }

      if (!instance || (instance && !instance.eur)) {
        return "instance is empty";
      }

      if (!portion || portionInLowerCase === "all") {
        return instance.eur;
      } else if (portionInLowerCase === "30") {
        return {
          dataHeader: instance.eur.dataHeader,
          dataDetail: instance.eur.dataDetail ? instance.eur.dataDetail.slice(-30) : []
        }
      } else if (portionInLowerCase === "7") {
        return {
          dataHeader: instance.eur.dataHeader,
          dataDetail: instance.eur.dataDetail ? instance.eur.dataDetail.slice(-7) : []
        }
      }

      return null;
    },
    getUsdPortion: function(portion = "all") {
      const portionInLowerCase = portion.toLowerCase();

      if (instance && instance.errorMessage) {
        return instance.errorMessage
      }

      if (!instance || (instance && !instance.usd)) {
        return "instance is empty";
      }

      if (!portion || portionInLowerCase === "all") {
        return instance.usd;
      } else if (portionInLowerCase === "30") {
        return {
          dataHeader: instance.usd.dataHeader,
          dataDetail: instance.usd.dataDetail ? instance.usd.dataDetail.slice(-30) : []
        }
      } else if (portionInLowerCase === "7") {
        return {
          dataHeader: instance.usd.dataHeader,
          dataDetail: instance.usd.dataDetail ? instance.usd.dataDetail.slice(-7) : []
        }
      }

      return null;
    },
    run: function(interval) {
      if (!instance) {
        instance = createInstance();
      }
      if (intervalId) {
        return "Scheduler already is running";
      }

      run(interval);
      return `Scheduler is running with interval: ${interval}ms`
    },
    restart: function(interval) {
      if (instance) {
        instance = createInstance();
      }
      run(interval);
      return instance;
    },
    stop: function() {
      if (!intervalId) {
        return "Scheduler wasn't created yet";
      }
      stop();
      return "Scheduler was stopped";
    }
  };
})();
