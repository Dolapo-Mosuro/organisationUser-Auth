// src/routes/api.js
const express = require("express");
const router = express.Router();
const { User, Org } = require("../models");
const authToken = require("../middlewares/authToken");

router.use(authToken);

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
		res.status(200).json({ message: "User added to organization" });
	} catch (error) {
		res.status(500).json({ message: "Internal server error" });
	}
});

module.exports = router;
