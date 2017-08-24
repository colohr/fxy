const fs = require('fs')
const path = require('path')
const medial = require('lodash.camelcase')

const copier = require('./copier')
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
		return copier.sloppy
	},
	//copy files with promise
	get copy() {
		return copier.proppy
	},
	get copy_folder(){
		return copier.directory
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

const targets = [
	{ target:path },
	{ target:fs },
	{ target:fxy, dont_bind:true},
	{ target:require('./url')  }
]

const targets_aliases = {
	get mkdir(){
		return { value: fxy.make_folder.promise, target:fxy, dont_bind:true }
	},
	get mkdirSync() {
		return { value:fxy.make_folder.sync, target:fxy, dont_bind:true }
	},
	get mkdir_sync(){
		return this.mkdirSync
	},
	get exists(){
		return {value:fs.existsSync, target:fs }
	},
	get exists_sync(){
		return this.exists
	},
	get url(){
		return {value:require('./url'), target:fxy, dont_bind:true }
	}
}

//exports
module.exports =  export_fxy()
//module.exports = export_fxy_two()

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


function export_fxy_two(){
	return new Proxy(fxy,{
		get:get_value,
		has:has_value
	})
}

function get_target_value(property_name){
	let medial_name = property_name
	
	let target = null
	let target_name = 'property_name'
	let target_value = null
	let dont_bind = false
	if(typeof property_name === 'string') medial_name = medial(property_name)
	
	for(let alias in targets_aliases){
		if(target_value === null){
			let alias_value = null
			if(alias === property_name) alias_value = targets_aliases[alias]
			else if(alias === medial_name){
				target_name = 'medial_name'
				alias_value = targets_aliases[alias]
			}
			if(alias_value){
				if('dont_bind' in alias_value) dont_bind = true
				target = alias_value.target
				target_value = alias_value.value
			}
		}
	}
	
	if(target === null){
		for(let i=0;i<targets.length;i++){
			if(target === null && target_value === null){
				let target_module = targets[i]
				if(property_name in target_module.target || medial_name in target_module.target) {
					target = target_module.target
					if(medial_name !== property_name && medial_name in target_module.target) {
						target_name = 'medial_name'
						target_value = target[medial_name]
					}
					else target_value = target[property_name]
					if('dont_bind' in target_module) dont_bind = true
				}
			}
		}
	}
	
	return {
		dont_bind,
		get has(){ return this.target !== null },
		medial_name,
		get name(){ return this[target_name] },
		property_name,
		get promised(){
			return promisure(this.medial_name) === true || promisure(this.property_name) === true
		},
		target,
		target_name,
		target_value,
		get value(){ return return_value(this) }
	}
}

function get_value(o,name){
	let target_value = get_target_value(name)
	console.log(name,target_value)
	return target_value.has ? target_value.value:null
}

function has_value(o,name){
	let target_value = get_target_value(name)
	return target_value.has
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

function return_value(data){
	let value = data.target_value
	if(!data.has) return value
	if(data.promised) return promisure(data.medial_name)
	let dont_bind = data.dont_bind
	let target = data.target
	if(typeof value === 'function' && dont_bind === false) value = value.bind(target)
	return value
}

