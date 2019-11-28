class CastIdentifier extends String{
	get fragments(){ return this.slice(1, this.length - 1).split(' ') }
	get name(){ return this.fragments[1] }
}

//exports
const cast_function = cast
cast_function.id = cast_id
cast_function.reference = cast_reference
cast_function.type = cast_type
module.exports = cast_function

//scope actions
function cast(from_value, from_global, ...construction){
	const {name} = cast_id(from_value)
	if(name === 'Undefined') return undefined
	else if(name === 'Null') return null
	return new (cast_type(name, from_global))(...construction)
}

function cast_id(){ return new CastIdentifier(cast_reference(...arguments)) }

function cast_reference(){ return Object.prototype.toString.call(...arguments) }

function cast_type(identifier, from_global){
	if(from_global && typeof from_global === 'object' && identifier in from_global) return from_global[identifier]
	return identifier in global ? global[identifier]:null
}