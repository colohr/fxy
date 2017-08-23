const fs = require('fs')
const path = require('path')

const root_json = Symbol('the json root')
const is_module = require('./is')
const dot_module = require('./dot')(is_module)
const as_module = require('./as')(is_module, dot_module)
is_module.numeric = function is_numeric(value) { return as_module.numeral(value).valuable }
dot_module.notation = as_module.dot_notation

const class_names = [
	'FSWatcher',
	'ReadStream',
	'Stats',
	'WriteStream',
	'Jsons',
	'SyncWriteStream'
]

const fxy = {
	//get values as other value types
	get as() {
		return as_module
	},
	//copy files & directories
	//get copier() {
	//	return require('./copier')
	//},
	//copy files sync
	get copySync() {
		return this.copier.sloppy
	},
	//copy files with promise
	get copy() {
		return this.copier.proppy
	},
	get copy_folder(){
		return this.copier.directory
	},
	//get copy_dir() {
	//	return this.copy_folder
	//},
	//get value with dot notataion
	get dot() {
		return dot_module
	},
	//a folder proxy for files & things
	//get folder() {
	//	return require('./folder')
	//},
	//key generation using lodash modules for camelCase, kebabCase & snakeCase
	get id() {
		return require('./id')
	},
	//is type using fs.stats
	get is() {
		return is_module
	},
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
	
	//used for mkdir or mkdirSync
	//get make_dir() {
	//	return this.make_folder
	//},
	//included in fxy but use make_dir for promise
	get mkdirp() {
		return require('mkdirp')
	},
	
	//methodologies for stuff
	//get methodology() {
	//	return require('./methodology')
	//},
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
	}
}

const prevent_promise = [
	'exists',
	'constants',
	'createReadStream',
	'createWriteStream'
].concat(class_names)


//exports
module.exports =  export_fxy()


//shared actions
function export_fxy(){
	return new Proxy(fxy,{
		get(o, p){
			if (p in path) return path[p]
			else if (p in fs) {
				if (p === 'mkdir') return o.make_folder.promise
				else if (p === 'mkdirSync') return o.make_folder.sync
				else if (promise(p)) return promisure(p)
				else if (p === 'exists' || p === 'existsSync') return fs.existsSync
				else return fs[p]
			}
			else if (p in o) return o[p]
			else if (p === 'url') return require('./url')
			else if (require('./url').has(p)) return require('./url').get(p)
			return null
		},
		has(o, name){
			if (name in fs) return true
			else if (name in path) return true
			else if (name in o) return true
			else if (name === 'url' || require('./url').has(name)) return true
			return false
		}
	})
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
	return function (...args) {
		return new Promise((resolve, reject) => {
			return fs[func](...args, (...res) => {
				if (res[0] !== null) return reject(res[0])
				res.splice(0, 1)
				return resolve(...res)
			})
		})
	}
}