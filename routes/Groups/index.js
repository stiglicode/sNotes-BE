const express = require("express");
const { verifyUserToken } = require("../../middlewares");
const router = express.Router();

const GroupMetaModel = require("../../models/GroupModel/Meta");
const GroupContributorsModel = require("../../models/GroupModel/Contributors");
const UserModel = require("../../models/UserModel");

router.get("/", verifyUserToken, async (req, res, next) => {
	try {
		const GroupContributors = await GroupContributorsModel.find({
			contributor_id: req._id,
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

module.exports = router;

// try {
//   UserModel.find({}, (err, finds) => {
//     const customizedContributors = [];
//     if (err) throw err;
//     else {
//       GroupContributors.map((contributor) => {
//         return finds.map((find) => {
//           if (JSON.stringify(find._id) === JSON.stringify(contributor.addBy)) {
//             console.log(find);
//           }
//         });
//         // return customizedContributors.push({
//         // 	groupContributor: contributor.contributor_id === req._id ? "You" : contributor.contributor_id,
//         // 	groupPermission: contributor.permission,
//         // 	// groupAddBy: contributor.addBy === req._id ? "You" : finds.map((find) => find._id === contributor.addBy),
//         // 	groupAddBy: "sss",
//         // });
//       });
//
//       return res.json(customizedContributors);
//     }
//   });
// } catch (err) {
//   return next(err);
// }
