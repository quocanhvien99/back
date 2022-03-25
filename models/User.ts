import { Schema, model } from 'mongoose';

const UserSchema = new Schema({
	email: String,
	password: String,
	nickname: String,
	avatar: {
		type: String,
		default:
			'https://cdn.discordapp.com/attachments/925068948179918898/948934898536829018/images_1.jpeg',
	},
	crystal: {
		type: Number,
		default: 0,
	},
	rate: {
		like: [Schema.Types.ObjectId],
		dislike: [Schema.Types.ObjectId],
	},
	follow: [{ type: Schema.Types.ObjectId, ref: 'Manhua' }],
	createAt: {
		type: Date,
		default: Date.now(),
	},
});

export default model('User', UserSchema);
