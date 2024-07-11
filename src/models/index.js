// const Sequelize = require("sequelize");
// const sequelize = require("../config/db");
// const User = require("./user");
// const Organisation = require("./Organisation");

// // Define many-to-many relationship
// Organisation.belongsToMany(User, { through: "UserOrganisations" });
// User.belongsToMany(Organisation, { through: "UserOrganisations" });

// const database = {
// 	Sequelize,
// 	sequelize,
// 	User,
// 	Organisation,
// };

// database.sequelize
// 	.sync()
// 	.then(() => console.log("Database and tables connected"))
// 	.catch((err) => console.log("Error at syncing database", +err));

// module.exports = database;

const Sequelize = require("sequelize");
const sequelize = require("../config/db");
const User = require("./user");
const Organisation = require("./Organisation");

// Define many-to-many relationship
Organisation.belongsToMany(User, { through: "UserOrganisations" });
User.belongsToMany(Organisation, { through: "UserOrganisations" });

const database = {
	Sequelize,
	sequelize,
	User,
	Organisation,
};

database.sequelize
	.sync()
	.then(() => console.log("Database and tables connected"))
	.catch((err) => console.log("Error at syncing database", +err));

module.exports = database;
