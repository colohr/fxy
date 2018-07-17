const Fragments = {
	get escape(){ return escape },
	get get(){ return get_fragment },
	get has(){ return has_fragment },
	get replace(){ return replace_fragment },
	get replacer(){ return get_fragment_replacer }
}

//exports
module.exports = new Proxy(text_fragments,{
	get(o,field){
		if(field in Fragments) return Fragments[field]
		return null
	}
})

//shared actions
function escape(text){ return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&') }

function get_fragment(text,start,end){
	if(!has_fragment(text,start,end)) return ''
	return text.substring(text.lastIndexOf(start)+start.length,text.lastIndexOf(end))
}

function get_fragment_replacer(fragment, start, end){ return `${start}${fragment}${end}` }

function has_fragment(text, start, end){ return text.lastIndexOf(start) !== -1 && text.lastIndexOf(end) !== -1 }

function replace_fragment(text,fragment,value,start,end){
	value = !value ? '':value
	const replacer = get_fragment_replacer(fragment, start, end)
	return text.replace(replacer, value)
}

function text_fragments(content, start_end){
	let text = typeof content === 'string' ? content:''
	start_end = Array.isArray(start_end) && start_end.length === 2 ? start_end:['\$\{', '\}']
	return {
		item(on_fragment){
			const fragment = get_fragment(text, ...start_end)
			if(fragment){
				const value = typeof on_fragment !== 'function' ? '':on_fragment(fragment, text)
				text = replace_fragment(text, fragment, value, ...start_end)
				return this.item(on_fragment)
			}
			return text
		},
		next(...next){ return text_fragments(text, next) }
	}
}