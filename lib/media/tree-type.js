const types = {
	audio:[
		'm4a',
		'mp3',
		'ogg'
	],
	graphic:[
		'png',
		'jpg',
		'jpeg',
		'gif',
		'ico',
		'tiff',
		'pdf'
	],
	code:[
		'css',
		'html',
		'js',
		'es6'
	],
	data:[
		'graphql',
		'json',
		'xml'
	],
	video:[
		//'avi',
		//'flv',
		//'wmv',
		'mp4',
		'webm',
		'ogg'
		//'mov',
		//'m4v'
	]
}

//exports
module.exports = get_tree_type
module.exports.types = types

//shared actions
function get_tree_type(file_type){
	for(let name in types){
		let list = types[name]
		if(list.includes(file_type)) return name
	}
	return 'tree-item'
}