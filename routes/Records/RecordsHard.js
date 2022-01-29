const express = require("express");

const router = express.Router();

const RecordsModel = require("../../models/RecordsModel/record");
const RecordDetailModel = require("../../models/RecordsModel/recordDetail");
const { verifyUserToken } = require("../../middlewares");

router.get("/one", verifyUserToken, async (req, res) => {
	try {
		const record = await RecordsModel.find({
			author: req._id,
			isDeleted: false,
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

router.put("/:id", verifyUserToken, async (req, res) => {
	return await RecordsModel.updateOne(
		{ _id: req.params.id },
		{
			title: req.body.title,
			updated_at: Date.now(),
		}
	)
		.then(() => {
			return res.json({ title: req.body.title, _id: req.params.id });
		})
		.catch((err) => {
			console.log(err);
			return res.json({ message: "Internal error" });
		});
});

router.delete("/:id/:record/:record_detail", verifyUserToken, async (req, res) => {
	const children = await RecordsModel.findOne({ parent: req.params.id, isDeleted: false });

	if (children) {
		return res.json({ isDeleted: false, children: true });
	} else {
		const deleteDate = Date.now();
		return await RecordsModel.updateOne(
			{ _id: req.params.record },
			{
				isDeleted: true,
				deleted_at: deleteDate,
			}
		)
			.then(async () => {
				return await RecordDetailModel.updateOne(
					{ _id: req.params.record_detail },
					{
						isDeleted: true,
						deleted_at: deleteDate,
					}
				).then(() => {
					return res.json({ isDeleted: true, record_id: req.params.record });
				});
			})
			.catch((err) => {
				console.log(err);
				return res.json({ message: "Internal error" });
			});
	}
});

module.exports = router;
