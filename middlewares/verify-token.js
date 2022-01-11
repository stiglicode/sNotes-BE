const JWT = require("jsonwebtoken");

const verifyUserToken = async (req, res, next) => {
	const accessToken = req.body["x-access-token"] || req.headers["x-access-token"];
	console.log(accessToken);
	if (!accessToken) {
		return res.status(401).json({
			status: 401,
			message: "Access denied!",
		});
	}

	try {
		await JWT.verify(accessToken, process.env.JWT_SECRET, (err, decoded) => {
			if (err) {
				return next();
			} else {
				req._id = decoded._id;
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

module.exports = {
	verifyUserToken,
};
