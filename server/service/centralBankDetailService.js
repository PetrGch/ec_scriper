import models from "../model";
import moment from "moment";

export function createCentralBankDetail(centralBankId, dataDetail) {
  if (dataDetail && dataDetail.length !== 0) {
    const parsedCentralBankDetail = dataDetail.map((detail) => ({
      period: moment(detail.period, "YYYY-MM-DD").format(),
      buy_price: detail.lines.buy_price,
      sell_price: detail.lines.sell_price,
      central_bank_id: centralBankId
    }));

    return models.CentralBankDetail.bulkCreate(parsedCentralBankDetail)
  }

  return null;
}

export function deleteCentralBankDetail(centralBankId) {
  if (centralBankId) {
    return models.CentralBankDetail.destroy({
      where: {
        central_bank_id: centralBankId
      }
    });
  }

  return null;
}