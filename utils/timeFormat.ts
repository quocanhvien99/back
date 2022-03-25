import moment from 'moment';

export default function (date: Date) {
	let result = moment(date).fromNow();
	const dic = {
		'a few seconds ago': '1 giây trước',
		'seconds ago': 'giây trước',
		'a minute ago': '1 phút trước',
		'minutes ago': 'phút trước',
		'an hour ago': '1 giờ trước',
		'hours ago': 'giờ trước',
		'a day ago': '1 ngày trước',
		'days ago': 'ngày trước',
		'a month ago': '1 tháng trước',
		'months ago': 'tháng trước',
		'a year ago': '1 năm trước',
		'years ago': 'năm trước',
	};
	for (const key in dic) {
		//@ts-ignore
		result = result.replace(key, dic[key]);
	}
	return result;
}
