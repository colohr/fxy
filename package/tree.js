const FS = require('fs')
const PATH = require('path')
const Item = require('./Item')
const keeps_set = Symbol('keeps was set')
const keeps_hidden = Item.keeps_hidden

class PathItem extends Item {
	is(type){ return this.get('type')[type] === true }
	get items() { return get_directory(this) }
	get skip() { return this.get('type') === null }
}

function directoryTree(location, keeps) {
	const item = get_path_item(location, keeps)
	if (item !== null) return item
	return null
}

//exports
module.exports = (location, ...keep) => {
	keep = keep.filter(keep => typeof keep === 'string')
	let keeps = get_keeps(keep,  keep.length > 0 && keep[0] === true)
	return directoryTree(location, keeps)
}

//shared actions
function combine_only_the_files(items, onlys) {
	if (!Array.isArray(onlys)) onlys = []
	for(const item of items){
		if (item instanceof PathItem) {
			if (item.get('type').file) onlys.push(item)
			else onlys = onlys.concat(item.items.only)
		}
		else console.error(item)
	}
	return onlys
}

function get_directory(item) {
	return new Proxy(get_folder(), {
		get(o, name){
			if (name in o) return o[name]
			else if (name === 'only') return combine_only_the_files(o)
			return o
		}
	})
	//shared actions
	function get_folder(){
		return read_folder().map(get_item).filter(e=>!!e)
	}
	function get_item(location){
		return directoryTree(PATH.join(item.get('path'), location), item.get('type').keeps)
	}
	function read_folder(){
		if(item.get('type').directory){
			try{ return FS.readdirSync(item.get('path')) }
			catch(e){ }
		}
		return []
	}
	//const items = []
	//if (item.get('type').directory) {
	//	try {
	//		let path = item.get('path')
	//		dir = FS.readdirSync(path)
	//		        .map(child => directoryTree(PATH.join(path, child), item.get('type').keeps))
	//		        .filter(e => !!e)
	//	}
	//	catch(e){ console.error(e) }
	//}
}

function get_keeps(keeps, keep_hidden) {
	if (keeps[keeps_set]) return keeps
	keeps = keeps.map(keep =>keep.indexOf('.') === -1 ? `.${keep}`:keep)
	keeps[keeps_set] = true
	if(keep_hidden) keeps[keeps_hidden] = true
	return keeps
}

function get_path_item(path, keeps) {
	let item = null
	try {
		item = new PathItem(path, FS.statSync(path), keeps)
		if(item.skip) item = null
	}
	catch(e){  }
	return item
}
