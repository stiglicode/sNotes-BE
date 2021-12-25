const mongoose = require("mongoose");

const { Schema } = mongoose;

const UserModel = new Schema(
	{
		nickname: {
			type: String,
			required: true,
			min: 1,
			max: 40,
		},
		firstname: {
			type: String,
			required: true,
			min: 1,
		},
		lastname: {
			type: String,
			required: true,
			min: 1,
		},
		password: {
			type: String,
			required: true,
			minLength: 8,
		},
		email: {
			type: String,
			required: true,
		},
		id: {
			type: Number,
			required: true,
			default: 1,
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
		permission: {
			type: Number,
			required: true,
			default: 2,
		},
	},
	{ collection: "users" }
);

module.exports = mongoose.model("UserModel", UserModel, "users");
