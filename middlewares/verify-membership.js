const GroupContributorsModel = require("../models/GroupModel/Contributors");

const verifyMembership = async (req, res, next) => {
	const { group_id } = req.params;
	const group = await GroupContributorsModel.find({
		group_id: group_id,
	});

	if (group.find((contributor) => contributor.contributor_id === req._id)) {
		return next();
	} else {
		return res.json({ message: "You're note member of this group" });
	}
};

module.exports = verifyMembership;
