const is = require('../is')
const invalid = Symbol('invalid')


//exports
module.exports = data_value
module.exports.describe = require('./describe')
//promise
//[Symbol.for('function name()')] = (data,function_value){ return function_value(value) } or [Symbol.for('function name()')]:true

//shared actions
function data_value(...x){
	let datas = x.map(get_value)
	if(datas.length === 1) return datas[0]
	let data = {}
	for(let item of datas){
		for(let name in item){
			let value = item[name]
			let current_value = data[name]
			if(current_value) data[name] = merge_data(current_value,value)
			else data[name] = value
		}
	}
	return data
}

function get_data(x){
	if(is.error(x)) return `${x}`
	if(is.date(x)) return x
	let data = {}
	for(let name in x){
		let i = x[name]
		let value = get_value(i)
		if(value !== invalid) data[name] = value
	}
	return data
}

function get_list(x){
	let list = []
	for(let i of x){
		let value = get_value(i)
		if(value !== invalid) list.push(value)
	}
	return list
}

function get_value(i){
	if(is_valid(i)){
		if(is.object(i)){
			if(is.array(i)) return get_list(i)
			return get_data(i)
		}
		return i
	}
	return invalid
}


function is_valid(value){
	return !is.nothing(value) && !is.function(value) && !is.symbol(value) && !is.promise(value)
}


function merge_data(current,value){
	if(is.data(current) && is.data(value)) return Object.assign(current,value)
	else if(is.array(current) && is.array(value)) return merge_list(current,value)
	return value
}

function merge_list(...x){
	let list =  Object.assign([],x[0])
	list = Object.assign(list,x[1])
	return list.map((_,index)=>{
		let current = x[0][index]
		let value = x[1][index]
		if(is.object(current) && is.object(value)) return merge_data(current,value)
		else if(is.nothing(value)) return current
		return value
	})
}


