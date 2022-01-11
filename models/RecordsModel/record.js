const mongoose = require("mongoose");

const { Schema } = mongoose;

const RecordModel = new Schema(
	{
		detail_id: {
			type: String,
			required: true,
		},
		id: {
			type: Number,
			required: true,
			default: 1,
		},
		author: {
			type: String,
			required: true,
		},
		title: {
			type: String,
			default: "New file or fiolder",
			required: true,
		},
		parent: {
			type: Number,
			required: true,
			default: null,
		},
		type: {
			type: String,
			required: true,
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
	{ collection: "record" }
);

module.exports = mongoose.model("RecordModel", RecordModel, "record");
