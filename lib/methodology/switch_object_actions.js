

module.exports  = function switch_object_actions(o,n){
  if(typeof n === 'symbol' && n in o) return o[n]
  switch(n){
    case 'valueOf':
    case 'toString':
      if(n in o) return o[n]
      break;
  }
  return null
}