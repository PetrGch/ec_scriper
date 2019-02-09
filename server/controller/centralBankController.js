import express from 'express';
import {
  CentralBankSingleton,
  getCentralBankDataByCurrencyTypeAndRange
} from "../service/centralBankService";

const centralBankController = express.Router({});

centralBankController.get("/", (req, res) => {
  const { currencyType, period } = req.query;

  if (currencyType) {
    getCentralBankDataByCurrencyTypeAndRange(currencyType)
      .then((data) => {
        const returnData = period && typeof period === "number"
          ? Object.assign(data.dataValues, { central_bank_details: data.dataValues.central_bank_details.slice(-period) })
          : data;
        res.status(200).json(returnData);
      }).catch((ex) => {
        res.status(500).send(ex);
      });
  } else {
    res.status(500).send("currency type parameter was not specified");
  }
});

centralBankController.get("/run", (req, res) => {
  const interval = req.query.interval;
  res.send(CentralBankSingleton.run(interval));
});

centralBankController.get("/stop", (req, res) => {
  res.send(CentralBankSingleton.stop());
});

centralBankController.get("/restart", (req, res) => {
  const interval = req.query.interval;
  res.send(CentralBankSingleton.restart(interval));
});

export default centralBankController;