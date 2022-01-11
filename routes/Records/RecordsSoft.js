const express = require("express");

const router = express.Router();

const UserModel = require("../../models/UserModel");
const { verifyUserToken } = require("../../middlewares/verify-token");

router.get("/records/details", verifyUserToken, async (req, res) => {
	try {
		const allUsers = await UserModel.find({});

		return res.json(allUsers);
	} catch (err) {
		throw new Error(err);
	}
});
