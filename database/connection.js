const mongoose = require("mongoose");

// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@snotes-cluster.gzx7r.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
// const uri = `mongodb+srv://SuperAdmin:SuperSecretPassword123@snotes-cluster.gzx7r.mongodb.net/dev-db?retryWrites=true&w=majority`;
const uri = process.env.MONGODB_URI;
const db_connection = () => {
	mongoose.connect(uri, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	});

	mongoose.connection
		.once("open", function () {
			console.log("Connection to MongoDB (Database) was succesfull");
		})
		.on("error", console.error.bind(console, "Connection error: "));
};

module.exports = {
	db_connection,
};
