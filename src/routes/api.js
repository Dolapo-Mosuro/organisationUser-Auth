const express = require("express");
const router = express.Router();
const { User, Organisation } = require("../models");
const authToken = require("../middlewares/authToken");

router.use(authToken);

// GET /api/users/:id - Fetch user details by userId
router.get("/users/:id", authToken, async (req, res) => {
	const userId = req.params.id;
	const loggedInUserId = req.user.userId; // Extracted from the decoded JWT token

	try {
		// Check if the requested user ID matches the logged-in user's ID
		if (userId !== loggedInUserId) {
			return res.status(403).json({ message: "Unauthorized access" });
		}

		// Fetch user data from the database
		const user = await User.findOne({ where: { userId } });

		// If user not found, return 404 response
		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		// Return user data
		res.status(200).json({
			status: "success",
			message: "User details fetched successfully",
			data: {
				userId: user.userId,
				firstName: user.firstName,
				lastName: user.lastName,
				email: user.email,
				phone: user.phone,
			},
		});
	} catch (error) {
		console.error("Error fetching user error:", error);
		res.status(400).json({
			status: "Bad request",
			message: "Client error",
			statusCode: 400,
		});
	}
});

router.get("/users", authToken, async (req, res) => {
	try {
		const users = await User.findAll();
		res.json(users);
	} catch (error) {
		res.status(500).json({ message: "Internal server error" });
	}
});

router.get("/organisations", async (req, res) => {
	try {
		const user = await User.findByPk(req.user.id, {
			include: Organisation,
		});
		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}
		res.status(201).json({
			status: "success",
			message: "Organization created successfully",
			data: {
				organisations: user.Orgs.map((org) => ({
					OrganisationId: org.OrganisationId,
					name: org.name,
					description: org.description,
				})),
			},
		});
	} catch (error) {
		console.error("Error fetching user's organizations:", error);
		res.status(400).json({ message: "Client error" });
	}
});

router.get("/organisations/:OrganisationId", authToken, async (req, res) => {
	try {
		const org = await Organisation.findOne({
			where: { OrganisationId: req.params.OrganisationId },
		});
		if (!org) {
			return res.status(404).json({ message: "Organization not found" });
		}

		res.status(200).json({
			status: "success",
			message: "User added to organization successfully",
			data: {
				OrganisationId: org.OrganisationId,
				name: org.name,
				description: org.description,
			},
		});
	} catch (error) {
		console.error("Error fetching organization:", error);
		res.status(500).json({ message: "Internal server error" });
	}
});

router.post("/organisations", async (req, res) => {
	const { OrganisationId, name, description } = req.body;

	try {
		const org = await Organisation.create({
			OrganisationId,
			name,
			description,
		});
		es.status(201).json({
			status: "success",
			message: "Organization created successfully",
			data: {
				OrganisationId: org.OrganisationId,
				name: org.name,
				description: org.description,
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

router.post("/organisations/:OrganisationId/users", async (req, res) => {
	const { userId } = req.body;

	try {
		const org = await Organisation.findOne({
			where: { OrganisationId: req.params.OrganisationId },
		});
		if (!org) {
			return res.status(404).json({ message: "Organization not found" });
		}
		const user = await User.findByPk(userId);
		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}
		await org.addUser(user);
		res
			.status(200)
			.json({ message: "User added to organization successfully" });
	} catch (error) {
		res.status(500).json({ message: "Internal server error" });
	}
});

module.exports = router;
