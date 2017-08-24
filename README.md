FXY
=============
A filesystem Node.js module.

Proxy of "fs" + "path" modules with "fs" functions promised. Additional tools relevant to file system workflow are also included like:
- "fxy.tree" for synchronous listing of directories or targeted files
- "fxy.json.*" sync or async for writing & reading json 
- "mkdirp" 
- "lodash" functions for strings for working with file names

Also uses the "url" module except those colliding with "path" module but may be accessed via "fxy.url". 

Installing `fxy` 
-------------
```
  npm install fxy
```

FXY
-------------
```js
const fxy = require('fxy')

let object = { a:{ b: { c:true } } }
fxy.dot.get(object,'a.b.c') // = true


//unique to fxy

//note: fxy.* things return "null" values for nothingness because I never use "undefined"
FXY = `
┌─────────┬───────┬──────────────┬──────────┬──────────┬────────┐
│ (index) │ owner │ property     │ type     │ promised │ unique │
├─────────┼───────┼──────────────┼──────────┼──────────┼────────┤
│ 0       │ fxy   │ Item         │ class    │ false    │ true   │
    • a general file system item
    • is a Map instance
    • results from fxy.tree are instances of fxy.Item
    
├─────────┼───────┼──────────────┼──────────┼──────────┼────────┤
│ 1       │ fxy   │ Jsons        │ class    │ false    │ true   │
    • Turns a folder into a working object of json files.
    • Setting the fxy.root = "/path/to/jsons/folder" will add a 
      Jsons instance to "fxy" accessible via "fxy.jsons"
        - fxy.jsons.hello = {value:"world"}
        - results in a "/path/to/jsons/folder/hello.json" file
        - if you have other jsons file they can be used
        - fxy.jsons.other_file.date = new Date()
        - results in updated "other_file.json"
    
├─────────┼───────┼──────────────┼──────────┼──────────┼────────┤
│ 2       │ fxy   │ as           │ object   │ false    │ true   │
    • Converts values to other values
        - fxy.as.number('1234') = 1234
    • Other helper actions included
        - fxy.as.one({},{a:2},{a:1,b:1}) = {a:2,b:1} // uses "lodash.merge"
    
├─────────┼───────┼──────────────┼──────────┼──────────┼────────┤
│ 3       │ fxy   │ copy         │ promise  │ true     │ true   │
    • copies things async + promised
    
├─────────┼───────┼──────────────┼──────────┼──────────┼────────┤
│ 4       │ fxy   │ copySync     │ function │ false    │ true   │
    • copies things

├─────────┼───────┼──────────────┼──────────┼──────────┼────────┤
│ 5       │ fxy   │ copy_folder  │ function │ false    │ true   │
    • copies entire folder of things 
    • all the things in there

├─────────┼───────┼──────────────┼──────────┼──────────┼────────┤
│ 6       │ fxy   │ dot          │ function │ false    │ true   │
    • dot notation values
        - let object = { a: { b: { c:true } } }
          fxy.dot.get(object,'a.b.c') // = true 
         
├─────────┼───────┼──────────────┼──────────┼──────────┼────────┤
│ 7       │ fxy   │ id           │ object   │ false    │ true   │
    • reformatting & working with text
        - fxy.proper('somethingWrittenRhetorically') 
            = "Something Written Rhetorically"
        - fxy.medial('Hi There') = "hiThere"
            - or you can use it rhetorically like "fxy.camel"
        - fxy._('underscore me please') = "underscore_me_please"
            - also "fxy.underscore"
            - rhetorically: fxy.snake('snakeCase sounds rhetorical')
                = "snake_case_sounds_rhetorical"
            
├─────────┼───────┼──────────────┼──────────┼──────────┼────────┤
│ 8       │ fxy   │ is           │ object   │ false    │ true   │
    • tells it like it is
        - fxy.is.array({}) = true
        
        - fxy.is.count("hi" || [1,2], min=3) = false
        
        - fxy.is.data({}) = true
        - fxy.is.data([]) = false
        
        - fxy.is.empty(" " || "" || [] || {}) = true
        
        - fxy.is.numeric("1px") = true
        - fxy.is.number("1px") = false
        - fxy.is.number(NaN) = false
        - fxy.is.number(1) = true
            
        - fxy.is.object({} || [] || new Map()) = true
        - fxy.is.object(null) = false
        
        - fxy.id.text("hello") = true
        - fxy.id.text(2309) = false
            - rhetorically: fxy.id.string(null) = false
            
        - fxy.is.TF(false) = true
            - rhetorically: fxy.is.bool("false") = false
            
