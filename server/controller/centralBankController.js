import express from 'express';
import {CentralBankSingleton} from "../service/centralBankService";

const centralBankController = express.Router({});

centralBankController.get("/", (req, res) => {
  const { currencyType, period } = req.query;

  if (currencyType) {
    if (currencyType.toLowerCase() === "usd") {
      res.json(CentralBankSingleton.getUsdPortion(period));
    } else if (currencyType.toLowerCase() === "eur") {
      res.json(CentralBankSingleton.getEurPortion(period));
    } else {
      res.send("currency type parameter is not correct");
    }
  } else {
    res.send("currency type parameter was not specified");
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