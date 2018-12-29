const fxy = require('../')
const dependencies_files = [
	'dependencies.meta',
	'dependencies.yaml',
	'dependencies.json',
]
const package_files = [
	'package.json',
	'package.meta',
	'package.yaml'
]

switch(get_lifecycle()){
	case 'preinstall': set_package()
		break
	default:
		module.exports = set_package
		break
}

//scope actions
function get_lifecycle(){
	try{ return process.env.npm_lifecycle_event || null }
	catch(error){ return null }
}

function set_package(package_file){
	const folder = get_package_folder(package_file)
	const file = get_package_file(package_file || folder)
	const package_json = fxy.exists(file) ? require(file):{}
	const entry_file = package_json.main ? require('path').join(folder,package_json.main):null
	if(!entry_file || !fxy.exists(entry_file)) {
		console.log('No entry location found.  Unable to update dependencies.')
		return process.exit(0)
	}
	const entry_folder = fxy.dirname(entry_file)
	try{
		if(!package_json.dependencies) package_json.dependencies = {}
		const original_dependencies = JSON.stringify(package_json.dependencies)
		const dependencies = get_dependencies()
		if(original_dependencies !== JSON.stringify(dependencies)){
			package_json.dependencies = dependencies
			create_backup_package(function create_new_package_json(){
				require('fs').writeFileSync(file, JSON.stringify(package_json,null,2), 'utf8')
				console.log('\n============================================\nRERUN INSTALL TO UPDATE PACKAGE DEPENDENCIES\n============================================\n')
				process.exit(1)
			})
		}
	}
	catch(error){ console.error(error) }

	//scope actions
	function get_dependencies(){
		//exports
		return fxy.as.one(package_json.dependencies, ...get_packages())
		//scope actions
		function get_packages(){
			try{ return fxy.tree(entry_folder, ...([].concat(package_files).concat(dependencies_files))).items.only.filter(filter_dependencies).map(get_dependencies) }
			catch(error){ return [] }
			//scope actions
			function filter_dependencies(item){
				if(item.get('path').includes('/removed/')) return false
				return item.get('path').replace(entry_folder,'').includes('/nodes_modules/') === false
			}
			function get_dependencies(item){
				const extension = fxy.extension(item.name)
				let data = null
				try{
					if(extension === 'meta' || extension === 'yaml') data = fxy.meta.file.read(item.get('path'))
					else data = fxy.json.read_sync(item.get('path'))
				}
				catch(error){ }
				if(fxy.is.data(data)) {
					if(item.name.includes('package') && fxy.is.data(data.dependencies)) data = data.dependencies
					else if(item.name.includes('dependencies')) data = data
				}
				return data
			}
		}

	}
	function create_backup_package(on_backup){
		if(backup_ready()) process.nextTick(on_backup)
		//scope actions
		function backup_ready(){
			const backup_package_file = require('path').join(folder, '.package.json.original')
			try{ return (require('fs').writeFileSync(backup_package_file, JSON.stringify(package_json, null, 2), 'utf8'), true) }
			catch(error){ return (console.error(error), false) }
		}
	}
}

function get_package_folder(package_file){
	if(!package_file) return process.cwd()
	return require('path').basename(package_file) === 'package.json' ? require('path').dirname(package_file):package_file
}

function get_package_file(package_file){ return require('path').basename(package_file) === 'package.json'  ? package_file:require('path').join(package_file, 'package.json') }


