const express = require("express");
const { verifyUserToken } = require("../../middlewares");
const router = express.Router();

const GroupMetaModel = require("../../models/GroupModel/Meta");
const GroupContributorsModel = require("../../models/GroupModel/Contributors");
const UserModel = require("../../models/UserModel");
const onSave = require("../../utilities/saved");

router.get("/", verifyUserToken, async (req, res, next) => {
	try {
		const GroupContributors = await GroupContributorsModel.find({
			contributor_id: req._id,
			pending: false,
		});
		const GroupMeta = await GroupMetaModel.find({});

		const allGroupContributors = await GroupContributorsModel.find({});
		const allUsers = await UserModel.find({});

		const customizedContributors = [];
		GroupContributors.map((contributor) => {
			const addByUser = () => {
				if (contributor.addBy === req._id) {
					return "You";
				} else {
					return allUsers.find((user) => JSON.stringify(user._id) === JSON.stringify(contributor.addBy)).nickname;
				}
			};
			return customizedContributors.push({
				groupPermission: contributor.permission,
				groupAddBy: addByUser(),
				groupID: contributor.group_id,
				groupIsAuthor: contributor.isAuthor,
			});
		});

		const customizedMeta = [];
		GroupMeta.map((meta) => {
			if (customizedContributors.find((con) => JSON.stringify(meta._id) === JSON.stringify(con.groupID))) {
				return customizedContributors.map((con) => {
					if (con.groupID === meta.id) {
						const allContributors = [
							...allGroupContributors.map((allCont) => {
								if (JSON.stringify(allCont.group_id) === JSON.stringify(meta._id)) {
									return allUsers.find((user) => JSON.stringify(user._id) === JSON.stringify(allCont.contributor_id))
										.nickname;
								} else return "null";
							}),
						];
						delete con.groupID;
						return customizedMeta.push({
							...con,
							groupAuthor: allUsers.find((user) => JSON.stringify(user._id) === JSON.stringify(meta.author)).nickname,
							groupContributors: allContributors.filter((e) => e !== "null"),
							groupIcon: meta.icon,
							groupName: meta.name,
							groupShareable: meta.shareable,
							groupPermanent: meta.permanent,
							defaultOpen: meta.defaultOpen,
						});
					}
				});
			}
		});

		return res.json(customizedMeta);
	} catch (err) {
		return next(err);
	}
});

router.get("/pending", verifyUserToken, async (req, res, next) => {
	try {
		const pendingGroups = await GroupContributorsModel.find({
			contributor_id: req._id,
			pending: true,
		});
		const groupDetail = await GroupMetaModel.find({});
		const allUsers = await UserModel.find({
			_id: { $nin: req._id },
		});

		res.status(200).json(
			pendingGroups.map((pendingGroup) => {
				const gName = groupDetail.find((g) => g._id.toString() === pendingGroup.group_id);
				const addByUser = allUsers.find((user) => user._id.toString() === pendingGroup.addBy);
				return {
					groupName: gName.name,
					groupIcon: gName.icon,
					contributorID: pendingGroup._id,
					groupPending: pendingGroup.pending,
					groupPermission: pendingGroup.permission,
					addBy: addByUser.nickname,
					pendingCreateAt: pendingGroup.created_at,
				};
			})
		);
	} catch (err) {
		next(err);
	}
});

router.put("/pending/:group_id", verifyUserToken, async (req, res, next) => {
	try {
		await GroupContributorsModel.updateOne(
			{
				_id: req.params.group_id,
				pending: true,
			},
			{
				pending: false,
				updated_at: Date.now(),
			}
		)
			.then(() => {
				return res.json({ pending: false });
			})
			.catch((err) => {
				next(err);
			});
	} catch (err) {
		next(err);
	}
});

router.post("/new", verifyUserToken, async (req, res, next) => {
	try {
		const newGroupRecord = new GroupMetaModel({
			name: req.body.groupName,
			author: req._id,
			icon: req.body.groupIcon,
			shareable: req.body.groupShareable,
		});

		return newGroupRecord.save((err, savedMeta) => {
			return onSave(err, savedMeta, () => {
				const contributors = req.body.groupContributors.map((contributor) => {
					return {
						group_id: savedMeta._id,
						contributor_id: contributor.id,
						isAuthor: false,
						permission: contributor.permission,
						addBy: req._id,
					};
				});
				const injectedContributors = [
					...contributors,
					{
						group_id: savedMeta._id,
						contributor_id: req._id,
						isAuthor: true,
						permission: "writer",
						addBy: req._id,
						pending: false,
					},
				];

				GroupContributorsModel.insertMany(injectedContributors)
					.then((response) => {
						return res.json(response);
					})
					.catch((err) => {
						next(err);
					});
			});
		});
	} catch (err) {
		return next(err);
	}
});

module.exports = router;
