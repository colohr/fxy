const fs = require('fs')

//exports
module.exports = {
	read,
	read_sync,
	get readSync(){ return read_sync },
	write,
	write_sync,
	get writeSync(){ return write_sync }
}

//shared actions
function get_readable(...readable){
	if(readable.length === 1){
		let tab = 4
		if(typeof readable[0] === 'number') tab = readable[0]
		return [null,tab]
	}
	return readable
}

function read(file){
	return new Promise((success,error)=>{
		return fs.readFile(file,'utf8',(e,text)=>{
			if(e) return error(e)
			let data = to_data(text)
			if(data instanceof Error) return error(data)
			return success(data)
		})
	})
}

function read_sync(file){
	let text = fs.readFileSync(file,'utf8')
	let data = to_data(text)
	if(data instanceof Error) throw data
	return data
}

function to_data(value){
	try{ return JSON.parse(value) }
	catch(e){ return e }
}

function to_text(value,...readable){
	try{
		let options = [value]
		if(readable.length) options = options.concat(get_readable(...readable))
		return JSON.stringify(...options)
	}
	catch(e){ return e }
}

function write(file,data,...readable){
	return new Promise((success,error)=>{
		let text = to_text(data,...readable)
		if(text instanceof Error) return error(text)
		return fs.writeFile(file,text,'utf8',(e,result)=>{
			if(e) return error(e)
			return success(result)
		})
	})
}

function write_sync(file,data,...readable){
	let text = to_text(data,...readable)
	if(text instanceof Error) throw text
	return fs.writeFileSync(file,text,'utf8')
}