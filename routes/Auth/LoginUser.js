const express = require("express");
const JWT = require("jsonwebtoken");
const router = express.Router();
const bcrypt = require("bcryptjs");

const UserModel = require("../../models/UserModel");

router.post("/login", async (req, res, next) => {
	try {
		const users = await UserModel.find({});
		const { email, password } = req.body;

		const user = users.find((user) => user?.email === email);
		if (user) {
			const isValidPassword = await bcrypt.compare(password, user.password);

			if (isValidPassword) {
				const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: 3600 * 24 });

				return res.json({ status: 200, message: "You are logged in!", token });
			} else {
				return res.json({ status: 400, error: "e-p", message: "Wrong password !" });
			}
		} else {
			return res.json({
				status: 404,
				error: "e-e",
				message: "User doesn't exist!",
			});
		}
	} catch (err) {
		return next(err);
	}
});

module.exports = router;
