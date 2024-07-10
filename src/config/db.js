const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
	process.env.DATABASE_NAME,
	process.env.DATABASE_USER,
	process.env.DATABASE_PASSWORD,
	{
		host: process.env.DATABASE_HOST,
		dialect: "postgres",
		dialectModule: pg,
		port: process.env.DATABASE_PORT,
		logging: false,
	}
);

module.exports = sequelize;
