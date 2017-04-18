const fs = require('fs')








const is = {
    array:is_array,
    bool:is_bool,
    data:is_data,
    get dir(){return this.folder },
    file(path){return fs.statSync(path).isFile()},
    folder(path){return fs.statSync(path).isDirectory()},
    empty:is_empty,
    error:is_error,
    function:is_function,
    instance:is_instance,
    json:is_json,
    map:is_map,
    nothing:is_nothing,
    number:is_number,
    object:is_object,
    set:is_set,
    string:is_string,
    symbol:is_symbol,
    text:is_text,
    TF:is_TF
}



module.exports = is;

// --------shared actions---------

function is_array(value){ return is_object(value) && Array.isArray(value) }
function is_bool(value){return is_TF(value)}
function is_data(value){ return is_object(value) && !is_array(value) && !is_error(value) }
function is_empty(value){ return require('./as').count(value) === 0 }
function is_error(value){ return is_object(value) && value instanceof Error }
function is_function(value){ return typeof value === 'function' }
function is_instance(value,type){ return is_object(value) && is_function(type) && value instanceof type }
function is_json(value){ return is_text(value) && /^[\],:{}\s]*$/.test(value.replace(/\\["\\\/bfnrtu]/g, '@').replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').replace(/(?:^|:|,)(?:\s*\[)+/g, '')) }
function is_map(value){ return is_object(value) && value instanceof Map }
function is_nothing(value){ return typeof value === 'undefined' || value === null || (typeof value === 'number' && isNaN(value)) }
function is_number(value){ return typeof value === 'number' && !isNaN(value) && isFinite(value) }
function is_object(value){ return typeof value === 'object' && value !== null }
function is_set(value){ return is_object(value) && value instanceof Set }
function is_string(value){ return is_text(value)}
function is_symbol(value){ return typeof value === 'symbol'}
function is_text(value){ return typeof value === 'string' || (is_object(value) && value instanceof String)}
function is_TF(value){return typeof value === 'boolean'}