const baseUrl = (path) => {
	return `/${process.env.BASE_URL}${path}`;
};

module.exports = {
	baseUrl,
};
