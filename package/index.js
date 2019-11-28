const fs = require('fs')
const path = require('path')
const class_names = ['FSWatcher', 'ReadStream', 'Stats', 'WriteStream', 'SyncWriteStream']
const prevent_promise = ['exists', 'constants', 'createReadStream', 'createWriteStream'].concat(class_names)

const fxy = {
	//returns Arguments instance
	get argument(){ return require('./argument') },
	//get values as other value types
	get ['as']() { return require('./as') },

	//call a class constructor
	get call(){ return require('./call') },
	//instance type casting and identifier
	get cast(){ return require('./cast') },
	//clean objects of invaluable field values
	get clean(){ return require('./clean') },
	//tools to copy assets
	get copy() { return require('./copier') },
	//recursive copying of folder contents
	get copy_folder(){ return this.copy.directory },

	//data of object or iterable class
	get data(){ return this.object.data },
	//define object properties
	get define(){ return this.object.define },
	//mutate object values by dot notation
	get dot() { return require('./dot') },

	//entries of object or iterable class
	get entries(){ return this.object.entries },
	//returns extension of file without a period
	extension(x){ return path.extname(x).replace('.','').toLowerCase() },
	//creates object for folder contents as field = require(field/index.js or field.js)
	get ['export'](){ return require('./export') },

	//folder name of an file system location
	get folder_name(){ return require('./folder').name },
	//flip/invert true/false value returned from provided method
	get flip(){ return this.call.flip },
	//find fragments within text
	get fragment(){ return require('./fragment') },

	//format functions for text fragments
	get id() { return require('./id') },
	//call provided method during iterations of array entries
	get inset(){ return this.call.inset },
	//value type functions
	get is() { return require('./is') },
	//class FileItem
	get Item(){ return require('./Item') },

	//json files
	get json() { return require('./json') },
	//list folder contents
	get list() { return require('./list') },

	//create folder locations
	get make_folder(){ return require('./make_folder') },
	//media/mime/content-type information for files
	get media(){ return require('./media') },
	//convert and read .meta or .yaml files
	get meta(){ return require('./meta') },
	//the official mkdirp
	get mkdirp() { return require('mkdirp') },

	//recursive annotations of field + value set
	get notate(){ return require('./notate') },

	//converter & definitions of an object's field + value set
	get object(){ return require('./object') },

	get project(){ return require('./project') },

	//read file system item as fxy.Item
	get read_item(){ return this.Item.read },

	//source url
	get source(){ return require('./source') },
	//source url class
	get SourceURL(){ return require('./source/SourceURL') },

	//template strings
	get tag() { return require('./tag') },
	//directory tree
	get tree() { return require('./tree') },

	//unique identifier
	get uid(){ return require('./uid') },
	//basic url module
	get url(){ return require('./url') },

	//values of object or iterable classes
	get values(){ return this.object.values },
	//version of fxy module
	get version(){ return require('../package.json').version }
}

//exports
module.exports = new Proxy(fxy, {get:get, has:has})

//shared actions
function get(o,name){
	let value = get_value(o,name)
	if(!value){
		let medial = get_medial(name)
		if(medial) value = get_value(o,medial)
	}
	return value
}

function get_medial(name){
	if(typeof name !== 'string') return null
	let medial = require('lodash.camelcase')(name)
	return medial !== name ? medial:null
}

function get_value(o,name){
	if (name in path) return path[name]
	else if (name in fs) {
		if (name === 'mkdir') return o.make_folder.promise
		else if (name === 'mkdirSync') return o.make_folder.sync
		else if (promise(name)) return promisure(name)
		else if (name === 'exists' || name === 'existsSync') return fs.existsSync
		else return fs[name]
	}
	else if (name in o) return o[name]
	return null
}

function has(o,name){
	let value = has_value(o,name)
	if(!value){
		let medial = get_medial(name)
		if(medial) value = has_value(o,medial)
	}
	return value
}

function has_value(o,name){
	if (name in fs) return true
	else if (name in path) return true
	else if (name in o) return true
	return false
}

function promise(name){
	if (typeof name !== 'string') return false
	else if (prevent_promise.includes(name)) return false
	else if (name.includes('Sync')) return false
	else if (name.includes('_')) return false
	return typeof fs[name] === 'function'
}

function promisure(name) {
	const func = name
	return function file_system_promise(...inputs){
		return new Promise((success, error) => {
			return fs[func](...inputs, (...result) => {
				if(result[0] !== null) return error(result[0])
				result.splice(0, 1)
				return success(...result)
			})
		})
	}
}
