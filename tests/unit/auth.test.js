const { User } = require("../../src/models");

describe("Auth Model", () => {
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
});
