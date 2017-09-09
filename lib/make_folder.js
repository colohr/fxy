const mkdirp = require('mkdirp')

//exports
module.exports.promise = make_directories
module.exports.sync = make_directories_sync

//shared actions
function make_directories(path){
  return new Promise((success,error)=>{
    return mkdirp(path,err=>{
      if(err) return error(err)
      return success(path)
    })
  })
}

function make_directories_sync(path){
  return mkdirp.sync(path)
}