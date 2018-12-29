const clone = require('lodash.clone')
const one = require('lodash.merge')
const is = require('./is')

const array_filters = {
	skip:{
		properties:[
			'constructor',
			'prototype',
			'toString',
			'toLocaleString',
			'propertyIsEnumerable',
			'__defineGetter__',
			'__defineSetter__',
			'hasOwnProperty',
			'__lookupGetter__',
			'__lookupSetter__',
			'isPrototypeOf',
			'__proto__',
			'valueOf'
		]
	},
	empty:{
		filter(text){ return is.text(text) && text.length > 0 },
		map(text){ return is.text(text) ? text.trim():null }
	}
}

const as = {
	a:as_a,
	action:as_action,
	async:as_async,
	array: get_array,
	clone,
	count: get_count,
	get create(){ return as_constructor },
	constructor: as_constructor,
	data: get_data,
	date: as_date,
	dot_notation: get_dot_notation,
	get dots(){ return get_dot_notation },
	get keys(){ return get_names },
	get fields(){ return get_names },
	map:as_map,
	get merge(){ return one },
	names: get_names,
	number: get_number,
	numeral: get_numeral,
	one,
	object:as_object,
	set: as_set,
	text: get_text
}

//exports
module.exports = as

//scope actions
function as_a(reduction, type, ...items){
	let input = []
	if(type === 'map') {
		items = as_fields(reduction).concat(items)
	}
	else input = is.object(reduction) ? reduction:[]
	return items.reduce(function reduce(target, x){
		switch(type){
			case 'array':
				return target.concat(is.array(x) ? x:[x])
			case 'map':

				return x in reduction ? target.concat([[x, is.action(reduction[x]) ? as_action(reduction,x):reduction[x] ]]):target
			case 'data':
				return Object.assign(target, x)
			default:
				return one(target, ...(is.array(x) ? x:[x]))
		}
	}, input)
}

function as_action(action, field){
	if(is.nothing(field)) return (...x)=>is.action(action) ? action(...x):action
	return (...x)=>action[field](...x)
}

function as_async(...action){ return async (...x)=>await (as_action(...action))(...x) }

function as_constructor(type, ...asyncs){ return asyncs.length > 0 ? (...x)=>new type(...x) : async (...x)=>new (await type(...asyncs))(...x) }

function as_date(value){
	let date = null
	if(is.date(value)) date = value
	else if(!is.nothing(value) && !is.function(value) && !is.symbol(value) && !is.TF(value)) date = new Date(value)
	return date && isNaN(date.getTime()) === false ? date:null
}

function as_fields(type){
	let properties = Object.getOwnPropertyNames(type)
	if('constructor' in type){
		properties = properties.concat(Object.getOwnPropertyNames(type.constructor))
		if('prototype' in type.constructor){
			properties = properties.concat(Object.getOwnPropertyNames(type.constructor.prototype))
		}
	}
	properties = properties.filter(i=>array_filters.skip.properties.includes(i) === false)
	return Array.from(as_set(Object.keys(type), properties))
}

function as_map(data){
	if(is.object(data)){
		if(is.map(data)) return data
		else if(is.array(data)) return new Map(data)
		return new Map(as_a(data, 'map'))
	}
	return new Map()
}

function as_object(value){
	if(is.map(value)) return Array.from(value).reduce((o,[field,item])=>(o[field]=item,o),{})
	return get_data(value)
}

function as_set(...arrays){ return new Set(as_a([], 'array', ...arrays)) }

function get_array(array, map){
	if(!is.array(array)) array = []
	else if(is.function(map)) array = array.map(map)
	else if(is.text(map) && has_text_filter()) array = text()
    
    //return value
	return array
	
    //shared actions
	function has_text_filter(){ return map in array_filters }
	function text(){ return array.map(array_filters[map].map).filter(array_filters[map].filter) }
}

function get_count(value){
	if(is.array(value) || is.text(value)) return value.length
	else if(is.map(value) || is.set(value)) return value.size
	else if(is.data(value)) return Object.keys(value).length
	return 0
}

function get_data(x){
	let data = {}
	if(is.object(x)){
		try{ data = JSON.parse(JSON.stringify(x)) }
		catch(e){
			for(let name in x) {
				let value = x[name]
				if(is.object(value)) data[name] = get_data(value)
				else data[name] = value
			}
		}
	}
	else if(is.json(x)){
		try{ data = JSON.parse(x) }
		catch(e){}
	}
	return data
}

function get_dot_notation(x){
	return  {
		get container(){ return this.parts.slice( 0, this.count-1 ).join('.') },
		get count(){ return this.parts.length },
		origin:is.text(x) ? x:'',
		get parts(){ return 'particles' in this ? this.particles : this.particles = get_array( this.origin.split('.'), 'empty' ) },
		get selector(){ return this.parts.join('.') },
		get target(){ return this.parts[ this.count-1 ] },
		value(data){ return require('./dot').get(data,this.selector)  },
		toString(){ return this.origin },
		valueOf(){ return this.parts.join('.') }
	}
}

function get_names(value){
	if(is.map(value) || is.set(value)) return Array.from(value.keys())
	else if(is.array(value) || is.data(value)) return Object.keys(value)
	return []
}

function get_numeral(x){
	let value = NaN
	let type = typeof x
	if(is.text(x)) value = parseFloat(x)
	else if(is.number(x)) value = x
	else if(is.TF(x)) value = value === true ? 1:0
	return {
		unit: get_unit(),
		type,
		get valuable(){return is.number(this.value)},
		value,
		toString(){ return JSON.stringify(this) },
		valueOf(){ return `${this.value}${this.unit || ''}` }
	}
	//shared actions
	function get_unit(){
		if(is.text(x)){
			let difference = x.replace(`${value}`, '').trim()
			if(difference.length) return difference
		}
		return ''
	}
}

function get_number(x){ return get_numeral(x).value }

function get_text(value, dont_trim){
	let text = ''
	if(!is.nothing(value) && !is.symbol(value)){
		if(is.array(value)) text = get_text_array(value,dont_trim)
		else if(is.data(value)) text = get_text_data(value)
		else if(is.function(value)) text = value.toString()
		else if(is.number(value) || is.TF(value)) text = value+''
		else if(is.text(value)) text = value
	}
	return dont_trim ? text:text.trim()
	//shared actions
	function get_text_array(array, dont_trim){ return array.map(value=>get_text(value, dont_trim)).join('\n\t') }
	function get_text_data(data){
		try{ return JSON.stringify(get_data(data)) }
		catch(e){ return '{}' }
	}
}





