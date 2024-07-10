require("dotenv").config();

const config = {
	production: {
		username: process.env.DATABASE_USER,
		password: process.env.DATABASE_PASSWORD,
		database: process.env.PRODUCTION_DATABASE_NAME,
		host: process.env.DATABASE_HOST,
		dialect: "postgres",
	},
};
module.exports = config;
