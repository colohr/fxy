const words = require('lodash.words')
const id = {
	get camel(){ return id.medial },
	get capital(){ return id.capitalize },
	capitalize: require('lodash.capitalize'),
	class(value){ return words(value).map(word=>id.capitalize(word)).join('') },
	get code(){ return id.medial },
	dash: require('lodash.kebabcase'),
	dot_notation(value){ return words(value).join('.') },
	get dots(){ return id.dot_notation },
	get kebab(){ return id.dash },
	medial: require('lodash.camelcase'),
	path(value){ return words(value).join('/') },
	proper(value){ return words(value).map(word => id.capitalize(word)).join(' ') },
	readable(value){ return words(value).join(' ') },
	get snake() { return id.underscore },
	get underscore() { return id._ },
	words,
	_: require('lodash.snakecase')
}
//exports
module.exports = id