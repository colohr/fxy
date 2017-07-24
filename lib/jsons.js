
const fs = require('fs')
const pth = require('path')
const ks = require('./id')
const merge = require('lodash.merge')


const DontJson = Symbol.for('DontJson')
const Save = Symbol.for('save')

const Key = {
  json:Symbol.for('jsonKey'),
  file:Symbol.for('fileKey')
}

const keystring = (str)=>{
  if(typeof str !== 'string') return DontJson;
  str = str.trim();
  if(str.length <= 0) return DontJson;
  return str;
}


const jsonKeys = filename=>{
  filename = keystring(filename)
  if(filename === DontJson) return {file:DontJson,json:DontJson};
  let name = filename.replace('.json','').trim()
  let file = filename.includes('.json') ? filename:filename+'.json'
  return {
    file,
    json:ks.camel(name)
  }
}


const isPath = (filepath)=>{ return filepath.includes('.json');}

const jsonFilter = name=>{return isPath(name)}



const getJsons = (dirpath)=>{return fs.readdirSync(dirpath).filter(jsonFilter)}

const readJson = (filepath)=>{
  if(!filepath || filepath === DontJson) return  console.error(filepath);
  filepath = keystring(filepath);
  if(filepath === DontJson){
    return console.error(filepath);

  }
  let doc = JSON.parse(fs.readFileSync(filepath,'utf8'));
  let keys = jsonKeys(filepath);
  doc[Key.json] = keys.json;
  doc[Key.file] = keys.file;
  return doc;
}

const writeJson = (filepath,json)=>{
  if(!filepath || filepath === DontJson) return  console.error(filepath);
  let keys = jsonKeys(filepath);
  if(keys.file === DontJson){
    console.error({filepath,json});
    return;
  }
  fs.writeFileSync(keys.file,JSON.stringify(json),'utf8');
  return true;
}

const $jsons = Symbol.for('jsons')


function Joxy(object,json){
  return new Proxy({
    object,
    json
  },{
    get(o,k){
      if(k in o.object){
        let v = o.object[k];
        if(typeof v === 'object' && v !== null){
          return Joxy(v,o.json);
        }
        return v;
      }
      return;
    },
    set(o,k,v){
      let last = o.object[k]
      if(last !== v){
        o.object[k] = v;
        return o.json[Save]();
      }
      return true;
    },
    has(o,name){
      return name in o.object
    },
    deleteProperty(o,k){
      delete o.object[k];
      return o.json[Save]();
    }
  })
};




function Json(doc,jsons){

  let jsonDoc = {
    doc,[$jsons]:jsons
  };
  jsonDoc[Save] = function(){
    let f = this.doc[Key.file];
    return this[$jsons].$write(f,this.doc);
  };
  return new Proxy(jsonDoc,{
    get(o,k){
      if(k in o.doc){
        let v = o.doc[k];
        if(typeof v === 'object' && v !== null){
          return Joxy(v,o);
        }
        return v;
      }else if(k === Save){
        return o[Save];
      }
      return;
    },
    set(o,k,v){
      if(k !== Save){
        o.doc[k] = v;
        return o[Save]();
      }
      return true;
    },
    has(o,name){
      return name in o.doc
    },
    deleteProperty(o,k){
      delete o.doc[k];
      return o[Save]();
    }
  })
}



class Jsons{
  static create(pathname){
    return new Jsons(pathname);
  }
  static proxy(pathname){
    return this.create(pathname).$proxy();
  }
  
  constructor(root){
    this.$root = root;
  } 
  get $jsons(){ return getJsons(this.$root); }
  $path(name){ 
    if(!name) return;
    let keys = jsonKeys(name)
    if(keys.file === DontJson) return DontJson;
    if(keys.file.includes(this.$root)) return keys.file;
    return pth.join( this.$root, keys.file );
  }
  $has(name){
    if(!name) return false;
    return this.$jsons.includes(jsonKeys(name).file);
  }
  $read(name){ 
    if(!name) return;
    if(!this.$has(name)){
      let keys = jsonKeys(name);
      let newDoc = {}
      newDoc[Key.json] = keys.json;
      newDoc[Key.file] = keys.file;
      return Json(newDoc,this);
    }else{
      let doc = readJson(this.$path(name));
      return Json(doc,this);
    }
    return {};
  }
  $write(name,data){ 
    if(!name) return true;
    return writeJson(this.$path(name),data); 
  }
  $proxy(){
    return new Proxy(this,{
      get(o,k){
        
        if(!k || typeof k !== 'string' || k === DontJson) return;
        if(k.charAt(0) === '$'){
          switch(k){
            case '$keys':
              return o.$jsons.map(name=>jsonKeys(name).json);
              break;
            case '$files':
            case '$jsons':
              return o.$jsons;
              break;
            case '$length':
            case '$size':
            case '$count':
              return o.$jsons.length;
              break;
            case '$root':
            case '$':
              return o.$root;
              break;
            case '$proxy':
              return o;
              break;
            default:
              break;
          }
        }
        else if(k in o) return o[k]
        else {
          let v = o.$read(k);
          return v;
        } 
      },
      set(o,k,v){
        if(!k || typeof k !== 'string' || k === DontJson) return true;
        if(typeof v === 'object' && v !== null){
          return o.$write(k,v);
        }
        return true;
      },
      deleteProperty(o,k){
        let p = o.$path(k);
        if(fs.existsSync(p)){
          fs.unlinkSync(p);
        }
        return true;
      }
    })
  }
}



module.exports = Jsons;