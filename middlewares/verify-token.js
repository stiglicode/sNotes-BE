const JWT = require("jsonwebtoken");

const verifyUserToken = async (req, res, next) => {
	const accessToken = req.headers["x-access-token"];
	console.log(accessToken);

	if (!accessToken) {
		return res.status(401).json({
			status: 401,
			message: "Access denied!",
		});
	}

	try {
		const user = await JWT.verify(accessToken, process.env.JWT_SECRET);
		req._id = user._id;
		next();
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
