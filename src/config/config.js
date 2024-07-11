require("dotenv").config();

const config = {
	development: {
		username: process.env.DATABASE_USER,
		password: process.env.DATABASE_PASSWORD,
		database: process.env.DATABASE_NAME,
		host: process.env.DATABASE_HOST,
		port: process.env.DATABASE_PORT,
		dialect: "postgres",
	},
	test: {
		username: process.env.DATABASE_USER,
		password: process.env.DATABASE_PASSWORD,
		database: process.env.TEST_DATABASE_NAME,
		host: process.env.DATABASE_HOST,
		port: process.env.DATABASE_PORT,
		dialect: "postgres",
	},
	production: {
		username: process.env.DATABASE_USER,
		password: process.env.DATABASE_PASSWORD,
		database: process.env.PRODUCTION_DATABASE_NAME,
		host: process.env.DATABASE_HOST,
		dialect: "postgres",
	},
};
module.exports = config;
