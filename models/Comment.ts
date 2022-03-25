import { Schema, model } from 'mongoose';

const CommentSchema = new Schema({
	user: {
		type: Schema.Types.ObjectId,
		ref: 'User',
	},
	siteID: String,
	chapter: String,
	msg: String,
	createAt: {
		type: Date,
		default: Date.now(),
	},
});

export default model('Comment', CommentSchema);
