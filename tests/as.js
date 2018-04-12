const fxy = require('../package/index')
const date = new Date()
class Something{
	get other(){ return fxy.as.action(async_action) }
	inner_call(){ return action_returning_promise(this) }
}
const something = new Something()

test().then(results=>{
	//console.dir(results,{colors:true})
	const o = fxy.as.object(results)
	console.dir(o, {colors: true})
	console.dir(fxy.as.map(o), {colors: true})
})
//load
async function test(){
	const results = new Map()
	try{
		console.dir(fxy.as,{colors:true})

		results.set('data as a data', fxy.as.a({data: true}, 'data', {one: 10}, {two: 2}, {one: 1, three: 3}))
		results.set('data as a array', fxy.as.a([{array: true}], 'array', {one: 10}, [{two: 2}, {one: 1, three: 3}]))
		results.set('as set', fxy.as.set(1, 5, 3, 3, [2, 4, 0, 23, 5, 2, 4, 5], [5, 6, 7], [1]))
		results.set('action as async', await fxy.as.async(action)())
		const other = await something.other()
		results.set('something as map', fxy.as.map(fxy.as.one(something, {one:1})))
		results.set('something.inner_call as action', await fxy.as.action(something, 'inner_call')())
		results.set('as text', fxy.as.text(other))
		results.set('as date gibberish', fxy.as.date('aidfpioansd'))
		results.set('as date from number', fxy.as.date(new Date().getTime()))
		results.set('as date from text', fxy.as.date(date+''))



	}catch(e){
		console.error(e)
	}
	return results
}

//shared actions
async function async_action(message){
	return await action_returning_promise(message)
}

function action(){
	return 'hello'
}

function action_returning_promise(value){
	return new Promise((success,error)=>{
		return process.nextTick(()=>{
			if(value) return success(value)
			return fxy.json.read(fxy.join(__dirname,'../package.json')).then(success).catch(error)
		})
	})
}