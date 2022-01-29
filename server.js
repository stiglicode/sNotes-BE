require("dotenv").config();

const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const { db_connection } = require("./database/connection");

const CreateUserRouter = require("./routes/User/CreateUser");
const UsersRouter = require("./routes/User/GetUser");
const LoginRouter = require("./routes/Auth/LoginUser");
const RecordsRouter = require("./routes/Records/RecordsHard");
const GroupMetaRouter = require("./routes/Groups/Meta");
const InitGroupRouter = require("./routes/Groups/InitGroup");
const GroupRouter = require("./routes/Groups");

const { baseUrl } = require("./utilities/base-url");
const { verifyUserToken } = require("./middlewares");

const app = express();

const port = process.env.PORT || 2211;

app.enable("trust proxy"); // needed for rate limiting by Client IP

app.use(morgan("common"));
app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN }));
app.use(express.json());

db_connection();

app.get(baseUrl("/"), verifyUserToken, (req, res) => {
	return res.json({
		message: "Welcome to sNotes api server",
		version: process.env.BASE_URL,
		token: {
			expireIn: req.tokenExpireIn,
			createdAt: req.tokenCreatedAt,
		},
	});
});

app.use(baseUrl("/auth"), UsersRouter);
app.use(baseUrl("/auth"), CreateUserRouter);
app.use(baseUrl("/auth"), LoginRouter);
app.use(baseUrl("/records"), RecordsRouter);
app.use(baseUrl("/groups"), GroupMetaRouter);
app.use(baseUrl("/groups"), GroupRouter);
app.use(baseUrl("/groups"), InitGroupRouter);

app.listen(port, () => {
	console.log(`Listening at http://localhost:${port}`);
});
