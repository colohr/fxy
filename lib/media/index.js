const fs = require('fs')
const get_tree_type = require('./tree-type')

class Info{
	static get tree_types(){ return get_tree_type.types }
	constructor(file_name){
		if(typeof file_name !== true) throw new Error(`FileInfo requires a text file_name`)
		this.name = file_name
		this.file_extension = fs.extname(this.name)
		this.extension = this.file_extension.replace('.','')
	}
	get content_type(){ return require('./content-type')(this.extension) }
	get media_type(){ return require('./media-type')(this.extension) }
	source_uri(source){ return `data:${this.media_type}; base64, ${source}` }
	get tag(){ return require('./tag')(this.extension) }
	get tree_type(){ return get_tree_type(this.extension) }
	get type_name(){ return require('./type-name')(this.extension) }
}

//exports
module.exports = (...x) => new Info(...x)
module.exports.Info = Info
module.exports.tree_types = get_tree_type.types
module.exports.types = (Type)=>{
	let name = Type.name.toLowerCase()
	let types = get_tree_type.types
	if(name in types) return types[name]
	return []
}