├─────────┼───────┼──────────────┼──────────┼──────────┼────────┤
│ 9       │ fxy   │ json         │ object   │ false    │ true   │
    • json files
    + read: [Function: read],
      readSync: [Function: readSync],
      write: [Function: write],
      writeSync: [Function: writeSync]
    
├─────────┼───────┼──────────────┼──────────┼──────────┼────────┤
│ 10      │ fxy   │ jsons        │ object   │ false    │ true   │
    • A Jsons instance when setting a fxy.root = "path/to/jsons/folder"

├─────────┼───────┼──────────────┼──────────┼──────────┼────────┤
│ 11      │ fxy   │ list         │ function │ false    │ true   │
    • lists things in folder
    - fxy.list("folder/of/things") = ["thing 1", "thing-2.js" ]
    - fxy.list("folder/of/things").dirs = ["thing 1"]
    - fxy.list("folder/of/things").files("js") = ["thing-2.js"]

├─────────┼───────┼──────────────┼──────────┼──────────┼────────┤
│ 12      │ fxy   │ ls           │ function │ false    │ true   │
    - rhetorical name for fxy.list 
    
├─────────┼───────┼──────────────┼──────────┼──────────┼────────┤
│ 13      │ fxy   │ make_folder  │ object   │ false    │ true   │
    • "mkdirp" with unrhetorical names
    + promise: [Function: make_directories],
      sync: [Function: make_directories_sync]
      
├─────────┼───────┼──────────────┼──────────┼──────────┼────────┤
│ 14      │ fxy   │ make_folders │ function │ false    │ true   │
    • "mkdirp.sync" with unrhetorical name
    
├─────────┼───────┼──────────────┼──────────┼──────────┼────────┤
│ 15      │ fxy   │ media        │ function │ false    │ true   │
    • File media/content type information
    - fxy.media("song.mp3") = {content_type:"audio/mp3",...other_info}

├─────────┼───────┼──────────────┼──────────┼──────────┼────────┤
│ 16      │ fxy   │ mkdirp       │ function │ false    │ true   │
    • access "mkdirp" module

├─────────┼───────┼──────────────┼──────────┼──────────┼────────┤
│ 17      │ fxy   │ read_item    │ function │ false    │ true   │
    • Read an file system path
    - song = fxy.read_item("folder/song.mp3")
        - song.name = "song.mp3"
        - song.get('path') = "folder/song.mp3"
        - song.get('type') = {directory:false,...other_info}
        - song.content = contents of file as text
        
├─────────┼───────┼──────────────┼──────────┼──────────┼────────┤
│ 18      │ fxy   │ root         │ string   │ false    │ true   │
    • creates a Jsons instance for fxy.jsons
    
├─────────┼───────┼──────────────┼──────────┼──────────┼────────┤
│ 19      │ fxy   │ source       │ object   │ false    │ true   │
    • adjusts rhetorical problems dealing with source paths & urls
    + file: [Function: get_file],
      folder: [Function: get_folder],
      url: [Function: get_url]
    - fxy.source.url("https://aaah.com/hi//messy","/o.html")
        = "https://aaah.com/hi/messy/o.html"
        
├─────────┼───────┼──────────────┼──────────┼──────────┼────────┤
│ 20      │ fxy   │ tag          │ object   │ false    │ true   │
    • a copy of MDN's "Tagged template literals" example #2
      @ https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals
 
├─────────┼───────┼──────────────┼──────────┼──────────┼────────┤
│ 21      │ fxy   │ tree         │ function │ false    │ true   │
    • get tree of folder
    • results are PathItem instances which is extended by fxy.Item
    
    - tree = fxy.tree("folder",...extension_name_or_file_name_to_filter)
    
    //target file type or name
    - tree = fxy.tree("folder","mp3" || ".mp3" || "mp3_file.mp3") //PathItem
      - tree.items = [a_folder,mp3_file] // [...PathItem]
      - tree.items[0].items = [...a_folder_items] // [...PathItem]
      - tree.items[0].content = [...a_folder_items] //gets .items if folder
      - tree.items[1].items = [] //its a file
      - tree.items[1].content = a ready-to-use Base64 uri of mp3_file.mp3
      
   - tree = fxy.tree("folder","js")
        - tree.items.only = [...js_files_only] //searches inner folders
        
   - hidden shit like ".DS_Store" are skipped
        - want them? use: fxy.tree("folder",true,...extension_name_or_file_name_to_filter)   
   
      
