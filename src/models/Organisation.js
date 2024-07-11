const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const User = require("./user");

const Organisation = sequelize.define(
	"Organisation",
	{
		OrganisationId: {
			type: DataTypes.STRING,
			unique: true,
			primaryKey: true,
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
		tableName: "organisations",
		timestamps: true,
	}
);

module.exports = Organisation;
