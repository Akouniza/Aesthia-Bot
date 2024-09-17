// ./models/ticketSchema.js
const { DataTypes } = require('sequelize');
const sequelize = require('../../database/sequelize');

const Ticket = sequelize.define('Ticket', {
  Guild: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  Category: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = Ticket;
