import models from "../model";

export function postExchangeCompanyBranch(companyId, branchPayload) {
  if (Array.isArray(branchPayload)) {
    const branches = branchPayload
      .map((branch) => Object.assign({}, branch, { exchange_company_id: companyId }));
    return models.ExchangeCompanyBranch.bulkCreate(branches);
  }

  branchPayload.exchange_company_id = companyId;
  return models.ExchangeCompanyBranch.create(branchPayload);
}
