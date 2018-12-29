const annotation_value = Symbol('Annotation Value')

class Annotation{
	static get create(){ return create_annotation }
	static get is(){ return is_annotation }
	constructor(name){ this.name = name }
	value(value){
		if(typeof(value) === 'undefined') return this[annotation_value]
		this[annotation_value] = value
		return this
	}
}

//exports
module.exports = Annotation

//scope actions
function create_annotation(name, value, default_value, annotation=null){
	if(require('../is').nothing(name)) throw new Error('Invalid Annotation name')
	return (annotation=new Annotation(name), annotation.value(get_value(value, default_value)), annotation)
}

function get_value(value, default_value){ return typeof(value) === 'undefined' ? default_value:value }

function is_annotation(value){ return value && value instanceof Annotation }