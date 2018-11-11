require('dotenv').config();

const properties = {
  "PORT":  process.env.PORT || 3000,
  "DATABASE_NAME": process.env.DATABASE_NAME,
  "DATABASE_USER_NAME": process.env.DATABASE_USER_NAME,
  "DATABASE_PASSWORD": process.env.DATABASE_PASSWORD
};

export default properties;