const fs = require('fs')
const path = require('path')
const root_json = Symbol('the json root')
const class_names = ['FSWatcher', 'ReadStream', 'Stats', 'WriteStream', 'Jsons', 'SyncWriteStream']
const prevent_promise = ['exists', 'constants', 'createReadStream', 'createWriteStream'].concat(class_names)

const fxy = {
	//get values as other value types
	get ['as']() {
		return require('./as')
	},
	//copy options
	get copy() {
		return require('./copier')
	},
	//copy folder
	get copy_folder(){
		return this.copy.directory
	},
	//get value with dot notation
	get dot() {
		return require('./dot')
	},
	//extname - period
	extension(x){ return path.extname(x).replace('.','').toLowerCase() },
	//folder name of an file system location
	folder_name(x){
		let extension = path.extname(x)
		let folder_name = path.basename(x)
		if(extension.length) folder_name = path.basename(x.replace(folder_name,''))
		return folder_name
	},
	//text reformatting for various cases/identities
	get id() {
		return require('./id')
	},
	//is type using fs.stats
	get is() {
		return require('./is')
	},
	//file item object
	get Item(){
		return require('./Item')
	},
	//json files
	get json() {
		return require('./json')
	},
	//shared Json instance proxy
	get jsons() {
		return this[root_json] ? this[root_json].$proxy() : null
	},
	//Jsons class
	get Jsons() {
		return require('./jsons')
	},
	//list files & directories
	get list() {
		return require('./list')
	},
	//same as list
	get ls() {
		return this.list
	},
	//get media info/meta
	get media(){
		return require('./media')
	},
	//make a folder
	get make_folder(){
		return require('./make_folder')
	},
	//make a folders is same as fxy.mkdirp
	get make_folders(){
		return this.mkdirp
	},
	//included in fxy but use make_dir for promise
	get mkdirp() {
		return require('mkdirp')
	},
	//read file system item as fxy.Item
	get read_item(){
		return this.Item.read
	},
	//root handlers for shared Jsons instance in fxy module
	get root() {
		return this[root_json] ? this[root_json].$root : undefined
	},
	set root(pathname) {
		return this[root_json] = this.Jsons.create(pathname)
	},
	//source url or path fixologist
	get source(){
		return require('./source')
	},
	//template strings
	get tag() {
		return require('./tag')
	},
	//directory tree
	get tree() {
		return require('./tree')
	},
	//basic url module
	get url(){
		return require('./url')
	}
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