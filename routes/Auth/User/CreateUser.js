const express = require("express");

const router = express.Router();

const UserModel = require("../../../models/AuthModels/UserModel");

router.get("/users", async (req, res) => {
	try {
		const allUsers = await UserModel.find({});

		return res.json(allUsers);
	} catch (err) {
		throw new Error(err);
	}
});

module.exports = router;
