const to_argument = require('../argument')

//exports
module.exports = constructor_call
module.exports.entry = entry
module.exports.false = to_false
module.exports.flip = flip
module.exports.inset = inset
module.exports.true = to_true

//scope actions
function constructor_call(InstanceType){ return function instantiate(construction){ return new InstanceType(...to_argument(construction)) } }

function entry(){ return arguments[0] }

function flip(method, bind){ return function flip_false_true(){ return method.apply(bind || this, arguments) === true ? false:true } }

function inset(method, bind){ return function inset_apply(){ return method.apply(bind || this, arguments) } }

function to_false(){ return Boolean(...arguments) === false }

function to_true(){ return Boolean(...arguments) }


