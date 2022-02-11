const express = require("express");
const { verifyUserToken } = require("../../middlewares");
const router = express.Router();
const GroupContributorsModel = require("../../models/GroupModel/Contributors");

router.get("/", verifyUserToken, async (req, res, next) => {
	try {
		const allPending = await GroupContributorsModel.find({
			contributor_id: req._id,
			pending: true,
		});

		const typeArr = [];

		allPending.length && typeArr.push("new-group");

		const result = {
			count: allPending.length,
			type: typeArr,
		};

		res.status(200).json(result);
	} catch (err) {
		return next(err);
	}
});

// router.post("/push", verifyUserToken, async (req, res, next) => {});

module.exports = router;
