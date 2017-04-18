module.exports  = function as_export(is,dot){
    
    const as = {
      array: get_array,
      clone: require('lodash.clone'),
      count: get_count,
      data: get_data,
      dot_notation: get_dot_notation,
      get dots(){ return this.dot_notation },
      get keys(){ return this.names },
      get merge(){ return this.one },
      number(x){ return get_numeral(x).value },
      numeral:get_numeral,
      names:get_names,
      one: require('lodash.merge'),
      text: get_text
    }



  function get_array( array, map ){
    let texts={
      empty:{
        filter(text){ return is.text(text) && text.length > 0 },
        map(text){ return is.text(text) ? text.trim():null }
      }
    }
    if( is.array(array) ) {
      if( is.function(map) ) array = array.map(map)
      else if( is.text(map) && has_text_filter() ) array = text()
    }
    else array = []
    return array
    
    function text(){ return array.map(texts[map].map).filter(texts[map].filter) }
    
    function has_text_filter(){ return map in texts }
  }


  function get_count(value){ 
    if(is.array(value) || is.text(value)) return value.length
    else if(is.map(value) || is.set(value)) return value.size
    else if(is.data(value)) return Object.keys(value).length
    return 0
  }


  function get_data(x){
    var data = {}
    if(is.object(x)){
      try{
        data = JSON.parse(JSON.stringify(x))
      }catch(e){
        for(let name in x) {
          let value = x[name]
          if( is.object(value) ) data[name] = get_data(value)
          else data[name] = value
        }
      }
    }
    else if(is.json(x)){
      try{
        data = JSON.parse(x)
      }catch(e){}
    }
    return data
  }

  function get_dot_notation(x){
      return  {
        get container(){ return this.parts.slice( 0, this.count-1 ).join('.') },
        get count(){ return this.parts.length },
        origin:is.text(x) ? x:'',
        get parts(){ return 'particles' in this ? this.particles : this.particles = get_array( this.origin.split('.'), 'empty' ) },
        get selector(){ return this.parts.join('.') },
        get target(){ return this.parts[ this.count-1 ] },
        value(data){ return dot.get(data,this.selector)  },
        toString(){ return this.origin },
        valueOf(){ return this.parts.join('.') }
      }
    }



  function get_names(value){ 
    if(is.map(value) || is.set(value)) return Array.from(value.keys())
    else if(is.array(value) || is.data(value)) return Object.keys(value)
    return []
  }

  function get_numeral(x){
      let value
      let type = typeof x
      if(is.string(x)) value = parseFloat(x)
      else if(is.number(x)) value = x
      else if(is.bool(x)) value = value === true ? 1:0
      else value = NaN
      let unit = get_text.difference(x,value)
      return {
        unit,
        type,
        get valuable(){return is.number(this.value)},
        value,
        toString(){ return JSON.stringify(this) },
        valueOf(){ return `${this.value}${this.unit || ''}` }
      }
    }


  function get_text(value,dont_trim){
    var text = ''
    if(!is.nothing(value) && !is.symbol(value)){
      if(is.array(value)) text = get_text.array(value,dont_trim)
      else if(is.data(value)) text = get_text.data(value)
      else if(is.function(value)) text = value.toString()
      else if(is.number(value) || is.TF(value)) text = value+''
      else if(is.text(value)) text = value
    }
    text = dont_trim ? text:text.trim()
    return text
  }

  get_text.array = function(array,dont_trim){
    return array.map(value=>{ return get_text(value,dont_trim) }).join('\n\t')
  }

  get_text.data = function(data){
    try{ return JSON.stringify(get_data(data)) }
    catch(e){ return '{}' }
  }

  get_text.difference = function get_text_difference(original,value){
    if(is.text(original)){
      let difference = original.replace(`${value}`,'').trim()
      if(difference.length) return difference
    }
    return ''
  }

  return as;


}
