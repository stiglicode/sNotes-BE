const mongoose = require("mongoose");

const { Schema } = mongoose;

const LogModel = new Schema(
	{
		name: {
			type: String,
			default: "The name",
		},
	},
	{ collection: "logs" }
);

module.exports = mongoose.model("LogModel", LogModel);
