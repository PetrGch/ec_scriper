import mysql from "mysql";

let db = null;

class DbConnector {
  constructor() {
    this._instance = null;
  }

  get instance() {
    return this._instance;
  }

  set instance(value) {
    this._instance = value;
  }

  init() {
    if (this._instance === null) {
      this._instance = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "((Gtnh))123123",
        database: "currency_exchange"
      });
    }
  }
}

(function() {
  if (db === null) {
    db = new DbConnector();
  }
})();

export default db;