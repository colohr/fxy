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
};

//check is promises
const promise = (name) => {
	if(typeof name !== 'string') return false;
	else if (preventPromise.includes(name)) return false;
	else if (name.includes('Sync')) return false;
	else if (name.includes('_')) return false;
	return typeof fs[name] === 'function';
};

//symbol of fxy.json root directory
const rootJson = Symbol('root');

//object that fxy proxy handles (main-module)
const fxy = {
	//additional child modules
	//copy files & directories
	get copier(){
		return require('./copier');
	},
	//helpers/getter of/aliases for copier modules that matches fs naming scheme
	get copySync() {
		return this.copier.sloppy;
	},
	get copy() {
		return this.copier.proppy;
	},
	//is type using fs.stats
	get is(){
		return require('./is');
	},
  //json files
	get json(){
		return require('./json');
	},
	//shared Json instance proxy
	get jsons() {
		return this[rootJson] ? this[rootJson].$proxy() : null;
	},
	//Jsons class
	get Jsons(){
		return require('./jsons');
	},
	//key generation using lodash modules for camelCase, kebabCase & snakeCase
	get ks(){
		return require('./ks');
	},
	//list files & directories
	get ls(){
		return require('./ls');
	},
	//root handlers for shared Jsons instance in fxy module
	get root() {
		return this[rootJson] ? this[rootJson].$root : undefined;
	},
	set root(pathname) {
		return this[rootJson] = this.Jsons.create(pathname);
	},
	//template strings
	get tag(){
		return require('./tag');
	}
};

//fxy proxy handler
const Fxy = {
	get(o, p){
		if (p in o) return o[p];
		else if (p in fs) {
			if (promise(p)) return promisure(p);
			else if (p === 'exists' || p === 'existsSync') return fs.existsSync;
			else return fs[p];
		}
		else if(p in path) return path[p];
		return;
	}
};

//export of fxy through proxy handler
module.exports = new Proxy(fxy, Fxy);
