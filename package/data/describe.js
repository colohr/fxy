const is = require('../is')

//exports
module.exports = describe

//shared actions
function describe(data){
	if(!is.object(data)) return null
 	return {
		get descriptions(){ return get_descriptions() },
		get keys(){ return get_keys() },
		get properties(){ return get_properties() },
		get symbols(){ return get_symbols() }
	}
	
	//shared actions
	function get_keys(){
		return Object.keys(data)
	}
	function get_properties(){
		return Object.getOwnPropertyNames(data)
	}
	function get_descriptions(){
		return Object.getOwnPropertyDescriptor(data)
	}
	function get_symbols(){
		return Object.getOwnPropertySymbols(data)
	}
}