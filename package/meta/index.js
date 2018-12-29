const fxy = require('../')
const extensions = ['meta', 'yaml']
const Meta = load_meta
Meta.file = {
	name: get_meta_file_name,
	read: read_meta_file,
	readable: is_readable_meta_file,
	write: write_meta_file
}
Meta.from = get_data_from_meta_text
Meta.template = require('./template')
Meta.to = get_meta_text_from_data

//exports
module.exports = Meta

//scope actions
function ensure_location(location){ return has_meta_extension(location) ? location:`${location}.meta` }

function get_data_from_meta_text(text, ...options){ return require('js-yaml').load(text, ...options) }

function get_meta_file_name(location){
	if(has_meta_extension(location)) return location
	else if(require('path').extname(location)) return location.replace(require('path').extname(location), '.meta')
	return ensure_location(location)
}

function get_meta_text_from_data(data, ...options){ return require('js-yaml').dump(data, ...options) }

function has_meta_extension(location){ return extensions.includes(fxy.extension(location)) }

function is_readable_meta_file(location){ return fxy.is.text(location) && fxy.exists(location) && has_meta_extension(location) }

function load_meta(location, ...options){
	try{ return read_meta_file(get_meta_file_name(location), ...options) }
	catch(error){ throw error }
}

function read_meta_file(location, ...options){
	if(is_readable_meta_file(location)) return get_data_from_meta_text(require('fs').readFileSync(location, 'utf8'), ...options)
	throw new Error(`Meta file location is not readable.`)
}

function write_meta_file(location, data, ...options){
	if(!fxy.is.object(data)) throw new Error(`Meta data is not a valid json structure.`)
	if(is_readable_meta_file(location)) return require('fs').writeFileSync(location, get_meta_text_from_data(data, ...options), 'utf8')
	throw new Error(`Meta file location is not invalid.`)
}
