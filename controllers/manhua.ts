import { Request, Response } from 'express';
import { nanoid } from 'nanoid';
import Genre from '../models/Genre';
import Manhua from '../models/Manhua';
import Source from '../models/Source';
import timeFormat from '../utils/timeFormat';

export async function getManhuaList(req: Request, res: Response) {
	let { limit, skip, genres, sortBy, orderBy, keyword } = req.query;
	let query: any = {};
	let sort: any = {};
	if (genres) {
		genres = genres.toString().split(':');
		query.genres = { $all: genres };
	}
	if (keyword) {
		const regex = new RegExp(escapeRegex(keyword as string), 'gi');
		query.name = regex;
	}
	if (sortBy) {
		sort[sortBy.toString()] = parseInt(orderBy as string);
	}

	let data: any = await Manhua.aggregate([
		{
			$lookup: {
				from: 'genres',
				localField: 'genres',
				foreignField: '_id',
				as: 'genres',
			},
		},
		{
			$replaceWith: {
				$mergeObjects: ['$$ROOT', { genres: '$genres.name' }],
			},
		},
		{ $match: query },
		{
			$facet: {
				list: [
					{ $sort: sort },
					{ $skip: parseInt(skip as string) },
					{ $limit: parseInt(limit as string) },
					{
						$replaceWith: {
							$mergeObjects: [
								'$$ROOT',
								{ lastestChapter: { $arrayElemAt: ['$chapters.chapter', -1] } },
							],
						},
					},
					{ $project: { chapters: 0 } },
				],
				totalCount: [{ $count: 'count' }],
			},
		},
		{
			$replaceRoot: {
				newRoot: {
					list: '$list',
					totalCount: { $arrayElemAt: ['$totalCount.count', 0] },
				},
			},
		},
	]);

	data[0].list = data[0].list.map((x: any) => {
		x.updateAt = timeFormat(x.updateAt);
		return x;
	});
	data = { ...data[0], list: data[0].list };
	res.json(data);
}
export async function getManhua(req: Request, res: Response) {
	const { siteID } = req.params;
	let data = await Manhua.findOne({ siteID }).populate({
		path: 'genres',
		model: Genre,
		select: { name: 1, _id: 0 },
	});
	data = data.toObject();
	data.genres = data.genres.map((t: any) => t.name);
	data.updateAt = timeFormat(data.updateAt);
	res.json(data);
}
export async function getSources(req: Request, res: Response) {
	const { siteID, chapter } = req.params;
	// const data = await Source.findOne({ siteID, chapter }, { server: 1 });
	const data = await Source.aggregate([
		{ $match: { siteID: siteID, chapter: parseFloat(chapter) } },
		{
			$lookup: {
				from: 'manhuas',
				localField: 'siteID',
				foreignField: 'siteID',
				as: 'manhuaInfo',
			},
		},
		{
			$replaceRoot: {
				newRoot: {
					$mergeObjects: {
						name: { $arrayElemAt: ['$manhuaInfo.name', 0] },
						server: '$server',
					},
				},
			},
		},
	]);
	res.json(data[0]);
}

function escapeRegex(text: string) {
	return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}
