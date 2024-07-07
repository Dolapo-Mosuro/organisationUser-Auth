const request = require("supertest");
const jwt = require("jsonwebtoken");
const app = require("../src/app"); // Adjust the import path according to your project structure
const getPort = require("get-port"); // Example package for finding available ports

let server;
let port;

beforeAll(async () => {
	port = await getPort(); // Find an available port
	server = app.listen(port); // Start the server on the found port
});

afterAll((done) => {
	server.close(done); // Close the server after all tests are done
});

describe("POST /auth/register", () => {
	const defaultOrgName = (firstName) => `${firstName}'s Organisation`;

	it("Should Register User Successfully with Default Organisation", async () => {
		const userData = {
			firstName: "John",
			lastName: "Doe",
			email: "john.doe@example.com",
			password: "password123",
		};

		const response = await request(app).post("/auth/register").send(userData);

		expect(response.status).toBe(200);
		expect(response.body.user.firstName).toBe(userData.firstName);
		expect(response.body.user.organisation).toBe(
			defaultOrgName(userData.firstName)
		);
		const decodedToken = jwt.decode(response.body.token);
		expect(decodedToken.user).toMatchObject({
			email: userData.email,
			firstName: userData.firstName,
		});
		expect(decodedToken.exp).toBeGreaterThan(Date.now() / 1000);
	});

	// Additional tests (e.g., login, missing fields, duplicate email) would follow the same structure
});
