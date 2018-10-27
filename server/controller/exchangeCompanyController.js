import express from 'express';

import {
  findCompanyByBranchName,
  findCompanyById, findCompanyByName,
  getAllExchangeCompanies,
  postExchangeCompany, updateCompany
} from "../service/exchangeCompanyService";
import {scraper} from "../../scriper/scraper";
import {updateCurrenciesAmount} from "../service/exchangeCurrencyService";

const exchangeCompanyController = express.Router({});

exchangeCompanyController.get('/', (req, res) => {
  getAllExchangeCompanies()
    .then(company => {
      res.json(company);
    })
    .catch(ex => res.send(ex));
});

exchangeCompanyController.put('/scraper', (req, res) => {
  scraper()
    .then(branchesPayload => {
      updateCurrenciesAmount(branchesPayload)
        .then((companies) => {
          res.json(companies)
        }, (ex) => {
          throw new Error(ex);
        })
        .catch((ex) => {
          res.send(ex);
        })
    }, ex => {
      throw new Error(ex)
    }).catch(ex => {
      res.send(ex);
  })
});

exchangeCompanyController.get('/:id', (req, res) => {
  const companyId = req.params.id;
  if (companyId) {
    findCompanyById(companyId)
      .then(company => {
        res.json(company);
      })
      .catch(ex => console.error(ex));
  } else {
    res.sendStatus(500);
  }
});

exchangeCompanyController.get('/branch/:name', (req, res) => {
  if (req.params.name) {
    findCompanyByBranchName(req.params.name)
      .then(company => {
        res.json(company);
      })
      .catch((ex) => {
        res.send(ex);
      });
  } else {
    res.sendStatus(500);
  }
});

exchangeCompanyController.get('/company/:name', (req, res) => {
  if (req.params.name) {
    findCompanyByName(req.params.name)
      .then(company => {
        res.json(company);
      })
      .catch((ex) => {
        res.send(ex);
      });
  } else {
    res.sendStatus(500);
  }
});

exchangeCompanyController.post('/', (req, res) => {
  const companyPayload = req.body;
  postExchangeCompany(companyPayload)
    .then(() => {
      res.sendStatus(200);
    })
    .catch((ex) => {
      res.send(ex);
    });
});

exchangeCompanyController.put('/:id', async (req, res) => {
  const companyId = req.params.id;
  const companyPayload = req.body;
  if (companyId) {
    findCompanyById(companyId)
      .then(company => {
        return updateCompany(company, companyPayload);
      })
      .catch(ex => console.error(ex));
    res.sendStatus(200);
  }
  res.sendStatus(500);
});

export default exchangeCompanyController;