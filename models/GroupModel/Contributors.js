const mongoose = require("mongoose");

const { Schema } = mongoose;

const GroupContributorsModel = new Schema(
	{
		group_id: {
			type: String,
			required: true,
		},
		contributor_id: {
			type: String,
			required: true,
		},
		isAuthor: {
			type: Boolean,
			required: false,
			default: false,
		},
		permission: {
			type: String,
			required: false,
			default: "read",
		},
		addBy: {
			type: String,
			required: true,
		},
		pending: {
			type: Boolean,
			default: true,
		},
		isRevoked: {
			type: Boolean,
			required: false,
			default: false,
		},
		revoke_at: {
			type: Date,
		},
		created_at: {
			type: Date,
			required: true,
			default: Date.now,
		},
		updated_at: {
			type: Date,
			required: true,
			default: Date.now,
		},
		deleted_at: {
			type: Date,
		},
		isDeleted: {
			type: Boolean,
			required: false,
			default: false,
		},
	},
	{ collection: "groupsContributors" }
);

module.exports = mongoose.model("GroupContributorsModel", GroupContributorsModel, "groupsContributors");
