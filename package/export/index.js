//exports
module.exports = get_module_exports
module.exports.define = define_module_exports

//scope actions
function define_module_exports(folder, ...x){ return require('../object').define(get_exports(folder), ...x) }

function get_definitions(folder){ return require('../').tree(folder).items.filter(index_file_filter).map(get_module_item).join(',\n') }

function get_exports(folder){ return eval(get_object(folder)) }

function get_object(folder){ return `({ ${get_definitions(folder)} })` }

function get_module_exports(folder, ...x){
	if(x.filter(i=>i === true).length) return define_module_exports(folder, ...x)
	return Object.assign(get_exports(folder), require('../').as.one({}, ...x))
}

function get_module_item(...x){ return `get ['${get_package_name.call(x[0])}'](){ return require('${x[0].get('path')}') }` }

function get_package_name(){
	if(this.get('type').file) return this.name.replace(require('path').extname(this.name),'')
	if(require('../').exists(require('path').join(this.get('path'), 'package.json')) === false) return this.name
	return require('../').json.read_sync(require('path').join(this.get('path'), 'package.json')).name || this.name
}

function index_file_filter({name}){ return name !== 'index.js' }
