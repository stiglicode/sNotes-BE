const express = require("express");

const router = express.Router();

const UserModel = require("../../../models/UserModel");
const { lastQuery } = require("../../../utilities/last-query");

router.get("/users", async (req, res) => {
	try {
		const allUsers = await UserModel.find({});

		return res.json(allUsers);
	} catch (err) {
		throw new Error(err);
	}
});
router.get("/user/:id", async (req, res) => {
	try {
		const oneUser = await UserModel.find({
			id: lastQuery(req),
		});
		return res.json(oneUser);
	} catch (err) {
		next(err);
	}
});
router.get("/user/permission/:permission", async (req, res) => {
	try {
		const userPermission = await UserModel.find({
			permission: lastQuery(req),
		});
		return res.json(userPermission);
	} catch (err) {
		next(err);
	}
});

module.exports = router;
