const mongoose = require("mongoose");

const { Schema } = mongoose;

const RecordDetailModel = new Schema(
	{
		id: {
			type: String,
			required: true,
		},
		content: {
			type: String,
			default: "",
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
	{ collection: "recordDetails" }
);

module.exports = mongoose.model("RecordDetailModel", RecordDetailModel, "recordDetails");
