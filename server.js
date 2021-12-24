require("dotenv").config();

const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const { db_connection } = require("./database/connection");
const LogModel = require("./models/LogsModel/index");

const app = express();

const port = process.env.PORT || 2211;

app.enable("trust proxy"); // needed for rate limiting by Client IP

app.use(morgan("common"));
app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN }));
app.use(express.json());

db_connection();
app.get("/", async (req, res, next) => {
	// res.json({ message: "Product api v1" });
	try {
		const logs = await LogModel.find({});
		res.json(logs);

		console.log(logs);
	} catch (error) {
		next(error);
	}
});

app.listen(port, () => {
	console.log(`Listening at http://localhost:${port}`);
});
