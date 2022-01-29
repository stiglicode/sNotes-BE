const express = require("express");
const { verifyUserToken } = require("../../middlewares");
const router = express.Router();
const onSave = require("../../utilities/saved");

const GroupMetaModel = require("../../models/GroupModel/Meta");
const GroupContributorsModel = require("../../models/GroupModel/Contributors");

router.post("/new-user-init-group", verifyUserToken, async (req, res, next) => {
	try {
		const newGroupRecord = new GroupMetaModel({
			name: req.body.groupName,
			author: req._id,
			icon: req.body.groupIcon,
			shareable: req.body.groupShareable,
		});

		return newGroupRecord.save((err, savedMeta) => {
			return onSave(err, savedMeta, () => {
				const newGroupContributors = new GroupContributorsModel({
					group_id: savedMeta._id,
					contributor_id: req._id,
					isAuthor: true,
					permission: "writer",
					addBy: req._id,
				});

				return newGroupContributors.save((err, savedContributors) => {
					return onSave(err, savedContributors, () => {
						return res.json(savedContributors);
					});
				});
			});
		});
	} catch (err) {
		return next(err);
	}
});

module.exports = router;
