const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = function authToken(req, res, next) {
	// Extract token from Authorization header
	const authHeader = req.headers.authorization;

	if (!authHeader || !authHeader.startsWith("Bearer ")) {
		return res.status(401).json({ message: "Unauthorized" });
	}

	// Get the JWT token excluding 'Bearer '
	const token = authHeader.replace("Bearer ", "");

	try {
		// Verify token
		const decoded = jwt.verify(token, process.env.JWT_KEY);
		req.user = decoded; // Attach decoded user information to request object
		next(); // Call next middleware
	} catch (error) {
		console.error("JWT verification error:", error);
		return res.status(403).json({ message: "Forbidden" });
	}
};
