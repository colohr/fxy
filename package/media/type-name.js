
const type_names = {
	javascript:[
		'es6',
		'js'
	],
	plain:[
		'txt'
	]
}

//exports
module.exports = get_type_name

//shared actions
function get_type_name(file_type){
	let type_name = file_type
	for(let name in type_names){
		let names = type_names[name]
		if(names.includes(file_type)) type_name = name
	}
	return type_name
}

