const fs = require('fs')
const email_regular_expression = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
const ip_regular_expression = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/
const url_protocols = ['http://','https://']

const is = {
    array:is_array,
    bool:is_bool,
    count:is_count,
    data:is_data,
    get dir(){return is.folder },
    file(path){return fs.statSync(path).isFile()},
    folder(path){return fs.statSync(path).isDirectory()},
    email:is_email,
    empty:is_empty,
    error:is_error,
    function:is_function,
	hosted:is_hosted,
    instance:is_instance,
	ip:is_ip,
    json:is_json,
	localhost:is_localhost,
    map:is_map,
    nothing:is_nothing,
    number:is_number,
    object:is_object,
	path:is_path,
	ported:is_ported,
	protocoled:is_protocoled,
    set:is_set,
    string:is_string,
    symbol:is_symbol,
    text:is_text,
    TF:is_TF,
	url:is_url
}

//exports
module.exports = is

//shared actions
function is_array(value){ return is_object(value) && Array.isArray(value) }
function is_bool(value){return is_TF(value)}
function is_count(value,count = 1){
	if(is_nothing(value)) return false
	if(is_text(value)) value = value.trim()
	if(is_text(value) || is_array(value)) return value.length >= count
	if(is_map(value) || is_set(value)) return value.size >= count
	if(is_object(value)) return Object.keys(value).length >= count
	return false
}
function is_data(value){ return is_object(value) && !is_array(value) && !is_error(value) }
function is_email(value){ return is_text(value) && email_regular_expression.test(value) }
function is_empty(value){ return !is_count(value) }
function is_error(value){ return is_object(value) && value instanceof Error }
function is_function(value){ return typeof value === 'function' }
function is_hosted(value){ return is_url(value) && !is_localhost(value) }
function is_instance(value,type){ return is_object(value) && is_function(type) && value instanceof type }
function is_ip(value){ return is_text(value) && ip_regular_expression.test(value) }
function is_json(value){ return is_text(value) && /^[\],:{}\s]*$/.test(value.replace(/\\["\\\/bfnrtu]/g, '@').replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').replace(/(?:^|:|,)(?:\s*\[)+/g, '')) }
function is_localhost(value){ return is_url(value) && value.includes('localhost') }
function is_map(value){ return is_object(value) && value instanceof Map }
function is_nothing(value){ return typeof value === 'undefined' || value === null || (typeof value === 'number' && isNaN(value)) }
function is_number(value){ return typeof value === 'number' && !isNaN(value) && isFinite(value) }
function is_object(value){ return typeof value === 'object' && value !== null }
function is_path(value,accept_not_resolved=false){
	if(is_text(value) && value.length){
		if(value.includes('./') && accept_not_resolved === false) return false
		return true
	}
	return false
}
function is_ported(value){ return is_url(value) && value.includes(':') }
function is_protocoled(value,...protocols){
	if(is_text(value)){
		let checks = protocols.concat(url_protocols)
		for(let check of checks){
			if(value.includes(check)) return true
		}
	}
	return false
}
function is_set(value){ return is_object(value) && value instanceof Set }
function is_string(value){ return is_text(value)}
function is_symbol(value){ return typeof value === 'symbol'}
function is_text(value){ return typeof value === 'string' || (is_object(value) && value instanceof String)}
function is_TF(value){return typeof value === 'boolean'}
function is_url(value,...protocols){ return is_protocoled(value,...protocols) }













