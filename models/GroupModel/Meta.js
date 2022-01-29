const mongoose = require("mongoose");

const { Schema } = mongoose;

const GroupModel = new Schema(
	{
		name: {
			type: String,
			required: true,
		},
		file_folder_id: {
			type: String,
			required: false,
		},
		author: {
			type: String,
			required: true,
		},
		defaultOpen: {
			type: Boolean,
			required: false,
			default: false,
		},
		contributors_count: {
			type: Number,
			required: true,
			default: 0,
		},
		icon: {
			type: String,
			required: true,
		},
		shareable: {
			type: Boolean,
			required: false,
			default: false,
		},
		permanent: {
			type: Boolean,
			default: false,
			required: false,
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
	{ collection: "groups" }
);

module.exports = mongoose.model("GroupModel", GroupModel, "groups");
