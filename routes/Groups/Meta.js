const express = require("express");
const { verifyUserToken, verifyMembership } = require("../../middlewares");
const router = express.Router();
const onSave = require("../../utilities/saved");

const GroupMetaModel = require("../../models/GroupModel/Meta");

router.post("/meta/create", verifyUserToken, async (req, res, next) => {
	try {
		const newGroup = new GroupMetaModel({
			name: req.body.groupName,
			author: req._id,
			icon: req.body.groupIcon,
			shareable: req.body.groupShareable,
		});

		return newGroup.save((err, saved) => {
			return onSave(err, saved, () => {
				return res.json({
					groupName: saved.name,
					groupIcon: saved.icon,
					groupId: saved._id,
				});
			});
		});
	} catch (err) {
		return next(err);
	}
});

router.put("/meta/update/:group_id", [verifyUserToken, verifyMembership], async (req, res, next) => {
	return await GroupMetaModel.updateOne(
		{ _id: req.params.group_id, isDeleted: false },
		{
			name: req.body.groupName,
			icon: req.body.groupIcon,
			shareable: req.body.groupShareable,
			updated_at: Date.now(),
		}
	)
		.then(async () => {
			const result = await GroupMetaModel.findOne({
				_id: req.params.group_id,
			});

			return res.status(200).json(result);
		})
		.catch((err) => next(err));
});

router.delete("/meta/remove/:group_id", [verifyUserToken, verifyMembership], async (req, res, next) => {
	const deleteDate = Date.now();
	return await GroupMetaModel.updateOne(
		{ _id: req.params.group_id, isDeleted: false, permanent: false },
		{
			isDeleted: true,
			deleted_at: deleteDate,
		}
	)
		.then(async () => {
			const result = await GroupMetaModel.findOne({
				_id: req.params.group_id,
			});

			if (!result.permanent) {
				return res.status(200).json(result);
			} else {
				return res.json({ message: "File cannot be removed" });
			}
		})
		.catch((err) => next(err));
});

module.exports = router;
