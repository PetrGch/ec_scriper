import express from 'express';

import {isCompanyExist} from "../service/exchangeCompanyService";
import {exchangeCompanyWorkingTimeService} from "../service/exchangeCompanyWorkingTimeService";

const exchangeCompanyWorkingTimeController = express.Router({});

// get all currencies
exchangeCompanyWorkingTimeController.post('/:id', (req, res) => {
  const companyId = req.params.id;
  const companyWorkingTimePayload = req.body;

  if (companyId) {
    isCompanyExist(companyId)
      .then(company => {
        if (company) {
          return exchangeCompanyWorkingTimeService(companyId, companyWorkingTimePayload)
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

export default exchangeCompanyWorkingTimeController;