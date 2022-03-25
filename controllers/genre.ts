import { Request, Response } from 'express';
import Genre from '../models/Genre';

export async function getGenres(req: Request, res: Response) {
	let genres: any = await Genre.find();
	genres = genres.map((x: any) => {
		x = x.toObject();
		return x.name;
	});
	res.json(genres);
}
