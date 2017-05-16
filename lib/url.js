

const Url = {
  protocol: null,
  slashes: null,
  auth: null,
  host: null,
  port: null,
  hostname: null,
  hash: null,
  search: null,
  query: null,
  pathname: null,
  path: null,
  href: null 
}


const url_proxy = new Proxy({
  get url(){ return require('url') },
  get(name){ return this.url[name] },
  has(name){ return name in this.url }
},{
  get(o,name){
    if(o.has(name)) return o.get(name)
    return null
  },
  has(o,name){
    return o.has(name)
  }
})



module.exports = new Proxy(url_value,{
  get(o,name){
    if(name === 'get') return get_url_value
    else if(name === 'has') return has_url_value
    else if(name in url_proxy) return url_proxy[name]
    return o
  },
  has(o,name){
    if(name in o) return true
    else if(has_url_value(name)) return true
    else if(name in url_proxy) return true
    return false
  }
})


function get_url_value(key){
  return function url(value){ 
    let url_object = url_value(value)
    return url_object !== null ? url_object[key]:Object.create(Url)
  } 
}

function has_url_value(key){ return key in Url }


function url_value(value){
  if(typeof value === 'string'){
    return url_proxy.parse(value)
  }
  else if(typeof value === 'object' && value !== null){
    return url_proxy.format(value)
  }
  return null
}