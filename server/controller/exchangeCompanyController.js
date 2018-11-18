import express from 'express';

import {
  deleteCompanyById,
  findCompanyByBranchName,
  findCompanyById, findCompanyByName,
  getAllExchangeCompanies,
  postExchangeCompany, updateCompany
} from "../service/exchangeCompanyService";
import {scraper} from "../../scriper/scraper";
import {updateCurrenciesAmount} from "../service/exchangeCurrencyService";

const exchangeCompanyController = express.Router({});

// get all companies
exchangeCompanyController.get('/', (req, res) => {
  getAllExchangeCompanies()
    .then(company => {
      res.json(company);
    })
    .catch(ex => res.send(ex));
});

// run scraper
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

// get company by id
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

// get company by branch name
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

// get company by name
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

// create new company
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

// update company by id
exchangeCompanyController.put('/:id', async (req, res) => {
  const companyId = req.params.id;
  const companyPayload = req.body;
  if (companyId) {
    findCompanyById(companyId)
      .then(company => {
        return updateCompany(company, companyPayload);
      })
      .then(() => {
        res.sendStatus(200);
      })
      .catch(ex => console.error(ex));
  } else {
    res.sendStatus(500);
  }
});

// delete company by id
exchangeCompanyController.delete('/:id', async (req, res) => {
  const companyId = req.params.id;
  if (companyId) {
    findCompanyById(companyId)
      .then(company => {
        return deleteCompanyById(company);
      })
      .then(() => {
        res.sendStatus(200);
      })
      .catch(ex => console.error(ex));
  } else {
    res.sendStatus(500);
  }
});

// delete company by branch name
exchangeCompanyController.delete('/branch/:name', async (req, res) => {
  if (req.params.name) {
    findCompanyByBranchName(req.params.name)
      .then(company => {
        return deleteCompanyById(company);
      })
      .then(() => {
        res.sendStatus(200);
      })
      .catch(ex => console.error(ex));
  } else {
    res.sendStatus(500);
  }
});

export default exchangeCompanyController;