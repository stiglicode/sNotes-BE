const express = require("express");

const router = express.Router();

const UserModel = require("../../models/UserModel");

router.post("/create-user", async (req, res, next) => {
	try {
		const id = await UserModel.find({});
		const newUser = new UserModel({ ...req.body, id: id.length + 1 });

		const addUser = await newUser.save();

		return res.json(addUser);
	} catch (error) {
		return next(error);
	}
});

module.exports = router;
