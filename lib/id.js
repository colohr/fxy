const words = require('lodash.words')
const id = {
	get camel(){ return this.code },
	get capital(){ return this.capitalize },
	capitalize: require('lodash.capitalize'),
	class(value){ return words(value).map(word=>this.capitalize(word)).join('') },
	code: require('lodash.camelcase'),
	dash: require('lodash.kebabcase'),
	dot_notation(value){ return words(value).join('.') },
	get dots(){ return this.dot_notation },
	get kebab(){ return this.dash },
	get medial(){ return this.code },
	path(value){ return words(value).join('/') },
	proper(value){ return words(value).map(word => id.capitalize(word)).join(' ') },
	readable(value){ return words(value).join(' ') },
	get snake() { return this.underscore },
	get underscore() { return this._ },
	words,
	_: require('lodash.snakecase')
}
module.exports = id