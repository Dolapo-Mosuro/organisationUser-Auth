const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const User = require("./user");

const Org = sequelize.define(
	"Org",
	{
		orgId: {
			type: DataTypes.STRING,
			unique: true,
			allowNull: false,
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		description: {
			type: DataTypes.STRING,
			allowNull: true,
		},
	},
	{
		tableName: "organizations",
		timestamps: true,
	}
);

module.exports = Org;
