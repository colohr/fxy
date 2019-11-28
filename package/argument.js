//exports
module.exports = create_arguments

//scope actions
function create_arguments(){ return require('./is').argument(arguments[0]) ? arguments[0]:arguments }