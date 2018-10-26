const Sequelize = require('sequelize');
const sequelize = new Sequelize('currency_exchange_test', 'root', '((Gtnh))123123', {
  host: 'localhost',
  dialect: 'mysql',
  operatorsAliases: false,

  pool: {
    max: 10,
    min: 0,
    acquire: 60000,
    idle: 30000
  },
});

const models = {
  ExchangeCompany: require('./ExchangeCompany')(sequelize, Sequelize.DataTypes),
  ExchangeCurrency: require('./ExchangeCurrency')(sequelize, Sequelize.DataTypes),
  ExchangeCurrencyAmount: require('./ExchangeCurrencyAmount')(sequelize, Sequelize.DataTypes)
};

Object.keys(models).forEach(function(modelName) {
  if ('associate' in models[modelName]) {
    models[modelName].associate(models);
  }
});

models.sequelize = sequelize;
models.Sequelize = Sequelize;

module.exports = models;

// Or you can simply use a connection uri
// const sequelize = new Sequelize('postgres://user:pass@example.com:5432/dbname');

// sequelize
//   .authenticate()
//   .then(() => {
//     console.log('Connection has been established successfully.');
//   })
//   .catch(err => {
//     console.error('Unable to connect to the database:', err);
//   });
//
// const User = sequelize.define('user', {
//   firstName: {
//     type: Sequelize.STRING
//   },
//   lastName: {
//     type: Sequelize.STRING
//   }
// });
//
// const Task = sequelize.define('task', {
//   name: {
//     type: Sequelize.STRING
//   }
// });
//
// const Author = sequelize.define('author', {
//   name: {
//     type: Sequelize.STRING
//   }
// });
//
// Task.belongsTo(User);
// Author.belongsTo(Task);
// User.hasMany(Task);
// Task.hasOne(Author);
//
// // User.findOne({ where: {id: 1} })
// //   .then(user => {
// //     console.log(JSON.stringify(user));
// //     user.update({ firstName: "Petr" }).then(updatedUser => {
// //       console.log(JSON.stringify(updatedUser));
// //     });
// //   });
//
// // User.bulkCreate([
// //   { firstName: 'barfooz', lastName: "Some" },
// //   { firstName: 'Petr', lastName: "Gulchuk" },
// //   { firstName: 'foo', lastName: "Some" },
// //   { firstName: 'bar', lastName: "Some" }
// // ]).then(() => { // Notice: There are no arguments here, as of right now you'll have to...
// //   return User.findAll();
// // }).then(users => {
// //   console.log(JSON.stringify(users)) // ... in order to get the array of user objects
// // })
//
// User.destroy({
//   where: {lastName: "Some"}
// }).then(() => {
//   User.findAll()
//     .then(users => {
//       console.log(JSON.stringify(users))
//     })
// })


// User.build({ firstName: "Petr", lastName: "Gulchuk" })
//   .save()
//   .then(() => {
//     User.findAll().then(users => {
//       console.log(JSON.stringify(users));
//     })
//   });

// sequelize.sync().then(() => {
//   User.findOne({
//     where: {id: 1},
//     attributes: ['id', 'firstName', 'lastName'],
//     include: [
//       {
//         model: Task,
//         where: {id: 3},
//         attributes: ['id', 'name'],
//         include: {
//           model: Author,
//           attributes: ['id', 'name']
//         }
//       }]
//   })
//     .then(user => {
//       console.log(JSON.stringify(user));
//     });
// });

// force: true will drop the table if it already exists
// User.sync({force: true}).then(() => {
//   // Table created
//   return User.create({
//     firstName: 'John',
//     lastName: 'Hancock'
//   });
// });

// User.findAll().then(users => {
//   console.log(users)
// });

// User.findOne({
//   where: {firstName: 'John'}
// }).then(user => {
//   console.log(user.dataValues);
// });

// sequelize
//   .query('select * from exchange_company where id = ?',
//     {row: true, replacements: [5]})
//   .then(user => {
//   console.log(user);
// });
