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
      res.send(null);
    }
  } else {
    res.send(null);
  }
});

centralBankController.get("/run", (req, res) => {
  const interval = req.query.interval;
  CentralBankSingleton.run(interval);
  res.send(`Central bank scheduler is running with interval: ${interval}ms`);
});

centralBankController.get("/stop", (req, res) => {
  CentralBankSingleton.stop();
  res.send("Central bank scheduler was stopped!");
});

export default centralBankController;