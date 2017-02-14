

const fs = require('fs')


const is ={
  file(path){return fs.statSync(path).isFile()},
  dir(path){return fs.statSync(path).isDirectory()}
}


module.exports = is;