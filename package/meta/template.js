//exports
module.exports = create_template
module.exports.create = create_template

//scope actions
function create_template(content){
	if(require('path').extname(content)) content = require('fs').readFileSync(content,'utf8')
	return function template(data){ return require('../tag').data(content, data) }
}