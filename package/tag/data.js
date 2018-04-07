
//exports
module.exports = get_data
module.exports.file = get_data_file
module.exports.files = get_data_files
module.exports.fragment = get_data_fragment
module.exports.value = get_value

//shared actions
function get_data(...x){
	const inputs = get_inputs(...x)
	const fragment = get_fragment(inputs.content[0], inputs.start_end)
	return fragment.item(fragment=>get_value(fragment, inputs.data))
}

function get_data_file(...x){ return get_data_files(...x).join('') }

function get_data_files(...x){
	const inputs = get_inputs(...x)
	const contents = inputs.content.map(file=>require('fs').readFileSync(file, 'utf8'))
	const start_end = !inputs.start_end ?  ['${(', ')}']:[]
	return contents.map(content=>{
		const fragment = get_fragment(content, start_end)
		return fragment.item(fragment=>get_value(fragment, inputs.data))
	})
}

function get_data_fragment(data, content, ...x){
	const inputs = get_inputs(...x)
	const fragment = get_fragment(inputs.content[0], inputs.start_end)
	return fragment.item(fragment=>get_value(fragment, inputs.data))
}

function get_fragment(...x){ return (require('../fragment'))(...x) }

function get_inputs(...x){
	const content = x.filter(i=>typeof i === 'string')
	const start_end = x.filter(i=>Array.isArray(i))[0]
	const data = x.filter(i=>typeof i === 'object' && i !== start_end)[0]
	return {
		content,
		data,
		start_end
	}
}

function get_value(fragment, data){
	if(fragment in data) return data[fragment]
	return eval(`(x)=>(x.${fragment})`)(data)
}



