const words = require('lodash.words')
const capitalize = require('lodash.capitalize')
const dash = require('lodash.kebabcase')
const medial = require('lodash.camelcase')
const underscore = require('lodash.snakecase')
const dot_notation = value=>words(value).join('.')

//exports
module.exports = {
	get camel(){ return medial },
	get capital(){ return capitalize },
	capitalize,
	class(value){ return words(value).map(word=>capitalize(word)).join('') },
	get code(){ return medial },
	dash,
	dot_notation,
	get dots(){ return dot_notation },
	get kebab(){ return dash },
	medial,
	path(value){ return words(value).join('/') },
	proper(value){ return words(value).map(word=>capitalize(word)).join(' ') },
	readable(value){ return words(value).join(' ') },
	get snake() { return underscore },
	underscore,
	words,
	get _(){ return underscore }
}