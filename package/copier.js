const fs = require('fs')
const path = require('path')
const tree = require('./tree')
const make_dir = require('./make_folder')

class Copier{
  constructor(from,to,skips){
    this.from = from
    this.to = to
    this.skips = Array.isArray(skips) ? skips:['node_modules','.git','.idea','.DS_Store']
  }
  create(){
    return new Promise(success=>{
      let copy_tree = tree(this.from)
      let items = copy_tree.items.only
      let directories = this.create_directories(items)
      let files = this.create_files(items)
      this.results = {directories, files}
      this.items = items
      return success(this)
    })
  }
  create_directories(items){
    return items.map(item=>{
        let type = item.get('type')
        if(type.file){
          let path = item.get('path')
          if(!this.skip(path)){
            let to = this.directory_path(path)
            if(!fs.existsSync(to)){
              try{ make_dir.sync(to) }
              catch(e){ return e.message }
              return to
            }
          }
        }
        return null
    }).filter(item=>item !== null)
  }
  create_files(items){
    return items.map(item=>{
        let type = item.get('type')
        let path = item.get('path')
        if(type.file && !this.skip(path)){
          let to = this.target_path(path)
          try{
            copy_file(path,to)
            item.created = to
          }
          catch(e){ item.error = e }
          return item
        }
        return null
    }).filter(item=>item !== null)
  }
  directory_path(pathname){ return path.dirname(this.target_path(pathname)) }
  skip(pathname){ return this.skips.filter(skip=>pathname.includes(skip)).length > 0 }
  target_path(pathname){ return pathname.replace(this.from,this.to) }
}

//exports
module.exports.Copier = Copier
module.exports.directory = copy_directory

//shared actions
function copy_directory(...x){
  let copier = new Copier(...x)
  return copier.create()
}

function copy_file(from,to){
  let content = fs.readFileSync(from)
  return fs.writeFileSync(to,content)
}