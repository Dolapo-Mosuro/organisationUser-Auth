const express = require("express");
const jwt = require("jsonwebtoken");
const sequelize = require("./config/db");
const bodyParser = require("body-parser");
require("dotenv").config();
const authRoutes = require("./routes/auth");
const apiRoutes = require("./routes/api");
const app = express();

const PORT = process.env.PORT;

// Middleware to parse JSON request bodies
app.use(bodyParser.json());

app.get("/api", (req, res) => {
	res.send("Hello, world!");
});

// Routes
app.use("/auth", authRoutes);
app.use("/api", apiRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(500).json({ message: "Internal Server Error" });
});

sequelize
	.authenticate()
	.then(() => {
		console.log("Database connection has been established successfully.");
		app.listen(PORT, () => {
			console.log(`Server running on port ${PORT}`);
		});
	})
	.catch((err) => {
		console.error("Unable to connect to the database:", err);
	});

module.exports = app;
