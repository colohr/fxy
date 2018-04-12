const fxy = require('../package/index')
const files = fxy.list(fxy.join(__dirname,'templates')).paths
const data = {}
data.template = fxy.tag.data.files(...files,{two:2,three:3}).join(',')
console.log(data)
const script = fxy.tag.data.file(fxy.join(__dirname,'template.js'),data)
console.log(script)
eval(script)