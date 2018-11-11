import express from 'express';
import bodyParser from 'body-parser';

import properties from "./properties";
import index from "./controller/index";
import models from "./model";

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/', index);

models.sequelize.sync().then(function () {
  app.listen(properties.PORT, () => {
    console.log(`😎 Server is listening on port ${properties.PORT}`);
  });
});
