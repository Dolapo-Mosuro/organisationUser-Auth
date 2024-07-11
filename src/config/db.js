// const { Sequelize } = require("sequelize");
// require("dotenv").config();

// const sequelize = new Sequelize(
// 	process.env.DATABASE_NAME,
// 	process.env.DATABASE_USER,
// 	process.env.DATABASE_PASSWORD,
// 	{
// 		host: process.env.DATABASE_HOST,
// 		dialect: "postgres",
// 		port: process.env.DATABASE_PORT,
// 	}
// );

// module.exports = sequelize;

const { Sequelize } = require("sequelize");
require("dotenv").config();
const pg = require("pg");

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
		dialectOptions: {
			ssl: {
				require: true,
				rejectUnauthorized: false,
			},
		},
	}
);

module.exports = sequelize;
