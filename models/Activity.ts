import { Schema, model } from 'mongoose';

const AvtivitySchema = new Schema({
	userId: Schema.Types.ObjectId,
	siteID: Schema.Types.ObjectId,
	chapter: String,
	at: {
		type: Date,
		default: Date.now(),
	},
});

export default model('Activity', AvtivitySchema);
