const mkdirp = require('mkdirp')

//exports
module.exports = make_folders
module.exports.promise = make_folders
module.exports.sync = make_folders_sync

//scope actions
function make_folders(folder){
  return new Promise(make_folders_promise)
  //scope actions
  function make_folders_promise(success,failed){
    mkdirp(folder,on_response)
    //scope actions
    function on_response(error){
      if(error) failed(error)
      else success(folder)
    }
  }
}

function make_folders_sync(folder){ return mkdirp.sync(folder) }
