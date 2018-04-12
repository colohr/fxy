const fxy = require('../package/index')
class AClass{
	constructor(){
		this.name = 'A Class'
	}
	get hello(){ return 'hi' }
}

class AnArrayClass extends Array{}

const an_array_instance = new AClass('one','two','three')
const a_class_instance = new AnArrayClass()

const values = ['', null, an_action, AClass, an_async_action, a_class_instance, an_array_instance]

const test = {
	action: true,
	class: true,
	async: true,
	has: true,
	in:['hello','name',null],
	not:['hello','name',null,0]
}

for(const name in test){
	console.log('\n------------')
	console.log(`Test: "${name}"`)

	const inputs = test[name] === true ? null:test[name]
	for(const i of values){
		let result = new Map([ ['value', i] ])

		if(inputs){
			for(const input of inputs){
				result.set('input', input)
				result.set('result', fxy.is[name](i, input))
				console.dir(result, {colors: true})
			}
		}
		else {
			result.set('result', fxy.is[name](i))
			console.dir(result, {colors: true})
		}
	}

	console.log('------------\n')
}

//shared actions
function an_action(){}
async function an_async_action(){}