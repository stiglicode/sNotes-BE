const express = require("express");
const router = express.Router();
const UserModel = require("../../models/UserModel");
const bcrypt = require("bcryptjs");
const JWT = require("jsonwebtoken");
const GroupMetaModel = require("../../models/GroupModel/Meta");
const GroupContributorsModel = require("../../models/GroupModel/Contributors");

const onSave = require("../../utilities/saved");

router.post("/create-user", async (req, res, next) => {
	try {
		const id = await UserModel.find({});
		const hashedPassword = await bcrypt.hash(req.body.password, 10);

		const newUser = new UserModel({ ...req.body, id: id.length + 1, password: hashedPassword });

		const { _id } = await newUser.save();

		const token = await JWT.sign({ _id }, process.env.JWT_SECRET, { expiresIn: 360000 });
		const newGroupRecord = new GroupMetaModel({
			name: "Personal",
			author: _id,
			defaultOpen: true,
			contributors_count: 1,
			icon: "DeckIcon",
			shareable: false,
			permanent: true,
		});

		return newGroupRecord.save((err, savedMeta) => {
			return onSave(err, savedMeta, () => {
				const newGroupContributors = new GroupContributorsModel({
					group_id: savedMeta._id,
					contributor_id: _id,
					isAuthor: true,
					permission: "writer",
					addBy: _id,
				});

				return newGroupContributors.save((err, savedContributors) => {
					return onSave(err, savedContributors, () => {
						return res.json({ message: "You are successfully signed up!", token });
					});
				});
			});
		});
	} catch (error) {
		return next(error);
	}
});

module.exports = router;