└─────────┴───────┴──────────────┴──────────┴──────────┴────────┘
`
```

fs
-------------
```js
const fxy = require('fxy')

fxy.readFile('file.txt')
   .then(data=>console.log(data))
   .catch(error=>console.error(error))


//fs cheat sheet
FS = `
┌─────────┬───────┬───────────────────┬──────────┬──────────┬────────┐
│ (index) │ owner │ property          │ type     │ promised │ unique │
├─────────┼───────┼───────────────────┼──────────┼──────────┼────────┤
│ 0       │ fs    │ F_OK              │ number   │ false    │ true   │
├─────────┼───────┼───────────────────┼──────────┼──────────┼────────┤
│ 1       │ fs    │ FileReadStream    │ promise  │ true     │ true   │
├─────────┼───────┼───────────────────┼──────────┼──────────┼────────┤
│ 2       │ fs    │ FileWriteStream   │ promise  │ true     │ true   │
├─────────┼───────┼───────────────────┼──────────┼──────────┼────────┤
│ 3       │ fs    │ R_OK              │ number   │ false    │ true   │
├─────────┼───────┼───────────────────┼──────────┼──────────┼────────┤
│ 4       │ fs    │ ReadStream        │ class    │ false    │ true   │
├─────────┼───────┼───────────────────┼──────────┼──────────┼────────┤
│ 5       │ fs    │ Stats             │ class    │ false    │ true   │
├─────────┼───────┼───────────────────┼──────────┼──────────┼────────┤
│ 6       │ fs    │ SyncWriteStream   │ class    │ false    │ true   │
├─────────┼───────┼───────────────────┼──────────┼──────────┼────────┤
│ 7       │ fs    │ W_OK              │ number   │ false    │ true   │
├─────────┼───────┼───────────────────┼──────────┼──────────┼────────┤
│ 8       │ fs    │ WriteStream       │ class    │ false    │ true   │
├─────────┼───────┼───────────────────┼──────────┼──────────┼────────┤
│ 9       │ fs    │ X_OK              │ number   │ false    │ true   │
├─────────┼───────┼───────────────────┼──────────┼──────────┼────────┤
│ 10      │ fs    │ _toUnixTimestamp  │ function │ false    │ true   │
├─────────┼───────┼───────────────────┼──────────┼──────────┼────────┤
│ 11      │ fs    │ access            │ promise  │ true     │ true   │
├─────────┼───────┼───────────────────┼──────────┼──────────┼────────┤
│ 12      │ fs    │ accessSync        │ function │ false    │ true   │
├─────────┼───────┼───────────────────┼──────────┼──────────┼────────┤
│ 13      │ fs    │ appendFile        │ promise  │ true     │ true   │
├─────────┼───────┼───────────────────┼──────────┼──────────┼────────┤
│ 14      │ fs    │ appendFileSync    │ function │ false    │ true   │
├─────────┼───────┼───────────────────┼──────────┼──────────┼────────┤
│ 15      │ fs    │ chmod             │ promise  │ true     │ true   │
├─────────┼───────┼───────────────────┼──────────┼──────────┼────────┤
│ 16      │ fs    │ chmodSync         │ function │ false    │ true   │
├─────────┼───────┼───────────────────┼──────────┼──────────┼────────┤
│ 17      │ fs    │ chown             │ promise  │ true     │ true   │
├─────────┼───────┼───────────────────┼──────────┼──────────┼────────┤
│ 18      │ fs    │ chownSync         │ function │ false    │ true   │
├─────────┼───────┼───────────────────┼──────────┼──────────┼────────┤
│ 19      │ fs    │ close             │ promise  │ true     │ true   │
├─────────┼───────┼───────────────────┼──────────┼──────────┼────────┤
│ 20      │ fs    │ closeSync         │ function │ false    │ true   │
├─────────┼───────┼───────────────────┼──────────┼──────────┼────────┤
│ 21      │ fs    │ constants         │ object   │ false    │ true   │
├─────────┼───────┼───────────────────┼──────────┼──────────┼────────┤
│ 22      │ fs    │ createReadStream  │ promise  │ true     │ true   │
├─────────┼───────┼───────────────────┼──────────┼──────────┼────────┤
│ 23      │ fs    │ createWriteStream │ promise  │ true     │ true   │
├─────────┼───────┼───────────────────┼──────────┼──────────┼────────┤
│ 24      │ fs    │ exists            │ function │ false    │ true   │
├─────────┼───────┼───────────────────┼──────────┼──────────┼────────┤
│ 25      │ fs    │ existsSync        │ function │ false    │ true   │
├─────────┼───────┼───────────────────┼──────────┼──────────┼────────┤
│ 26      │ fs    │ fchmod            │ promise  │ true     │ true   │
├─────────┼───────┼───────────────────┼──────────┼──────────┼────────┤
│ 27      │ fs    │ fchmodSync        │ function │ false    │ true   │
├─────────┼───────┼───────────────────┼──────────┼──────────┼────────┤
│ 28      │ fs    │ fchown            │ promise  │ true     │ true   │
├─────────┼───────┼───────────────────┼──────────┼──────────┼────────┤
│ 29      │ fs    │ fchownSync        │ function │ false    │ true   │
├─────────┼───────┼───────────────────┼──────────┼──────────┼────────┤
│ 30      │ fs    │ fdatasync         │ promise  │ true     │ true   │
├─────────┼───────┼───────────────────┼──────────┼──────────┼────────┤
│ 31      │ fs    │ fdatasyncSync     │ function │ false    │ true   │
├─────────┼───────┼───────────────────┼──────────┼──────────┼────────┤
│ 32      │ fs    │ fstat             │ promise  │ true     │ true   │
├─────────┼───────┼───────────────────┼──────────┼──────────┼────────┤
│ 33      │ fs    │ fstatSync         │ function │ false    │ true   │
├─────────┼───────┼───────────────────┼──────────┼──────────┼────────┤
│ 34      │ fs    │ fsync             │ promise  │ true     │ true   │
├─────────┼───────┼───────────────────┼──────────┼──────────┼────────┤
│ 35      │ fs    │ fsyncSync         │ function │ false    │ true   │
├─────────┼───────┼───────────────────┼──────────┼──────────┼────────┤
│ 36      │ fs    │ ftruncate         │ promise  │ true     │ true   │
├─────────┼───────┼───────────────────┼──────────┼──────────┼────────┤
│ 37      │ fs    │ ftruncateSync     │ function │ false    │ true   │
├─────────┼───────┼───────────────────┼──────────┼──────────┼────────┤
│ 38      │ fs    │ futimes           │ promise  │ true     │ true   │
├─────────┼───────┼───────────────────┼──────────┼──────────┼────────┤
│ 39      │ fs    │ futimesSync       │ function │ false    │ true   │
├─────────┼───────┼───────────────────┼──────────┼──────────┼────────┤
│ 40      │ fs    │ lchmod            │ promise  │ true     │ true   │
├─────────┼───────┼───────────────────┼──────────┼──────────┼────────┤
│ 41      │ fs    │ lchmodSync        │ function │ false    │ true   │
├─────────┼───────┼───────────────────┼──────────┼──────────┼────────┤
│ 42      │ fs    │ lchown            │ promise  │ true     │ true   │
├─────────┼───────┼───────────────────┼──────────┼──────────┼────────┤
│ 43      │ fs    │ lchownSync        │ function │ false    │ true   │
├─────────┼───────┼───────────────────┼──────────┼──────────┼────────┤
│ 44      │ fs    │ link              │ promise  │ true     │ true   │
├─────────┼───────┼───────────────────┼──────────┼──────────┼────────┤
│ 45      │ fs    │ linkSync          │ function │ false    │ true   │
├─────────┼───────┼───────────────────┼──────────┼──────────┼────────┤
│ 46      │ fs    │ lstat             │ promise  │ true     │ true   │
├─────────┼───────┼───────────────────┼──────────┼──────────┼────────┤
│ 47      │ fs    │ lstatSync         │ function │ false    │ true   │
├─────────┼───────┼───────────────────┼──────────┼──────────┼────────┤
│ 48      │ fs    │ mkdir             │ promise  │ true     │ true   │
├─────────┼───────┼───────────────────┼──────────┼──────────┼────────┤
│ 49      │ fs    │ mkdirSync         │ function │ false    │ true   │
├─────────┼───────┼───────────────────┼──────────┼──────────┼────────┤
│ 50      │ fs    │ mkdtemp           │ promise  │ true     │ true   │
├─────────┼───────┼───────────────────┼──────────┼──────────┼────────┤
│ 51      │ fs    │ mkdtempSync       │ function │ false    │ true   │
├─────────┼───────┼───────────────────┼──────────┼──────────┼────────┤
│ 52      │ fs    │ open              │ promise  │ true     │ true   │
├─────────┼───────┼───────────────────┼──────────┼──────────┼────────┤
│ 53      │ fs    │ openSync          │ function │ false    │ true   │
├─────────┼───────┼───────────────────┼──────────┼──────────┼────────┤
│ 54      │ fs    │ read              │ promise  │ true     │ true   │
├─────────┼───────┼───────────────────┼──────────┼──────────┼────────┤
│ 55      │ fs    │ readFile          │ promise  │ true     │ true   │
├─────────┼───────┼───────────────────┼──────────┼──────────┼────────┤
│ 56      │ fs    │ readFileSync      │ function │ false    │ true   │
├─────────┼───────┼───────────────────┼──────────┼──────────┼────────┤
│ 57      │ fs    │ readSync          │ function │ false    │ true   │
├─────────┼───────┼───────────────────┼──────────┼──────────┼────────┤
│ 58      │ fs    │ readdir           │ promise  │ true     │ true   │
├─────────┼───────┼───────────────────┼──────────┼──────────┼────────┤
│ 59      │ fs    │ readdirSync       │ function │ false    │ true   │
├─────────┼───────┼───────────────────┼──────────┼──────────┼────────┤
│ 60      │ fs    │ readlink          │ promise  │ true     │ true   │
├─────────┼───────┼───────────────────┼──────────┼──────────┼────────┤
│ 61      │ fs    │ readlinkSync      │ function │ false    │ true   │
├─────────┼───────┼───────────────────┼──────────┼──────────┼────────┤
│ 62      │ fs    │ realpath          │ promise  │ true     │ true   │
├─────────┼───────┼───────────────────┼──────────┼──────────┼────────┤
│ 63      │ fs    │ realpathSync      │ function │ false    │ true   │
├─────────┼───────┼───────────────────┼──────────┼──────────┼────────┤
│ 64      │ fs    │ rename            │ promise  │ true     │ true   │
├─────────┼───────┼───────────────────┼──────────┼──────────┼────────┤
│ 65      │ fs    │ renameSync        │ function │ false    │ true   │
├─────────┼───────┼───────────────────┼──────────┼──────────┼────────┤
│ 66      │ fs    │ rmdir             │ promise  │ true     │ true   │
├─────────┼───────┼───────────────────┼──────────┼──────────┼────────┤
│ 67      │ fs    │ rmdirSync         │ function │ false    │ true   │
├─────────┼───────┼───────────────────┼──────────┼──────────┼────────┤
│ 68      │ fs    │ stat              │ promise  │ true     │ true   │
├─────────┼───────┼───────────────────┼──────────┼──────────┼────────┤
│ 69      │ fs    │ statSync          │ function │ false    │ true   │
├─────────┼───────┼───────────────────┼──────────┼──────────┼────────┤
│ 70      │ fs    │ symlink           │ promise  │ true     │ true   │
├─────────┼───────┼───────────────────┼──────────┼──────────┼────────┤
│ 71      │ fs    │ symlinkSync       │ function │ false    │ true   │
├─────────┼───────┼───────────────────┼──────────┼──────────┼────────┤
│ 72      │ fs    │ truncate          │ promise  │ true     │ true   │
├─────────┼───────┼───────────────────┼──────────┼──────────┼────────┤
│ 73      │ fs    │ truncateSync      │ function │ false    │ true   │
├─────────┼───────┼───────────────────┼──────────┼──────────┼────────┤
│ 74      │ fs    │ unlink            │ promise  │ true     │ true   │
├─────────┼───────┼───────────────────┼──────────┼──────────┼────────┤
│ 75      │ fs    │ unlinkSync        │ function │ false    │ true   │
├─────────┼───────┼───────────────────┼──────────┼──────────┼────────┤
│ 76      │ fs    │ unwatchFile       │ promise  │ true     │ true   │
├─────────┼───────┼───────────────────┼──────────┼──────────┼────────┤
│ 77      │ fs    │ utimes            │ promise  │ true     │ true   │
├─────────┼───────┼───────────────────┼──────────┼──────────┼────────┤
│ 78      │ fs    │ utimesSync        │ function │ false    │ true   │
├─────────┼───────┼───────────────────┼──────────┼──────────┼────────┤
│ 79      │ fs    │ watch             │ promise  │ true     │ true   │
├─────────┼───────┼───────────────────┼──────────┼──────────┼────────┤
│ 80      │ fs    │ watchFile         │ promise  │ true     │ true   │
├─────────┼───────┼───────────────────┼──────────┼──────────┼────────┤
│ 81      │ fs    │ write             │ promise  │ true     │ true   │
├─────────┼───────┼───────────────────┼──────────┼──────────┼────────┤
│ 82      │ fs    │ writeFile         │ promise  │ true     │ true   │
├─────────┼───────┼───────────────────┼──────────┼──────────┼────────┤
│ 83      │ fs    │ writeFileSync     │ function │ false    │ true   │
├─────────┼───────┼───────────────────┼──────────┼──────────┼────────┤
│ 84      │ fs    │ writeSync         │ function │ false    │ true   │
└─────────┴───────┴───────────────────┴──────────┴──────────┴────────┘`
```


