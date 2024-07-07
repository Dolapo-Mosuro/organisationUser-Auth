const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const User = require("./user");

const Org = sequelize.define(
	"Org",
	{
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
		},
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
