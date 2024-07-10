const { Sequelize } = require("sequelize");
require("dotenv").config();
const pg = require("pg");

const sequelize = new Sequelize(
    process.env.DATABASE_NAME,
    default,
    lOKBchDd2xU8,
    {
        host: 'ep-super-bush-a4gsun3t.us-east-1.aws.neon.tech',
        dialect: "postgres",
        dialectModule: pg,
        port: process.env.DATABASE_PORT,
        logging: false,
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false
            }
        }
    }
);

module.exports = sequelize;
