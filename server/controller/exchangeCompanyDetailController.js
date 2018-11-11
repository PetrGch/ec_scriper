import express from 'express';

import {isCompanyExist} from "../service/exchangeCompanyService";
import {postExchangeCompanyDetail} from "../service/exchangeCompanyDetailService";

const exchangeCompanyDetailController = express.Router({});

// get all currencies
exchangeCompanyDetailController.post('/:id', (req, res) => {
  const companyId = req.params.id;
  const companyPayload = req.body;

  if (companyId) {
    isCompanyExist(companyId)
      .then(company => {
        if (company) {
          return postExchangeCompanyDetail(companyId, companyPayload)
        }
      }, () => {
        res.sendStatus(500);
      })
      .then(() => {
        res.sendStatus(200);
      })
      .catch(ex => console.error(ex));
  } else {
    res.sendStatus(500);
  }
});

export default exchangeCompanyDetailController;