// database/sequelize.js
const { Sequelize } = require('sequelize');
const dbConfig = require('../events/db'); // Import your MySQL connection

const sequelize = new Sequelize({
    dialect: 'mysql',
    host: dbConfig.config.host,
    port: dbConfig.config.port,
    username: dbConfig.config.user,
    password: dbConfig.config.password,
    database: dbConfig.config.database,
});

// Test the connection and create tables
(async () => {
    try {
        await sequelize.authenticate();
        console.log('Sequelize: Connection has been established successfully.');

        // Sync all models
        await sequelize.sync();
        console.log('All models were synchronized successfully.');
    } catch (error) {
        console.error('Sequelize: Unable to connect to the database or sync models:', error);
    }
})();

module.exports = sequelize; // Export only the sequelize instance
