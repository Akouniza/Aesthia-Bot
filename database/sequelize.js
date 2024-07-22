const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'mysql',
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Sequelize: Connection has been established successfully.');

    await sequelize.sync();
    console.log('All models were synchronized successfully.');
  } catch (error) {
    console.error('Sequelize: Unable to connect to the database or sync models:', error);
  }
})();

module.exports = sequelize;