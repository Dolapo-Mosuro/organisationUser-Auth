const request = require("supertest");
const app = require("../src/app"); // Assuming your Express app is exported from src/app.js

describe("User Endpoints", () => {
	let authToken;

	beforeAll(async () => {
		// Authenticate and get a valid token
		const response = await request(app).post("/auth/login").send({
			email: "johndoe@example.com",
			password: "password",
		});
		authToken = response.body.data.accessToken;
	});

	it("should get user details successfully", async () => {
		const response = await request(app)
			.get("/api/users/:id")
			.set("Authorization", `Bearer ${authToken}`);

		expect(response.status).toBe(200);
		expect(response.body).toHaveProperty("status", "success");
		expect(response.body.data).toHaveProperty("userId");
	});

	it("should get user's organizations successfully", async () => {
		const response = await request(app)
			.get("/api/organisations")
			.set("Authorization", `Bearer ${authToken}`);

		expect(response.status).toBe(200);
		expect(response.body).toHaveProperty("status", "success");
		expect(response.body.data).toHaveProperty("organisations");
	});

	it("should get a single organization record successfully", async () => {
		const response = await request(app)
			.get("/api/organisations/:orgId")
			.set("Authorization", `Bearer ${authToken}`);

		expect(response.status).toBe(200);
		expect(response.body).toHaveProperty("status", "success");
		expect(response.body.data).toHaveProperty("orgId");
	});

	it("should create a new organization successfully", async () => {
		const newOrg = {
			name: "Test Organisation",
			description: "This is a test organization",
		};
		const response = await request(app)
			.post("/api/organisations")
			.send(newOrg)
			.set("Authorization", `Bearer ${authToken}`);

		expect(response.status).toBe(201);
		expect(response.body).toHaveProperty("status", "success");
		expect(response.body.data).toHaveProperty("orgId");
	});

	it("should add a user to an organization successfully", async () => {
		const user = {
			userId: "someUserId",
		};
		const response = await request(app)
			.post("/api/organisations/:orgId/users")
			.send(user)
			.set("Authorization", `Bearer ${authToken}`);

		expect(response.status).toBe(200);
		expect(response.body).toHaveProperty("status", "success");
		expect(response.body).toHaveProperty(
			"message",
			"User added to organization successfully"
		);
	});
});
