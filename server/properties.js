require('dotenv').config();
const PORT = process.env.PORT || 3000;

const properties = {
  "port":  PORT,
  "DATABASE_NAME": process.env.DATABASE_NAME,
  "DATABASE_USER_NAME": process.env.DATABASE_USER_NAME,
  "DATABASE_PASSWORD": process.env.DATABASE_PASSWORD
};

export default properties;