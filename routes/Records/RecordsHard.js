const express = require("express");

const router = express.Router();

const RecordsModel = require("../../models/RecordsModel/record");
const RecordDetailModel = require("../../models/RecordsModel/recordDetail");
const { verifyUserToken } = require("../../middlewares/verify-token");

router.get("/one", verifyUserToken, async (req, res) => {
	try {
		const record = await RecordsModel.find({
			author: req._id,
		});

		return res.json(record);
	} catch (err) {
		throw new Error(err);
	}
});

router.post("/all", verifyUserToken, async (req, res) => {
	try {
		const prevRecordId = await RecordsModel.find({});
		const prevRecordsDetailId = await RecordDetailModel.find({});

		const newRecordsDetail = new RecordDetailModel({ id: prevRecordsDetailId.length + 1 });

		return newRecordsDetail
			.save()
			.then((response) => {
				const result = {
					author: req._id,
					detail_id: response._id,
					title: req.body.title,
					type: req.body.type,
					id: prevRecordId.length + 1,
					parent: req.body.parent,
				};
				const newRecord = new RecordsModel(result);

				return newRecord
					.save()
					.then(() => {
						return res.json({
							...result,
						});
					})
					.catch((err) => {
						console.log(err);
					});
			})
			.catch((err) => {
				console.log(err);
				return res.json({ message: "Internal error with db" });
			});
	} catch (err) {
		throw new Error(err);
	}
});

module.exports = router;
