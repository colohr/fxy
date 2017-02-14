fxy
=============

Install `fxy` 
-------------
```
  npm i fxy
```

Use 
-------------
```js
const fxy = require('fxy')

//idk
fxy.readFile('file.txt')
   .then(data=>console.log(data))
   .catch(error=>console.error(error)) 

const ls = fxy.ls
let D = __dirname

//use ls D:
ls(D)
=>['My Json.1.json',
  'My Json.json',
  'Other Json.json',
  'inner-dir',
  'inner-dir-2' ]
------
ls(D).dirs
=>[ 'inner-dir', 'inner-dir-2' ]
------
ls(D).files()
=>[ 'My Json.1.json', 'My Json.json', 'Other Json.json' ]
------
ls(D).files('html')
=>[]
```


```js
------
fxy.is.file('My Json.1.json') // stat.isFile()
true
------
fxy.is.dir(D) // stat.isDirectory()
true
------
```



```js
let D = '/usr/git-hub/tests/fxy/jsons'
fxy.root = D

fxy.jsons 
null 
------
const json = fxy.jsons
Jsons { '$root': '/usr/git-hub/tests/fxy/jsons' }
------
json.$files
[ 'My Json.1.json', 'My Json.json', 'Other Json.json' ] 
------
json.$keys
[ 'myJson1', 'myJson', 'otherJson' ]
------
json.newobj = {hi:true}
{ doc: { hi: true } }
------
json.$files
[ 'My Json.1.json',
  'My Json.json',
  'Other Json.json',
  'newobj.json' ]
```

-----
FXY
-----

The `doc` property in printed result is not reflected in file or obj value. So it won't return anything. 
For exp: 
```js
json.newobj.doc
undefined
```

```js

json.newobj.other = {innerNewObj:true}
{ doc: { hi: true, other: { innerNewObj: true } } }
------
delete json.newobj.other
{ doc: { hi: true } }
------
delete json.newobj
[ 'My Json.1.json', 'My Json.json', 'Other Json.json' ]
------


```



License
-------------
ISC