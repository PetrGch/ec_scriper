import models from "../model";

export function postExchangeCompanyDetail(companyId, companyDetailPayload) {
  return models.ExchangeCompanyDetail.create({
    phone: companyDetailPayload.phone,
    website: companyDetailPayload.website,
    email: companyDetailPayload.email,
    company_id: companyId
  });
}