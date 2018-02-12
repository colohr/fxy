const path = require('path')
const fs = require('fs')
const folder ={
	get current(){ return process.cwd() },
	get modules(){ return path.join(__dirname,'../../../') },
	get print(){ return process.env.PWD },
	get project(){ return get_project_location(this.current) },
	get root(){ return path.join(this.modules,'../') }
}

//exports
module.exports = get_app_json

//shared actions
function get_app_json(app_json){
	let json = null
	if(typeof app_json === 'object' && app_json !== null) json = app_json
	else json = read_app_json(app_json)
	if(!('folder' in json)) json.folder = folder.project
	return json
}

function get_app_json_location(input){
	let location = input
	if(typeof location === 'string'){
		if(location.indexOf('app.json') === -1) location = path.join(location,'app.json')
		if(fs.existsSync(location)) return location
	    location = path.join(`${folder.project}`,location)
	}
	if(!location || !fs.existsSync(location)) location = path.join(`${folder.project}`,'app.json')
	return location
}

function get_project_location(current){
	if(current.indexOf('node_modules')>=0){
		return get_project_location(path.join(current,'../'))
	}
	return current
}

function read_app_json(json_location){
	const location = get_app_json_location(json_location)
	let data = null
	if(fs.existsSync(location)) data = require(location)
	else data = {}
	if(!('folder' in data)) data.folder = path.dirname(location)
	return data
}
