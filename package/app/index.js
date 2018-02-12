const json = require('./json')

class AppJson extends Map{
	constructor(data){
		super()
		for(const field in data) this.set(field,data[field])
	}
	api(...x){
		if(!this.has('api')) return null
		let name = require('path').join(...x)
		const list = this.get('api')
		if(name in list) return list[name]
		if(name.includes('/')){
			const parts = name.split('/')
			const provider_name = parts[0]
			parts.splice(0,1)
			name = parts.join('/')
			if(provider_name in list){
				const provider = list[provider_name]
				if(name in provider) return provider[name]
			}
		}
		return null
	}
}

//exports
module.exports = get_app

//shared actions
function get_app(...x){
	return new AppJson(json(...x))
}