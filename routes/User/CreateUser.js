const express = require("express");
const router = express.Router();
const UserModel = require("../../models/UserModel");
const bcrypt = require("bcryptjs");
const JWT = require("jsonwebtoken");

router.post("/create-user", async (req, res, next) => {
	try {
		const id = await UserModel.find({});
		const hashedPassword = await bcrypt.hash(req.body.password, 10);

		const newUser = new UserModel({ ...req.body, id: id.length + 1, password: hashedPassword });

		const { _id } = await newUser.save();

		const token = await JWT.sign({ _id }, process.env.JWT_SECRET, { expiresIn: 360000 });
		return res.json({ message: "You are successfully signed up!", token });
	} catch (error) {
		return next(error);
	}
});

module.exports = router;
