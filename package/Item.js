const FS = require('fs')
const PATH = require('path')
const keeps_hidden = Symbol('keeps hidden')

const file_types = {
	code:['.css','.html','.js','.es6'],
	data:['.graphql','.json','.xml'],
	graphic:['.png','.jpg','.jpeg','.gif','.ico','.tiff','.pdf']
}

class Item extends Map{
	static get keeps_hidden(){ return keeps_hidden }
	static read(path,...keeps){ return read_item(path,keeps) }
	static type(item_or_extension){ return get_content_file_type(item_or_extension) }
	static get types(){ return file_types }
	static valid(type,name,keep_file_types_and_names){ return is_valid_file(type,name,keep_file_types_and_names) }
	constructor(...x){
		super([
			['path',x[0]],
			['type',get_stat_type(...x)]
		])
	}
	get content(){
		return this.get('type').file ? read_content(this):('items' in this ? this.items:null)
	}
	get name(){
		return this.get('type').name
	}
	
}

//exports
module.exports = Item

//shared actions
function get_content_file_type(extension){
	if(extension instanceof Item) extension = PATH.extname(extension.get('path'))
	for(let type in file_types){
		if(file_types[type].includes(extension)) return type
	}
	return 'text'
}

function get_stat_type(path,stat,keep){
	const type = {}
	let name = PATH.basename(path)
	if(stat.isFile()){
		if(is_valid_file(PATH.extname(path),name,keep)) type.file = true
		else return null
	}
	else if(stat.isDirectory()){
		type.directory = true
		type.name = name
		type.keeps = keep
	}
	type.name = name
	return type
}

function is_valid_file(type,name,keep){
	if(!keep[keeps_hidden] && name.indexOf('.') === 0) return false
	if(!keep.length) return true
	return keep.indexOf(type) >= 0 || keep.indexOf(name) >= 0
}

function read_content(item){
	let path = item.get('path')
	let extension = PATH.extname(path)
	let type = get_content_file_type(extension)
	let encoding = type === 'graphic' ? 'base64':'utf8'
	item.set('is',type)
	item.set('content encoded as',encoding)
	switch(type){
		case 'graphic':
			let uri_prefix = `data:image/${extension.replace('.','')};base64,`
			item.set('content data uri prefix',uri_prefix)
			return `${uri_prefix} ${FS.readFileSync(path).toString(encoding)}`
			break
		default:
			return FS.readFileSync(path,encoding)
			break
	}
	return null
}

function read_item(path,keeps){ return new Item(path,FS.statSync(path),keeps) }