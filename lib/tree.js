const FS = require('fs')
const PATH = require('path')

const keeps_set = Symbol('keeps was set')
const keeps_hidden = Symbol('keeps hidden')


class Item extends Map{
  constructor(...x){
    super([
      ['path',x[0]],
      ['type',get_stat_type(...x)]
    ])
  }
  get skip(){ 
    return this.get('type') === null 
  }
  get name(){
    return this.get('type').name
  }
  get items(){
    return get_directory(this)
  }
  get content(){
    return this.get('type').file ? FS.readFileSync(this.get('path'),'utf8'):this.items
  }

}

function directoryTree (path, keeps) {
  const item = get_path_item(path,keeps)
	if (item !== null) { return item	}
  else return null
}

module.exports = (path, ...keep)=>{
  let hidden = keep.length > 0 && keep[0] === true ? true:false
  keep = keep.filter(k=>typeof k === 'string')
  let keeps = get_keeps(keep)
  if(hidden) keeps[keeps_hidden] = true
  return directoryTree(path,keeps)
}


//----------------shared actions----------------
function combine_only_the_files(dir,onlys){
  if(!Array.isArray(onlys)) onlys = []
  for(let item of dir){
    if(item instanceof Item){
      if(item.get('type').file) onlys.push(item)
      else onlys = onlys.concat(item.items.only)
    }
    else{
      console.log(item)
    }
  }
  return onlys
}


function get_directory(item){
    let dir = []
    if(item.get('type').directory){
      try {
        let path = item.get('path')
        dir = FS.readdirSync(path).map(child => directoryTree(PATH.join(path, child), item.get('type').keeps)).filter(e => !!e)
      } 
      catch(ex) {}
    }
    return new Proxy(dir,{
      get(o,name){
        if(name in o) return o[name]
        else if(name === 'only'){
          return combine_only_the_files(o)
        }
        return o
      }
    })
}


function get_keeps(keeps){
  if(keeps[keeps_set]) return keeps
  keeps = keeps.map(keep=>{
      if(keep.indexOf('.') === -1) return `.${keep}`
      return keep
  })
  keeps[keeps_set] = true
  return keeps
}

function get_path_item(path,keeps){
  let item
	try { 
    item = new Item(path,FS.statSync(path),keeps)
    if(item.skip) return null
  }
	catch (e) { 
    return null 
  }
  return item
}

function get_stat_type(path,stat,keep){
  const type = {}
  let name = PATH.basename(path)
  if(stat.isFile()){
    if(is_valid_file(PATH.extname(path),name,keep)){
      type.file = true
    }
    else return null
  }
  else if(stat.isDirectory()){
    type.directory = true
    type.name = name
    type.keeps = keep
  }
  type.name = name
  return type
}

function is_valid_file(type,name,keep){
  if(!keep[keeps_hidden] && name.indexOf('.') === 0) return false
  if(!keep.length) return true
  return keep.indexOf(type) >= 0 || keep.indexOf(name) >= 0
}