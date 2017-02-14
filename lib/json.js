
const fs = require('fs')

function stringify(value){
  try{
    return JSON.stringify(value);
  }catch(e){
    return e;
  }
}
function parse(value){
  try{
    return JSON.prase(value);
  }catch(e){
    return e;
  }
}


const readSync = function readSync(filepath){
    let data = fs.readFileSync(filepath,'utf8');
    let json = parse(data);
    if(json instanceof Error) throw json;
    return json;
};

const read = function read(filepath){
  return new Promise((resolve,reject)=>{
    return fs.readFile(filepath,'utf8',(err,data)=>{
      if(err) return reject(err);
      let json = parse(data);
      if(json instanceof Error) return reject(err);
      return resolve(json);
    });
  });
}

const writeSync = function writeSync(filepath,data){
  let json = stringify(data);
  if(json instanceof Error) throw json;
  return fs.writeFileSync(filepath,json,'utf8');
};

const write = function write(filepath,data){
  return new Promise((resolve,reject)=>{
    let json = stringify(data);
    if(json instanceof Error) return reject(json);
    return fs.writeFile(filepath,json,'utf8',(err,res)=>{
      if(err) return reject(err);
      return resolve(res);
    });
  });
}

module.exports = {
  read,readSync,write,writeSync
};