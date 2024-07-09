const request = require("supertest");
const app = require("../src/app");
const { Org } = require("../src/models");

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

		const organisations = await Org.findAll({
			where: { name: "Default Organization" },
		});
		const createdOrganisation = organisations[0].toJSON();
		expect(createdOrganisation).not.toBeNull();
		expect(createdOrganisation.name).toEqual("Default Organization");
	});
});
