import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

import properties from "./properties";
import index from "./controller/index";
import models from "./model";

const app = express();

const corsOptions = {
  origin: "http://localhost:3000",
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/', cors(corsOptions), index);

models.sequelize.sync().then(function () {
  app.listen(properties.PORT, () => {
    console.log(`😎 Server is listening on port ${properties.PORT}`);
  });
});
