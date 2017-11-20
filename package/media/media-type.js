
const get_type_name = require('./type-name')
const media_types = {
	application:[
		'javascript',
		'json',
		'x-www-form-urlencoded',
		'xml',
		'zip',
		'pdf'
	],
	audio:[
		'm4a',
		'mp3',
		'ogg'
	],
	image:[
		'gif',
		'jpg',
		'jpeg',
		'png',
		'ico',
		'svg',
		'tiff'
	],
	multipart:[
		'form-data'
	],
	text:[
		'css',
		'html',
		'csv',
		'graphql',
		'plain'
	],
	video:[
		//'avi',
		//'flv',
		//'wmv',
		//'mp4',
		//'mov',
		//'m4v',
		'mp4',
		'webm',
		'ogg'
	]
}


module.exports = get_media_type

//shared actions
function get_media_type(file_type){
	let media_name = ''
	let type_name = get_type_name(file_type)
	for(let name in media_types){
		let tags = media_types[name]
		if(tags.includes(type_name)) media_name = name
	}
	return `${media_name}/${type_name}`
}