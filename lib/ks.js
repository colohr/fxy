
module.exports = {
  get camel(){ return this.code },
  get capital(){ return this.capitalize },
  capitalize: require('lodash.capitalize'),
  code: require('lodash.camelcase'),
  dash: require('lodash.kebabcase'),
  dot_notation(value){ return this.words(value).join('.') },
  get dots(){ return this.dot_notation },
  get kebab(){ return this.dash },
  path(value){ return this.words(value).join('/') },
  proper(value){ return this.words(value).map(word=>this.capitalize(word)).join(' ') },
  readable(value){ return this.words(value).join(' ') },
  get snake(){ return this.underscore },
  get underscore(){ return this._ },
  _:require('lodash.snakecase'),
  words:require('lodash.words')
}