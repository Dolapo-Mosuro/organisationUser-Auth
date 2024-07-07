const express = require("express");
const router = express.Router();
const { User, Org } = require("../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
// const authToken = require("../middlewares/authToken");
require("dotenv").config();

router.post("/register", async (req, res) => {
	const { userId, firstName, lastName, email, password, phone } = req.body;

	try {
		const hashedPassword = await bcrypt.hash(password, 10);
		const user = await User.create({
			userId,
			firstName,
			lastName,
			email,
			password: hashedPassword,
			phone,
		});

		const defaultOrg = await Org.create({
			orgId: `org-${userId}`,
			name: `Default Organization for ${userId}`,
			description: `This is the default organization for ${firstName} ${lastName}`,
		});

		await user.addOrg(defaultOrg);

		const token = jwt.sign({ userId: user.id }, process.env.JWT_KEY, {
			expiresIn: "1h",
		});

		res.status(201).json({
			status: "success",
			message: "Registration successful",
			data: {
				userId: user.userId,
				firstName: user.firstName,
				lastName: user.lastName,
				email: user.email,
				phone: user.phone,
			},
		});
	} catch (error) {
		if (error.name === "SequelizeValidationError") {
			const errors = error.errors.map((err) => ({
				field: err.path,
				message: err.message,
			}));
			res.status(422).json({
				errors,
			});
		} else {
			res.status(500).json({
				status: "error",
				message: "Internal server error",
			});
		}
	}
});

// router.get("/profile", authToken, async (req, res) => {
// 	try {
// 		const user = await User.findByPk(req.user.userId);
// 		res.json(user);
// 	} catch (error) {
// 		res.status(500).json({ message: "Internal server error" });
// 	}
// });
router.post("/login", async (req, res) => {
	const { email, password } = req.body;

	try {
		//check if user exists
		const user = await User.findOne({ where: { email } });

		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}
		//Validate password
		const isPasswordValid = await bcrypt.compare(password, user.password);

		if (!isPasswordValid) {
			return res.status(401).json({ message: "Invalid password" });
		}

		// Generate JWT token
		const token = jwt.sign(
			{ userId: user.id, email: user.email },
			process.env.JWT_KEY,
			{ expiresIn: "1h" }
		);
		//Response with token and user data
		res.status(200).json({
			message: "Login successful",
			token,
			userId: user.id,
			firstName: user.firstName,
			lastName: user.lastName,
			email: user.email,
			phone: user.phone,
		});
	} catch (error) {
		console.error(error)("Login error:", error);
		res.status(500).json({ message: "Internal server error" });
	}
});

module.exports = router;
