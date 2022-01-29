const JWT = require("jsonwebtoken");

const verifyUserToken = async (req, res, next) => {
	const accessToken = req.body["x-access-token"] || req.headers["x-access-token"];
	if (!accessToken) {
		return res.status(401).json({
			status: 401,
			message: "Access denied!",
		});
	}

	try {
		await JWT.verify(accessToken, process.env.JWT_SECRET, (err, decoded) => {
			console.log(decoded);
			if (err) {
				return res.status(401).json({
					status: 401,
					message: "Token expired",
				});
				// return next(err);
			} else {
				req._id = decoded._id;
				req.tokenExpireIn = decoded.exp;
				req.tokenCreatedAt = decoded.iat;
				return next();
			}
		});
	} catch (error) {
		return res.status(400).json({
			status: 400,
			message: "Invalid token !",
		});
	}
};

module.exports = verifyUserToken;
