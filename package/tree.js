const FS = require('fs')
const PATH = require('path')
const Item = require('./Item')
const keeps_set = Symbol('keeps was set')
const keeps_hidden = Item.keeps_hidden

class PathItem extends Item {
	get items() { return get_directory(this) }
	get skip() { return this.get('type') === null }
}

function directoryTree(path, keeps) {
	const item = get_path_item(path, keeps)
	if (item !== null) return item
	return null
}

//exports
module.exports = (path, ...keep) => {
	let hidden = keep.length > 0 && keep[0] === true
	keep = keep.filter(k => typeof k === 'string')
	let keeps = get_keeps(keep)
	if (hidden) keeps[keeps_hidden] = true
	return directoryTree(path, keeps)
}

//shared actions
function combine_only_the_files(dir, onlys) {
	if (!Array.isArray(onlys)) onlys = []
	for (let item of dir) {
		if (item instanceof PathItem) {
			if (item.get('type').file) onlys.push(item)
			else onlys = onlys.concat(item.items.only)
		}
		else console.error(item)
	}
	return onlys
}

function get_directory(item) {
	let dir = []
	if (item.get('type').directory) {
		try {
			let path = item.get('path')
			dir = FS.readdirSync(path)
			        .map(child => directoryTree(PATH.join(path, child), item.get('type').keeps))
			        .filter(e => !!e)
		}
		catch(e){ console.error(e) }
	}
	return new Proxy(dir, {
		get(o, name){
			if (name in o) return o[name]
			else if (name === 'only') return combine_only_the_files(o)
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
	let item = null
	try {
		item = new PathItem(path, FS.statSync(path), keeps)
		if(item.skip) item = null
	}
	catch(e){ console.error(e) }
	return item
}
