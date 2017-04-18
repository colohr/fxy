const get = require('lodash.get')
const has = require('lodash.has')
const set = require('lodash.set')
const unset = require('lodash.unset')


//get object values from dot notation format
module.exports = function export_dot(is){
  
  function dot(object, notation) { 
    if(is.object(object) && is.text(notation)){
      let result = notation.split('.').reduce((o,i) => o[i], object)
      if(!is.nothing(result)) return result
    }
    return null
  }


  // ---------------shared actions------------------
  function dot_get(object, notation) { 
    if(is.object(object) && !is.nothing(notation)){
      let result = get(object,notation)
      if(!is.nothing(result)) return result
    }
    return null
  }

  function dot_has(object, notation) { 
    if(is.object(object) && !is.nothing(notation)){
      return has(object,notation)
    }
    return false
  }

  function dot_set(object, notation, value) {
    if(is.object(object) && !is.nothing(notation)){
      return set(object,notation,value)
    }
    return object
  }

  function dot_delete(object, notation) {
    console.log(object,notation, notation in object)
    if(is.object(object) && !is.nothing(notation)){
      if(notation in object) delete object[notation]
      else return unset(object,notation)
    }
    return true
  }

  

  dot.get = dot_get
  dot.has = dot_has
  dot.set = dot_set
  dot.delete = dot_delete

  return dot

}










				