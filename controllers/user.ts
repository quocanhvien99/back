import { Request, Response } from 'express';
import { nanoid } from 'nanoid';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { Redis } from 'ioredis';

export async function register(req: Request, res: Response) {
	let { email, password } = req.body;

	const emailExist = await User.findOne({ email });
	if (emailExist) return res.status(400).send('Email đã tồn tại');

	const hashedPassword = await bcrypt.hash(password, 10);

	const user = new User({
		email,
		password: hashedPassword,
		nickname: nanoid(10),
	});
	try {
		const savedUser = await user.save();
		res.send(savedUser);
	} catch (err) {
		res.status(400).send(err);
	}
}
export async function login(req: Request, res: Response) {
	let { email, password } = req.body;

	const user = await User.findOne({ email });

	const errorMsg = 'Tài khoản hoặc mật khẩu không chính xác!';
	if (!user) return res.status(400).send({ msg: errorMsg });
	if (!bcrypt.compareSync(password, user.password))
		res.status(400).json({ msg: errorMsg });

	const accessToken = jwt.sign(
		{ uid: user._id },
		process.env.ACCESS_TOKEN_SECRET!,
		{ expiresIn: '15m' }
	);
	const refreshToken = jwt.sign(
		{ uid: user._id },
		process.env.ACCESS_TOKEN_SECRET!
	);

	const redisClient = req.app.locals.redisClient as Redis;
	redisClient.rpush('refreshTokens', refreshToken);

	res
		.cookie('token', accessToken, {
			expires: new Date(15 * 60 * 1000 + Date.now()),
		})
		.cookie('refreshToken', refreshToken)
		.json({ msg: 'ok' });
}
export async function logout(req: Request, res: Response) {
	const { refreshToken } = req.body;
	const redisClient = req.app.locals.redisClient as Redis;
	const result = await redisClient.lrem('refreshTokens', 0, refreshToken);
	res.clearCookie('token').clearCookie('refreshToken').json({ msg: 'ok' });
}
export async function getToken(req: Request, res: Response) {
	const { refreshToken } = req.body;
	if (!refreshToken) return res.sendStatus(401);

	const redisClient = req.app.locals.redisClient as Redis;
	const check = await redisClient.lpos('refreshTokens', refreshToken);
	if (!check) return res.sendStatus(401);

	//@ts-ignore
	jwt.verify(refreshToken, process.env.ACCESS_TOKEN_SECRET!, (err, user) => {
		if (err) return res.status(403).json({ msg: 'Invalid token' });
		const accessToken = jwt.sign(
			{ uid: user.uid },
			process.env.ACCESS_TOKEN_SECRET!,
			{ expiresIn: '15m' }
		);
		res
			.cookie('token', accessToken, {
				expires: new Date(15 * 60 * 1000 + Date.now()),
			})
			.json({ msg: 'ok' });
	});
}
export async function info(req: Request, res: Response) {
	const uid = res.locals.user.uid;
	const user = await User.findById(uid);

	res.json(user);
}
