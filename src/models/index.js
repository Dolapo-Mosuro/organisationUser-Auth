const Sequelize = require("sequelize");
const sequelize = require("../config/db");
const User = require("./user");
const Org = require("./org");

// Define many-to-many relationship
Org.belongsToMany(User, { through: "UserOrganisations" });
User.belongsToMany(Org, { through: "UserOrganisations" });

const database = {
	Sequelize,
	sequelize,
	User,
	Org,
};

database.sequelize
	.sync()
	.then(() => console.log("Database and tables connected"))
	.catch((err) => console.log("Error at syncing database", +err));

module.exports = database;
