const is = require('../is')
const object_prototype = ({}).toString()

//exports
module.exports = get_clean_value

//scope actions
function clean_array(data, keep_value){
	data = data.map(item=>get_clean_value(item,keep_value)).filter(value=>is_empty(value)===false)
	return is_empty(data) ? null:data
}

function clean_data(data, keep_value){
	let value = null
	for(const field in data){
		try{ value = data[field] = get_clean_value(data[field], keep_value) }
		catch(error){ value = error }
		let keep = is_empty(value) === false
		if(is.function(keep_value)) keep = keep_value(field, value)
		if(keep !== true) delete_value(field,data)
	}
	return is_empty(data) ? null:data
}

function delete_value(field, data){
	try{ delete data[field] }
	catch(error){ }
}

function get_clean_value(value, keep_value){
	if(is_empty(value)) return null
	if(is.array(value)) return clean_array(value, keep_value)
	else if(is.data(value)) return clean_data(value, keep_value)
	return value
}

function is_empty(value){
	if(is.nothing(value)) return true
	if(is.TF(value) || is.number(value) || is.date(value)) return false
	if(is.object(value)) return is_valid_object(value) === false
	if(is.symbol(value) || is.error(value) || is.function(value)) return true
	return is.empty(value)
}

function is_object(value){
	try{ return value.toString() === object_prototype }
	catch(error){ return false }
}

function is_valid_object(value){
	try{
		if(is.array(value)) return value.length > 0
		else if(is_object(value)) return Object.keys(value).length > 0
		return is.empty(value.toString()) === false
	}
	catch(error){ return false }
}