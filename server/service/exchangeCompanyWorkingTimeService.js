import models from "../model";

export function exchangeCompanyWorkingTimeService(companyId, companyWorkingTimePayload) {
  return models.ExchangeCompanyWorkingTime.create({
    mn_from: companyWorkingTimePayload.mn_from,
    mn_to: companyWorkingTimePayload.mn_to,
    tu_from: companyWorkingTimePayload.tu_from,
    tu_to: companyWorkingTimePayload.tu_to,
    we_from: companyWorkingTimePayload.we_from,
    we_to: companyWorkingTimePayload.we_to,
    th_from: companyWorkingTimePayload.th_from,
    th_to: companyWorkingTimePayload.th_to,
    fr_from: companyWorkingTimePayload.fr_from,
    fr_to: companyWorkingTimePayload.fr_to,
    st_from: companyWorkingTimePayload.st_from,
    st_to: companyWorkingTimePayload.st_to,
    sn_from: companyWorkingTimePayload.sn_from,
    sn_to: companyWorkingTimePayload.sn_to,
    exchange_company_id: companyId
  });
}