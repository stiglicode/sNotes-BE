const lastQuery = (request, pos) => {
	const pathSplit = request.originalUrl.split("/");
	const pathLength = pos ? pathSplit.length - pos : pathSplit.length - 1;

	return pathSplit[pathLength];
};

module.exports = {
	lastQuery,
};
