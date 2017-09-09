const words = require('lodash.words')
const id = {
	get camel(){ return id.code },
	get capital(){ return id.capitalize },
	capitalize: require('lodash.capitalize'),
	class(value){ return words(value).map(word=>id.capitalize(word)).join('') },
	code: require('lodash.camelcase'),
	dash: require('lodash.kebabcase'),
	dot_notation(value){ return words(value).join('.') },
	get dots(){ return id.dot_notation },
	get kebab(){ return id.dash },
	get medial(){ return id.code },
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