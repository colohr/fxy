
//exports
module.exports = {
	get bson(){ return is_bson },
	get leaf(){ return is_leaf },
	get primitive(){ return is_primitive }
}

//scope actions
function is_bson(value){ return value._bsontype && require('./types').bson.includes(value._bsontype) > -1 }

function is_leaf(value){ return value === null || typeof(value) === 'undefined' || is_primitive(value) || is_bson(value) }

function is_primitive(value){ return require('./types').primitive.includes(typeof (value)) || require('util').isArray(value) || require('util').isDate(value) }