import { Schema, model } from 'mongoose';

const SourceSchema = new Schema({
	manhuaId: Schema.Types.ObjectId,
	siteID: String,
	chapter: Number,
	src: [String],
	server: { discord: [String], telegram: [String], imgur: [String] },
});

export default model('Source', SourceSchema);
