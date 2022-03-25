import { Schema, model } from 'mongoose';

const ChapterSchema = new Schema({
	chapter: Number,
	views: {
		type: Number,
		default: 0,
	},
	createAt: {
		type: Date,
		default: Date.now(),
	},
});

const ManhuaSchema = new Schema({
	name: String,
	siteID: String,
	altname: [String],
	author: String,
	genres: [{ type: Schema.Types.ObjectId, ref: 'Genre' }],
	summary: {
		type: String,
		default: 'Đọc truyện nhanh tại vnmanhua',
	},
	thumb: String,
	rate: {
		like: { type: Number, default: 0 },
		dislike: { type: Number, default: 0 },
	},
	follow: { type: Number, default: 0 },
	views: { type: Number, default: 0 },
	chapters: [ChapterSchema],
	updateAt: {
		type: Date,
		default: Date.now(),
	},
	createAt: {
		type: Date,
		default: Date.now(),
	},
	status: {
		type: Number,
		default: 0,
	},
});

export default model('Manhua', ManhuaSchema);
