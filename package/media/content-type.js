
//used for type name
const content_types = {
	base64:[
		//audio
		'm4a',
		'mp3',
		'ogg',
		//video
		//'avi',
		//'flv',
		//'wmv',
		//'mp4',
		//'mov',
		//'m4v',
		'mp4',
		'webm',
		'ogg',
		//graphic
		'gif',
		'jpg',
		'jpeg',
		'png',
		'svg',
		'ico',
		'tiff',
		'pdf'
		
	],
	utf8:[
		'css',
		'html',
		'es6',
		'graphql',
		'js',
		'json',
		'txt',
		'xml'
	]
}

//used to read a file content
module.exports = get_content_type


//shared actions
function get_content_type(file_type){
	file_type=file_type.toLowerCase()
	for(let name in content_types){
		let tags = content_types[name]
		if(tags.includes(file_type)) return name
	}
	return null
}