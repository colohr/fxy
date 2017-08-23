
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
    return new Promise((success,error)=>{
      let copy_tree = tree(this.from)
      let items = copy_tree.items.only
      let directories = this.create_directories(items)
      let files = this.create_files(items)
      this.results = {
        directories,
        files
      }
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
            // console.log('------------')
            // console.log('from: ',path)
            // console.log('to: ',to)
            // console.log('------------')
            try{
              make_dir.sync(to)
              return to
            }
            catch(e){
              return e.message
            }
          }
        }
      }
      return null
    }).filter(item=>{
      return item !== null
    })
  }
  create_files(items){
    return items.map(item=>{
      let type = item.get('type')
      let path = item.get('path')
      if(type.file && !this.skip(path)){
        
        let to = this.target_path(path)
        // console.log('------------')
        // console.log('from: ',path)
        // console.log('to: ',to)
        // console.log('------------')
        try{
          copy_file(path,to)
          item.created = to
        }
        catch(e){
          item.error = e
        }
        return item
      }
      return null
    }).filter(item=>{
      return item !== null
    })
  }
  directory_path(pathname){
    return path.dirname(this.target_path(pathname))
  }
  skip(pathname){
    return this.skips.filter(skip=>{
      return pathname.includes(skip)
    }).length > 0
  }
  target_path(pathname){
    return pathname.replace(this.from,this.to)
  }
}




function proppy(from,to){
  let reader = fs.createReadStream(from);
  let writer;
  var err=null;
  return new Promise((resolve,reject)=>{
    
    reader.on('error',(error)=>{
      err = error;
      console.log('flowing',reader._readableState.flowing)
      if(writer){
        console.log('error writer not closed')
        
        // writer.close();
      }else{
        reject(err);
      }
    });
    reader.on('open',()=>{
      console.log('flowing',reader._readableState.flowing)
      writer = fs.createWriteStream(to);
      writer.on('error',(error)=>{
        err = error;
      });
      writer.on('open',()=>{
        reader.pipe(writer);
      })
      writer.on('close',()=>{
        console.log('flowing',reader._readableState.flowing)
         console.log('writer closed err: ',err)
        if(err) return reject(err)
        else resolve();
      });
    });
    
  });
}
function sloppy(from,to){
  return fs.createReadStream(from).pipe(fs.createWriteStream(to));
}


module.exports.Copier = Copier
module.exports.directory = copy_directory
module.exports.proppy = proppy
module.exports.sloppy = sloppy


function copy_directory(...x){
  let copier = new Copier(...x)
  return copier.create()
}

function copy_file(from,to){
  let content = fs.readFileSync(from)
  return fs.writeFileSync(to,content)
}