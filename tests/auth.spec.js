const request = require("supertest");
const { Sequelize } = require("sequelize");
const { User, Organisation } = require("../src/models");
const app = require("../src/app");

// Mock database setup
const sequelize = new Sequelize("sqlite::memory:", { logging: false });

beforeAll(async () => {
	// Clear the users table before each test
	await User.destroy({ where: {}, truncate: true });
});

afterAll(async () => {
	await sequelize.close();
});

describe("User Model", () => {
	it("should hash user password before saving", async () => {
		const user = User.build({
			userId: "some-uuid",
			firstName: "John",
			lastName: "Doe",
			email: "johndoe@example.com",
			password: "password",
		});
		await user.save();

		expect(user.password).not.toEqual("password");
	});

	it("should create a user with valid details", async () => {
		const user = await User.create({
			userId: "some-uuid",
			firstName: "Jane",
			lastName: "Doe",
			email: "janedoe@example.com",
			password: "password",
		});

		expect(user).toBeDefined();
		expect(user.email).toBe("janedoe@example.com");
	});
});

describe("Authentication API", () => {
	let authToken;

	beforeAll(async () => {});

	it("should register a new user", async () => {
		const response = await request(app).post("/auth/register").send({
			firstName: "John",
			lastName: "Doe",
			email: "johndoe@example.com",
			password: "password",
		});

		expect(response.status).toBe(201);
		expect(response.body).toHaveProperty("data");
		expect(response.body.data.user.firstName).toEqual("John");
		expect(response.body.data.user.email).toEqual("johndoe@example.com");
		expect(response.body.data).toHaveProperty("accessToken");

		authToken = response.body.data.accessToken;
	});

	it("should create default organization for new user", async () => {
		const response = await request(app)
			.post("/organisations")
			.set("Authorization", `Bearer ${authToken}`)
			.send({
				orgId: "default-org-id",
				name: "Default Organization",
				description: "Default organization description",
			});

		expect(response.status).toBe(201);

		const organisations = await Organisation.findAll({
			where: { name: "Default Organization" },
		});
		const createdOrganisation = organisations[0].toJSON();
		expect(createdOrganisation).not.toBeNull();
		expect(createdOrganisation.name).toEqual("Default Organization");
	});
});

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
