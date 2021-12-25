const express = require("express");

const router = express.Router();

const UserModel = require("../../models/UserModel");
const { verifyUserToken } = require("../../middlewares/verify-token");

router.get("/users", verifyUserToken, async (req, res) => {
	try {
		const allUsers = await UserModel.find({});

		return res.json(allUsers);
	} catch (err) {
		throw new Error(err);
	}
});
router.get("/user/:id", verifyUserToken, async (req, res, next) => {
	try {
		const oneUser = await UserModel.find({
			id: req.params.id,
		});
		return res.json(oneUser);
	} catch (err) {
		next(err);
	}
});
router.get("/user/permission/:permission", verifyUserToken, async (req, res, next) => {
	try {
		const userPermission = await UserModel.find({
			permission: req.params.permission,
		});
		return res.json(userPermission);
	} catch (err) {
		next(err);
	}
});

module.exports = router;
