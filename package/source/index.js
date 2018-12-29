const path = require('path')

//exports
module.exports = value=>require('./SourceURL').create(value)
module.exports.file = get_file
module.exports.folder = get_folder
module.exports.url = get_url

//shared actions
function clean_slashes(value){
	value = valid_text(value)
	let parts = value.split('/')
	return clean_text_array(...parts).join('/')
}

function clean_text_array(...x){ return x.map(i=>valid_text(i)).filter(x=>x.length) }

function get_folder(...x){
	let parts = clean_text_array(...x)
	let value = clean_slashes(parts.join('/'))
	return path.dirname(value)
}

function get_file(...x){
	let parts = clean_text_array(...x)
	return clean_slashes(parts.join('/'))
}

function get_protocol(value){
	value = valid_text(value)
	return value.includes('https') ? 'https://':'http://'
}

function get_url(...x){
	let parts = clean_text_array(...x)
	let protocol = get_protocol(parts[0])
	let value = parts.join('/')
	value = value.replace(protocol,'')
	if(parts[0].includes('http')) {
		value = value.replace('https:','').replace('http:','').replace('https','').replace('http','')
	}
	value = clean_slashes(value)
	return `${protocol}${value}`
}

function valid_text(value){
	if(typeof value === 'number' && !isNaN(value)) value = value+''
	if(typeof value === 'string'){
		value = value.trim()
		if(value.length) return value
	}
	return ''
}
