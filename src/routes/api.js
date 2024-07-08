const express = require("express");
const router = express.Router();
const { User, Org } = require("../models");
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

router.get("/users", async (req, res) => {
	try {
		const users = await User.findAll();
		res.json(users);
	} catch (error) {
		res.status(500).json({ message: "Internal server error" });
	}
});

router.get("/organisations", async (req, res) => {
	try {
		const user = await User.findByPk(req.user.userId, {
			include: Org,
		});
		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}
		res.json(user.Orgs);
	} catch (error) {
		res.status(500).json({ message: "Internal server error" });
	}
});

router.get("/organisations/:orgId", async (req, res) => {
	try {
		const org = await Org.findOne({ where: { orgId: req.params.orgId } });
		if (!org) {
			return res.status(404).json({ message: "Organization not found" });
		}
		res.json(org);
	} catch (error) {
		res.status(500).json({ message: "Internal server error" });
	}
});

router.post("/organisations", async (req, res) => {
	const { orgId, name, description } = req.body;

	try {
		const org = await Org.create({ orgId, name, description });
		res.status(201).json(org);
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

router.post("/organisations/:orgId/users", async (req, res) => {
	const { userId } = req.body;

	try {
		const org = await Org.findOne({ where: { orgId: req.params.orgId } });
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
