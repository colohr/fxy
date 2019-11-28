const is = require('../is')
const default_url = 'http://www.domain.com/'
const non_url_fields = ['protocol','port','searchParams']
const url_fields = Object.keys(require('url').parse(default_url)).filter(field=>non_url_fields.includes(field))

const fields = [
	'authentication',
	'domain',
	'folder',
	'hash',
	'local',
	'port',
	'protocol',
	'search',
	'text'
]

class SourceURL{
	static get create(){ return create_source_url }
	static get is(){ return is_source }
	static get is_data(){ return is_url_data }
	static get data(){ return get_url_data }
	static get protocols(){ return require('./protocols') }
	static get search(){ return get_search_data }
	static get search_text(){ return get_search_text }

	constructor(data){
		this.url = new (require('url').Url)(default_url)
		this.data = data
	}
	get authentication(){ return get_authentication(this) }
	set authentication(value){ return set_authentication(this, value) }

	get data(){ return this.toJSON() }
	set data(data){ return set_source_data(this, data) }
	get domain(){ return this.url.hostname }
	set domain(value){ return this.url.hostname = value }

	get folder(){ return this.url.pathname }
	set folder(value){ return this.url.pathname = value }
	get folders(){ return this.folder.split('/').map(i=>i.trim()).filter(i=>i.length) }

	get hash(){ return this.url.hash }
	set hash(value){ return this.url.hash = value }

	get local(){ return this.domain === 'localhost' }
	set local(value){ return value === true ? this.hostname = 'localhost':null }

	get parameters(){ return this.url.searchParams }
	set parameters(value){ return set_parameters(this.url.searchParams, value) }
	get port(){ return get_port(this.url.port) }
	set port(value){ return (value=get_port(value) || '', this.url.port=value) }
	get protocol(){ return this.url.protocol.slice(1, this.url.protocol.length) }
	set protocol(value){ return this.url.protocol = value }

	get search(){ return require('../object').data(this.parameters) }
	set search(value){ return this.parameters = value }
	get secure(){ return require('./protocols').secure.includes(this.protocol) }

	get subdomain(){ return this.domain.split('.')[0] }

	get text(){ return `${require('url').format(this.url)}` }

	toJSON(){ return source_json(this) }
	toString(){ return this.text }
}

//exports
module.exports = SourceURL

//scope actions
function create_source_url(value){ return new SourceURL(value) }

function get_authentication(source){
	return {
		password: source.url.password || null,
		username: source.url.username || null
	}
}

function get_port(port=null){
	if(is.text(port)) {
		port = port.trim()
		if(port.length) port = parseFloat(port)
	}
	return is.number(port) ? port:null
}

function get_search_data(value){
	if(is.data(value) && value instanceof SourceURL) value = value.url.search
	else if(is.url.instance(value)) value = value.search
	if(is.text(value)) {
		try{ value = require('querystring').parse(get_search_text(value))}
		catch(error){ console.log('querystring.parse',error) }
	}
	return is.data(value) ? value:{}
}

function get_search_text(value){
	if(is.url.instance(value)) value = value.search
	else if(is_url_data(value) && 'search' in value) value = value.search
	else if(is_source(value)) value = value.url.search

	if(is.data(value)){
		try{ value = require('querystring').stringify(value)}
		catch(error){ console.error(error) }
	}
	if(is.text(value)){
		if(value.charAt(0) === '?') value = value.slice(1, value.length)
		else if(value.includes('?')) value = value.split('?')[1]
	}
	return is.text(value) ? value:''
}


function get_url_data(value){
	if(is_source(value)) value = value.url
	else if(is_url_data(value) && is.url.instance(value) === false){
		value = require('url').format(value)
	}
	if(is.text(value)){
		try{ value = require('url').parse(value) }
		catch(error){ console.log('url.parse error', error) }
	}
	return is.url.instance(value) ? value:{}
}

function is_source(value){ return is.data(value) && value instanceof SourceURL }

function is_url_data(value){
	if(is.url.instance(value)) return true
	else if(is.data(value)) {
		if('search' in value && is.data(value.search)) return false
		return Object.keys(value).filter(filter_fields).length > 0
	}
	return false

	//scope actions
	function filter_fields(field){ return url_fields.includes(field) }
}

function set_authentication(source, value){
	if(is.data(value)) value = {}
	if(value.user) source.url.username = value.user
	else if(value.username) source.url.username = value.username
	else if(value.name) source.url.username = value.name
	if(value.password) source.url.password = value.password
	return value
}

function set_parameters(parameters, value){
	if(is.data(value) === false) value = get_search_data(value)
	for(const field in value) parameters.set(field, value[field])
	return parameters
}

function set_source_data(source, value){
	if(is.data(value) && is_url_data(value) === false){
		Object.assign(source, value)
	}
	else set_source_url_data(source, value)
	return value
}

function set_source_url_data(source, value){ return set_url_data(source.url, value) }

function set_url_data(url, value){
	value = get_url_data(value)
	for(const field in value) {
		if(field === 'search' && is.data(value[field])) set_parameters(url.searchParams, value[field])
		else url[field] = value
	}
	return url
}

function source_json(source, value = null){
	//exports
	return fields.reduce(reduce,{ toString(){ return this.text } })
	//scope actions
	function reduce(json, field){
		value = source[field]
		if(is.nothing(value) === false) json[field] = value
		return (value=null,json)
	}
}



