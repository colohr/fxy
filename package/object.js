const is = require('./is')
const primitive_properties = ['constructor','prototype']

//exports
module.exports.data = get_data
module.exports.define = define_properties
module.exports.entries = get_entries
module.exports.properties = get_properties
module.exports.values = get_values

//scope actions
function define_properties(object, ...definitions){
	for(const definition of definitions){
		if(is.function(definition) && definition.name) define_property(...property(definition.name, definition))
		else if(is.array(definition)) define_property(...property(...definition))
		else if(is.object(definition)) define_properties(object, ...property_definition_entries(definition))
		else if(is.text(definition) && require('fs').existsSync(definition)) define_properties(object, ...imported_property(definition))
	}
	//exports
	return object

	//scope actions
	function define_property(...definition){ return definition[0] in object ? null:Object.defineProperty(object, ...definition) }

	function property(field, value){
		return [field, get_definition()]
		//scope actions
		function get_definition(){
			if(is.function(value) && is.async(value) === false){
				if(field !== value.name && value.name === 'get') return {get: value, enumerable: false, configurable: false}
				if(is.class(value) === false || value.toString().indexOf('function') === 0){
					return {get: value, enumerable: false, configurable: false}
				}
			}
			if(is.data(value)) return value
			return {value, enumerable: false, configurable: false}
		}
	}
}



function get_entries(value){
	if(is.set(value)) value = Array.from(value)
	if(is.data(value)){
		if(is.iterator(value)) value = Array.from(value)
		else value = Object.entries(value)
	}
	return is.array(value) ? value:[]
}

function get_data(value){
	return get_entries(value).reduce(reduce,{})
	//scope actions
	function reduce(data, entry){ return (data[entry[0]]=entry[1],data) }
}

function get_properties(value){
	//exports
	return Array.from(new Set(get_properties().filter(primitive_property))).sort()

	//scope actions
	function get_properties(){
		if(is.object(value)) {
			return Object.keys(value)
						 .concat(Object.getOwnPropertyNames(value))
						 .concat(value.constructor.name in global ? []:get_properties(Object.getPrototypeOf(value)))
		}
		else if(is.class(value)) {
			if(value.name in global) return []
			return Object.keys(value)
						 .concat(Object.getOwnPropertyNames(value))
						 .concat(get_properties(value.prototype))
		}
		return []
	}

	function primitive_property(field){ return primitive_properties.includes(field) === false }
}



function get_values(value){ return Object.values(get_data(value)) }

function imported_property(imported, ...entries){
	return (is.function(require(imported))?entries.push(require(imported)):null, property_definition_entries(require(imported), ...entries))
}

function property_definition_entries(target, ...entries){
	return entries.concat(Object.entries(target).map(property_definition_entry))
}

function property_definition_entry(entry){
	return [entry[0], {value: entry[1], enumerable: false, configurable: false}]
}
