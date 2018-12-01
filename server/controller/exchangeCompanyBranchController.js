import express from 'express';

import {postExchangeCompanyBranch} from "../service/exchangeCompanyBranchService";
import {findCompanyByBranchName} from "../service/exchangeCompanyService";

const exchangeCompanyBranchController = express.Router({});

// create branch/branches by company name
exchangeCompanyBranchController.post('/company/:name', (req, res) => {
  if (req.params.name) {
    const branchPayload = req.body;
    findCompanyByBranchName(req.params.name)
      .then((company) => {
        postExchangeCompanyBranch(company.id, branchPayload)
          .then(() => {
            res.sendStatus(200);
          }, (ex) => {
            res.send(ex);
          });
      }, (ex) => res.send(ex) );
  } else {
    res.sendStatus(500);
  }
});

// create branch/branches by branch name
exchangeCompanyBranchController.post('/branch/:name', (req, res) => {
  if (req.params.name) {
    const branchPayload = req.body;
    findCompanyByBranchName(req.params.name)
      .then((company) => {
        console.log(company.id)
        postExchangeCompanyBranch(company.id, branchPayload)
          .then(() => {
            res.sendStatus(200);
          }, (ex) => {
            res.send(ex);
          });
      }, (ex) => res.send(ex) );
  } else {
    res.sendStatus(500);
  }
});

export default exchangeCompanyBranchController;