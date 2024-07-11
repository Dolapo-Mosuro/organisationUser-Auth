const express = require("express");
const router = express.Router();
const { User, Organisation } = require("../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const generateUniqueId = (value) => {
	const timestamp = Date.now();
	const randomString = Math.random().toString(36).substring(2, 15);
	return `${value.toLowerCase()}-${timestamp}-${randomString}`;
};

router.post("/register", async (req, res) => {
	const { firstName, lastName, email, password, phone } = req.body;
	console.log(req.body);
	// Validate input fields
	if (!firstName || !lastName || !email || !password) {
		return res.status(422).json({
			errors: [
				{
					field: !firstName
						? "firstName"
						: !lastName
						? "lastName"
						: !email
						? "email"
						: "password",
					message: "This field is required",
				},
			],
		});
	}

	try {
		const hashedPassword = await bcrypt.hash(password, 10);

		const userId = generateUniqueId("user");

		const user = await User.create({
			userId,
			firstName,
			lastName,
			email,
			password: hashedPassword,
			phone,
		});

		//const defaultOrg = await Organisation.create({
		//	OrganisationId: `org-${userId}`,
		//	name: `Default Organization for ${userId}`,
		//	description: `This is the default organization for ${firstName} ${lastName}`,
		//});

		//await user.addOrganisation(defaultOrg);

		const token = jwt.sign({ userId: user.id }, process.env.JWT_KEY, {
			expiresIn: "1h",
		});

		res.status(201).json({
			status: "success",
			message: "Registration successful",
			data: {
				accessToken: token,
				user: {
					userId: user.userId,
					firstName: user.firstName,
					lastName: user.lastName,
					email: user.email,
					phone: user.phone,
				},
			},
		});
	} catch (error) {
		console.error("Registration error:", error);
		res.status(400).json({
			status: "Bad request",
			message: "Registration unsuccessful",
			statusCode: 400,
		});
	}
});

// Login Route
router.post("/login", async (req, res) => {
	const { email, password } = req.body;

	try {
		// Check if user exists
		const user = await User.findOne({ where: { email } });

		if (!user) {
			return res.status(401).json({
				status: "Bad request",
				message: "Authentication failed",
				statusCode: 401,
			});
		}

		// Validate password
		const hashedPassword = await bcrypt.hash(password, 10);
		const isPasswordValid = await bcrypt.compare(password, user.password);

		if (!isPasswordValid) {
			return res.status(401).json({
				status: "Bad request",
				message: "Authentication failed",
				statusCode: 401,
			});
		}

		// Generate JWT token
		const token = jwt.sign(
			{ userId: user.userId, email: user.email },
			process.env.JWT_KEY,
			{ expiresIn: "1h" }
		);

		// Response with token and user data
		res.status(200).json({
			status: "success",
			message: "Login successful",
			data: {
				accessToken: token,
				user: {
					userId: user.userId,
					firstName: user.firstName,
					lastName: user.lastName,
					email: user.email,
					phone: user.phone,
				},
			},
		});
	} catch (error) {
		console.error("Login error:", error);
		res.status(401).json({
			status: "Bad request",
			message: "Authentication failed",
			statusCode: 401,
		});
	}
});

module.exports = router;
