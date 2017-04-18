const fs = require('fs');
const path = require('path');

//All classNames
const classNames = [
	'FSWatcher',
	'ReadStream',
	'Stats',
	'WriteStream',
	'Jsons',
	'SyncWriteStream'
];
//prevented names for promise closure
const preventPromise = [
	'exists',
	'constants'
].concat(classNames);



//closure promise
const promisure = function (name) {
	const func = name;
	return function (...args) {
		return new Promise((resolve, reject) => {
			return fs[func](...args, (...res) => {
				if (res[0] !== null) return reject(res[0])
				res.splice(0, 1);
				return resolve(...res);
			});
		})
	}
}


//check is promises
const promise = (name) => {
	if(typeof name !== 'string') return false;
	else if (preventPromise.includes(name)) return false;
	else if (name.includes('Sync')) return false;
	else if (name.includes('_')) return false;
	return typeof fs[name] === 'function';
}


//symbol of fxy.json root directory
const root_json = Symbol('the json root')

const is_module = require('./is')
const dot_module = require('./dot')( is_module)
const as_module = require('./as')( is_module, dot_module)
is_module.numeric = function is_numeric(value){  return as_module.numeral(value).valuable  }
dot_module.notation = as_module.dot_notation

//object that fxy proxy handles (main-module)
const fxy = {
	//additional child modules
  //get values as other value types
  get as(){
    return as_module
  },
	//copy files & directories
	get copier(){
		return require('./copier')
	},
  //copy files sync
	get copySync() {
		return this.copier.sloppy
	},
  //copy files with promise
	get copy() {
		return this.copier.proppy
	},
  //get value with dot notataion
  get dot() {
		return dot_module
	},
  //a folder proxy for files & things
  get folder(){
    return require('./folder')
  },
  //key generation using lodash modules for camelCase, kebabCase & snakeCase
  get id(){
		return require('./ks')
	},
	//is type using fs.stats
	get is(){
    return is_module
	},
  //json files
	get json(){
		return require('./json')
	},
	//shared Json instance proxy
	get jsons() {
		return this[root_json] ? this[root_json].$proxy() : null
	},
	//Jsons class
	get Jsons(){
		return require('./jsons')
	},
  //same as id
	get ks(){
		return this.id
	},
  //list files & directories
  get list(){ 
    return  require('./ls')
  },
	//same as list
	get ls(){
		return this.list
	},
  //methodologies for stuff
  get methodology(){
    return require('./methodology')
  },
	//root handlers for shared Jsons instance in fxy module
	get root() {
		return this[root_json] ? this[root_json].$root : undefined
	},
	set root(pathname) {
		return this[root_json] = this.Jsons.create(pathname)
	},
	//template strings
	get tag(){
		return require('./tag')
	},
  //directory tree
  get tree(){
    return require('./tree')
  }
}


//fxy proxy handler
const Fxy = {
	get(o, p){
		if (p in o) return o[p]
		else if (p in fs) {
			if (promise(p)) return promisure(p)
			else if (p === 'exists' || p === 'existsSync') return fs.existsSync
			else return fs[p]
		}
		else if(p in path) return path[p]
		return null
	},
  has(o,name){
    if(name in fs) return true
    else if(name in path) return true
    else if(name in fxy) return true
    return false
  }
}


//export of fxy through proxy handler
module.exports = new Proxy(fxy, Fxy)
