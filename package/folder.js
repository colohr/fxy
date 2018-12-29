//exports
module.exports.name = get_folder_name

//folder name of an file system location
function get_folder_name(location){
	if(require('path').extname(location).length){
		return require('path').basename(location.replace(require('path').basename(location), ''))
	}
	return require('path').basename(location)
}
