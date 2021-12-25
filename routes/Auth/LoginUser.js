const express = require("express");
const JWT = require("jsonwebtoken");
const router = express.Router();
// const bcrypt = require("bcryptjs");

const UserModel = require("../../models/UserModel");

router.post("/login", async (req, res, next) => {
	try {
		const users = await UserModel.find({});
		const { email, password, _id } = req.body;

		const user = users.find((user) => user?.email === email);
		if (user) {
			// const hashedPassword = await bcrypt.hash(password, 10);
			const isValidPassword = user?.password === password;

			if (isValidPassword) {
				const token = await JWT.sign({ _id }, process.env.JWT_SECRET, { expiresIn: 360000 });
				return res.json({ message: "You are logged in!", token });
			} else {
				return res.status(400).json({ status: 400, message: "Wrong password !" });
			}
		} else {
			return res.status(404).json({
				status: 404,
				message: "User doesn't exist!",
			});
		}
	} catch (err) {
		return next(err);
	}
});

module.exports = router;
