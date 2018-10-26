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

// Or you can simply use a connection uri
// const sequelize = new Sequelize('postgres://user:pass@example.com:5432/dbname');

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

const User = sequelize.define('user', {
  firstName: {
    type: Sequelize.STRING
  },
  lastName: {
    type: Sequelize.STRING
  }
});

const Task = sequelize.define('task', {
  name: {
    type: Sequelize.STRING
  }
});

const Author = sequelize.define('author', {
  name: {
    type: Sequelize.STRING
  }
});

Task.belongsTo(User);
Author.belongsTo(Task);
User.hasMany(Task);
Task.hasOne(Author);

// User.destroy({
//   where: {lastName: "Some"}
// }).then(() => {
//   User.findAll()
//     .then(users => {
//       console.log(JSON.stringify(users))
//     })
// });

sequelize.sync().then(() => {
  // Task.create({name: "first task", userId: 1})

  User.findAll({
    // where: {id: 1},
    attributes: ['id', 'firstName', 'lastName'],
    include: [
      {
        model: Task,
        // where: {id: 3},
        // attributes: ['id', 'name'],
        // include: {
        //   model: Author,
        //   attributes: ['id', 'name']
        // }
      }]
  })
    .then(user => {
      console.log(JSON.stringify(user));
    });
});

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
