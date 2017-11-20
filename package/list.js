const fs = require('fs')
const path = require('path')
const is = require('./is')

//exports
module.exports = get_list

//shared actions
function get_files(folder,...items){
    let files = items.filter(item=>is.file(path.join(folder,item)))
	return new Proxy(function filter_types(...x){
		if(x.length <= 0) return files
		let types = get_types(...x)
		return files.filter(name=>{
			let matches = types.filter(type=>name.includes(type))
			return matches.length > 0
		})
	},{
	  get(o,name){
	    let value = null
	    if(name in files){
	        value = files[name]
            if(typeof value === 'function') value = value.bind(files)
            return value
        }
        else if(name === 'paths') return files.map(item=>path.join(folder,item))
        else if(name === 'folder') return folder
	    else if(name === 'count') return files.length
        else if(name in o){
		    value = o[name]
		    if(typeof value === 'function') value = value.bind(o)
		    return value
	    }
        return null
      }
    })
}

function get_folders(folder,...items){
  let folders = items.filter(item=>is.folder(path.join(folder,item)))
  return new Proxy(folders,{
    get(o,name){
        if(name in o){
            let value = o[name]
            if(typeof value === 'function') value = value.bind(o)
            return value
        }
        else if(name === 'paths')return folders.map(item=>path.join(folder,item))
        else if(name === 'folder') return folder
        else if(name === 'count') return folders.length
        return folders
    }
  })
}

function get_list(folder){
	return new Proxy(fs.readdirSync(folder),{
		get(o,name){
			if(name in o) {
				let value = o[name]
				if(typeof value === 'function') value = value.bind(o)
				return value
			}
			switch(name){
                case 'count': return o.length
				case 'files': return get_files(folder,...o)
                case 'folder': return folder
                case 'paths': return o.map(item=>path.join(folder,item))
				case 'folders':
				case 'dirs':
					return get_folders(folder,...o)
			}
			return o
		},
        has(o,name){ return name in o }
	})
}

function get_types(types,...x){
  if(Array.isArray(types)) x = x.concat(types)
  else x.push(types)
  return x.filter(type=>typeof type === 'string')
}









