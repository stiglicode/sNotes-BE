const express = require("express");

const router = express.Router();

const UserModel = require("../../models/UserModel");
const { verifyUserToken } = require("../../middlewares");

router.get("/users", verifyUserToken, async (req, res) => {
	const formattedUser = (users) => {
		return users.map((user) => {
			return {
				id: user._id,
				nickname: user.nickname,
				firstname: user.firstname,
				lastname: user.lastname,
			};
		});
	};
	try {
		if (req.query.offset && req.query.length) {
			const allUsers = await UserModel.find({
				_id: { $nin: req._id },
			});
			const offsetUsers = allUsers.filter(
				(user, index) => index + 1 >= req.query.offset && index + 1 <= +req.query.offset + (+req.query.length - 1)
			);

			return res.json({
				count: allUsers.length,
				data: formattedUser(offsetUsers),
			});
		} else {
			const allUsers = await UserModel.find({});

			return res.json(formattedUser(allUsers));
		}
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

router.post("/user", verifyUserToken, async (req, res, next) => {
	try {
		let user = await UserModel.find({
			_id: req._id,
		});

		user = user[0];

		return res.json({
			nickname: user.nickname,
			firstname: user.firstname,
			lastname: user.lastname,
			permissions: user.permission,
			email: user.email,
			id: req._id,
		});
	} catch (err) {
		next(err);
	}
});

module.exports = router;
