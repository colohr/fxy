const Annotation = require('./Annotation')
const is = require('./is')
const default_annotation_field = '@annotation'

//exports
module.exports = annotate
module.exports.data = annotate_data
module.exports.field = annotate_data_field

//scope actions
function annotate(data){ return (annotate_data())({}, null, data)[default_annotation_field] }
function annotate_data(annotation = default_annotation_field){
	//exports
	return (...x)=>flatten(...x)
	//scope actions
	function build(data, operator, field, value){
		if(Annotation.is(value)) return build(data, value.name, `${field}.${operator}`, value.value())
		data[operator] = data[operator] || {}
		data[operator][field] = value
		return data
	}

	function flatten(data, field, property){
		if(is.leaf(property)) return field ? build(data, annotation, field, property):property

		if(Annotation.is(property)) return build(data, property.name, field, property.value())

		const fields = Object.keys(property)
		if(!fields.length) return field ? build(data, annotation, field, property):data


		for(let i = 0; i < fields.length; i++){
			const index_field = fields[i]
			const prefix = !field ? index_field:`${field}.${index_field}`
			flatten(data, prefix, property[index_field])
		}

		return data
	}
}

function annotate_data_field(data, field){ return (annotate_data(field))({}, null, data) }






