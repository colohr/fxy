const FS = require('fs')
const PATH = require('path')
const Item = require('./Item')
const keeps_set = Symbol('keeps was set')
const keeps_hidden = Item.keeps_hidden

class PathItem extends Item {
	get items() {
		return get_directory(this)
	}
	get skip() {
		return this.get('type') === null
	}
}

function directoryTree(path, keeps) {
	const item = get_path_item(path, keeps)
	if (item !== null) { return item }
	else return null
}

module.exports = (path, ...keep) => {
	let hidden = keep.length > 0 && keep[0] === true ? true : false
	keep = keep.filter(k => typeof k === 'string')
	let keeps = get_keeps(keep)
	if (hidden) keeps[keeps_hidden] = true
	return directoryTree(path, keeps)
}

//----------------shared actions----------------
function combine_only_the_files(dir, onlys) {
	if (!Array.isArray(onlys)) onlys = []
	for (let item of dir) {
		if (item instanceof PathItem) {
			if (item.get('type').file) onlys.push(item)
			else onlys = onlys.concat(item.items.only)
		}
		else {
			console.log(item)
		}
	}
	return onlys
}

function get_directory(item) {
	let dir = []
	if (item.get('type').directory) {
		try {
			let path = item.get('path')
			dir = FS.readdirSync(path).map(child => directoryTree(PATH.join(path, child), item.get('type').keeps)).filter(e => !!e)
		}
		catch (ex) {}
	}
	return new Proxy(dir, {
		get(o, name){
			if (name in o) return o[name]
			else if (name === 'only') {
				return combine_only_the_files(o)
			}
			return o
		}
	})
}

function get_keeps(keeps) {
	if (keeps[keeps_set]) return keeps
	keeps = keeps.map(keep => {
		if (keep.indexOf('.') === -1) return `.${keep}`
		return keep
	})
	keeps[keeps_set] = true
	return keeps
}

function get_path_item(path, keeps) {
	let item
	try {
		item = new PathItem(path, FS.statSync(path), keeps)
		if (item.skip) return null
	}
	catch (e) {
		return null
	}
	return item
}



//get content(){
//	return this.get('type').file ? read_content(this):this.items
//}
//get name(){
//	return this.get('type').name
//}
//  get skip(){
//  return this.get('type') === null
//}

//function get_content_file_type(extension){
//  for(let type in file_types){
//    if(file_types[type].includes(extension)) return type
//  }
//  return 'text'
//}

//const keeps_hidden = Symbol('keeps hidden')

//const file_types = {
//  graphic:['.png','.jpg','.jpeg','.gif','.ico','.tiff','.pdf']
//}
//function get_stat_type(path,stat,keep){
//  const type = {}
//  let name = PATH.basename(path)
//  if(stat.isFile()){
//    if(is_valid_file(PATH.extname(path),name,keep)){
//      type.file = true
//    }
//    else return null
//  }
//  else if(stat.isDirectory()){
//    type.directory = true
//    type.name = name
//    type.keeps = keep
//  }
//  type.name = name
//  return type
//}
//function is_valid_file(type,name,keep){
//  if(!keep[keeps_hidden] && name.indexOf('.') === 0) return false
//  if(!keep.length) return true
//  return keep.indexOf(type) >= 0 || keep.indexOf(name) >= 0
//}
//
//function read_content(item){
//    let path = item.get('path')
//    let extension = PATH.extname(path)
//    let type = get_content_file_type(extension)
//    let encoding = type === 'graphic' ? 'base64':'utf8'
//    item.set('is',type)
//    item.set('content encoded as',encoding)
//    switch(type){
//        case 'graphic':
//	        let uri_prefix = `data:image/${extension.replace('.','')};base64,`
//	        item.set('content data uri prefix',uri_prefix)
//	        return `${uri_prefix} ${FS.readFileSync(path).toString(encoding)}`
//          break
//        default:
//          return FS.readFileSync(path,encoding)
//          break
//    }
//    return null
//}