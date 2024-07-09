const { User } = require("../../src/models");

describe("User Model", () => {
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