path
-------------
```js
const fxy = require('fxy')
fxy.join(__dirname,'a','b','c') // = current/directory/a/b/c


//path cheat sheet
PATH = `
┌─────────┬───────┬────────────┬──────────┬──────────┬────────┐
│ (index) │ owner │ property   │ type     │ promised │ unique │
├─────────┼───────┼────────────┼──────────┼──────────┼────────┤
│ 0       │ path  │ _makeLong  │ function │ false    │ true   │
├─────────┼───────┼────────────┼──────────┼──────────┼────────┤
│ 1       │ path  │ basename   │ function │ false    │ true   │
├─────────┼───────┼────────────┼──────────┼──────────┼────────┤
│ 2       │ path  │ delimiter  │ string   │ false    │ true   │
├─────────┼───────┼────────────┼──────────┼──────────┼────────┤
│ 3       │ path  │ dirname    │ function │ false    │ true   │
├─────────┼───────┼────────────┼──────────┼──────────┼────────┤
│ 4       │ path  │ extname    │ function │ false    │ true   │
├─────────┼───────┼────────────┼──────────┼──────────┼────────┤
│ 5       │ path  │ format     │ function │ false    │ true   │
├─────────┼───────┼────────────┼──────────┼──────────┼────────┤
│ 6       │ path  │ isAbsolute │ function │ false    │ true   │
├─────────┼───────┼────────────┼──────────┼──────────┼────────┤
│ 7       │ path  │ join       │ function │ false    │ true   │
├─────────┼───────┼────────────┼──────────┼──────────┼────────┤
│ 8       │ path  │ normalize  │ function │ false    │ true   │
├─────────┼───────┼────────────┼──────────┼──────────┼────────┤
│ 9       │ path  │ parse      │ function │ false    │ true   │
├─────────┼───────┼────────────┼──────────┼──────────┼────────┤
│ 10      │ path  │ posix      │ object   │ false    │ true   │
├─────────┼───────┼────────────┼──────────┼──────────┼────────┤
│ 11      │ path  │ relative   │ function │ false    │ true   │
├─────────┼───────┼────────────┼──────────┼──────────┼────────┤
│ 12      │ path  │ resolve    │ function │ false    │ true   │
├─────────┼───────┼────────────┼──────────┼──────────┼────────┤
│ 13      │ path  │ sep        │ string   │ false    │ true   │
├─────────┼───────┼────────────┼──────────┼──────────┼────────┤
│ 14      │ path  │ win32      │ object   │ false    │ true   │
└─────────┴───────┴────────────┴──────────┴──────────┴────────┘`
```