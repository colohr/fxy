const fxy = require('../index')
const switch_object_actions = require('../methodology/switch_object_actions')

const FolderOptionsHelp = `
    options list
    ======================
    0. root directory or __dirname from your app
    1. target directory 
    2. file_type or default to js
    3. file_encoding if not js defaults to "text" = utf8
      - to read js file & not require it pass "text" or utf8
    `

class Folder{
  static encoding(type,value){
    if(type.includes('js') && typeof value !== 'string') return null
    value = typeof value !== 'string' ? 'utf8':value
    if(value === 'text') return 'utf8'
    return value
  }
  constructor(...options){
    if(options.length >= 2){
      this.root_directory = options[0]
      if(typeof this.root_directory !== 'string') throw new Error(`fxy Folder requires a root directory\n${FolderOptionsHelp}`)
      this.path = options[1]
      if(typeof this.path !== 'string') throw new Error(`fxy Folder requires a read path\n${FolderOptionsHelp}`)
      this.file_type = typeof options[2] === 'string' ? options[2] : 'js'
      this.file_encoding = this.constructor.encoding(this.file_type,options[3])
    }
    else throw new Error('fxy.folder(...) needs [root_directory,path] to work.')

  }
  get directory(){ 
    return fxy.join(this.root_directory,this.path) 
  }
  get exists(){ return fxy.exists(this.directory) }
  //returns list of files
  get files(){
    return fxy.ls(this.directory).files(this.file_type)
  }
  get folders(){
    return fxy.ls(this.directory).dirs
  }
  //actions
  get_path(name){
    let path = this.file_encoding !== null ? `${name}.${this.file_type}`:name
    return fxy.join(this.directory,path)
  }
  //returns array of files in directory
  get list(){
    return fxy.ls(this.directory)
  }
  //returns array of names from the list value
  get names(){
    let type = this.file_type.length ? `.${this.file_type}` : ''
    return this.list.map(name=>{return name.replace(type,'')})
  }
  //return the proxy of this Folder
  get proxy(){
    return new Proxy(this,{
      get(o,n){       
        if(typeof n === 'string') {
          if(o.names.includes(n) || o.list.includes(n)){
            let filepath = `${o.get_path(n)}`
            let encoding = o.file_encoding
            if(encoding !== null || o.file_type.includes('js') === false) {
              return fxy.readFileSync(filepath, encoding)
            }
            return require(filepath)
          }
          else if(n === 'selfie') return o
          else if(n in o) return o[n]
        } 
        let result = switch_object_actions(o,n)
        if(result !== null) return result
        return null
      },
      has(o,n){
        return  o.names.includes(n) || o.list.includes(n)
      }
    })
  }
}






module.exports = (...options)=>{ return (new Folder(...options)).proxy }
module.exports.Folder = Folder




