const get = require('lodash.get')
const has = require('lodash.has')
const set = require('lodash.set')
const unset = require('lodash.unset')
const is = require('./is')

//exports
module.exports = new Proxy(dot,{
    get(o,name){
	    if(name in o) return o[name]
		switch(name){
	    	case 'get': return dot_get
			case 'has': return dot_has
			case 'set': return dot_set
			case 'delete': return dot_delete
			case 'notation': return require('./as').dot_notation
		}
      return null
    },
    has(o,name){
        if(name in o) return true
        return ['get','has','set','delete','notation'].includes(name)
    }
})

//shared actions
function dot(object, notation) {
	if(is.object(object) && is.text(notation)){
		let result = notation.split('.').reduce((o,i) => o[i], object)
		if(!is.nothing(result)) return result
	}
	return null
}

function dot_get(object, notation) {
	if(is.object(object) && !is.nothing(notation)){
		let result = get(object,notation)
		if(!is.nothing(result)) return result
	}
	return null
}

function dot_has(object, notation) {
	if(is.object(object) && !is.nothing(notation)){
		return has(object,notation)
	}
	return false
}

function dot_set(object, notation, value) {
	if(is.object(object) && !is.nothing(notation)){
		return set(object,notation,value)
	}
	return object
}

function dot_delete(object, notation) {
	//console.log(object,notation, notation in object)
	if(is.object(object) && !is.nothing(notation)){
		if(notation in object) delete object[notation]
		else return unset(object,notation)
	}
	return true
}










				