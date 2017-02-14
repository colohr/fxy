
const fs = require('fs');


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

module.exports = {
  sloppy,proppy
};