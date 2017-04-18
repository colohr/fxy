
module.exports = {
  get camel(){ return this.code },
  get capital(){ return this.capitalize },
  capitalize: require('lodash.capitalize'),
  code: require('lodash.camelcase'),
  dash: require('lodash.kebabcase'),
  get kebab(){ return this.dash },
  get snake(){ return this.underscore },
  get underscore(){ return this._ },
  _:require('lodash.snakecase')
}