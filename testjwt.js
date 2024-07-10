const jwt = require("jsonwebtoken");

// Load environment variables
require("dotenv").config();

const payload = {
	userId: 1,
	email: "user@example.com",
};

// Sign the token with your JWT key from the environment variable
const token = jwt.sign(payload, process.env.JWT_KEY, { expiresIn: "1h" });

console.log("Token:", token);

// Verify the token using the JWT key from the environment variable
jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
	if (err) {
		console.error("Token verification failed:", err);
		return;
	}

	console.log("Token is valid. Decoded payload:", decoded);
});
