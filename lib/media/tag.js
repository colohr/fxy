
const element_tags = {
	audio:[
		'm4a',
		'mp3',
		'ogg'
	],
	img:[
		'gif',
		'jpg',
		'jpeg',
		'png',
		'ico',
		'tiff'
	],
	link:[
		'css',
		'html'
	],
	object:[
		'pdf'
	],
	script:[
		'es6',
		'js'
	],
	svg:[
		'svg'
	],
	video:[
		'avi',
		'flv',
		'wmv',
		'mp4',
		'mov',
		'm4v'
	],
	xml:[
		'xml'
	]
}


module.exports = get_file_element_tag

//shared actions
function get_file_element_tag(file_type){
	for(let name in element_tags){
		let tags = element_tags[name]
		if(tags.includes(file_type)) return name
	}
	return null
}