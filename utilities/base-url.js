const baseUrl = (path) => {
	return `/${process.env.BASE_URL_LOCAL || process.env.BASE_URL_PRODUCTION}${path}`;
};

module.exports = {
	baseUrl,
};
