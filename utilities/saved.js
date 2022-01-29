const onSave = (error, savedObject, callBack) => {
	if (error) throw error;
	else if (!savedObject) throw new Error("no object found");
	else {
		return callBack(savedObject);
	}
};

module.exports = onSave;
