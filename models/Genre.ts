import { Schema, model } from 'mongoose';

const GenreSchema = new Schema({
	name: String,
});

export default model('Genre', GenreSchema);
