
const fs = require('fs')
const pth = require('path')


function getTypes(args){
  var types = []
  if(args.length <= 0) return types;
  if(Array.isArray(args[0])) types = args[0];
  else types = args;
  return types.filter(type=>typeof type === 'string');
}

const files = (dir)=>{
  return function types(...args){
    let types = getTypes(args);
    return dir.filter(name=>{
      if(types.length <= 0) return true;
      let matches = types.filter(type=>name.includes(type));
      return matches.length > 0;
    }).filter(name=>{
      return pth.extname(name).length > 0
    })
  }
}

const dirs = (dir)=>{
  return dir.filter(name=>{return pth.extname(name).length <= 0})
}

function ls(dirpath){
  try{
    return new Proxy(fs.readdirSync(dirpath),{
      get(o,p){
        if(p in o) return o[p]
        else if(p === 'files') return files(o);
        else if(p === 'dirs') return dirs(o);
        return o;
      }
    })
  }catch(e){
    return e;
  }
}








module.exports = ls;