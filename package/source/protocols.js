const types = ['http', 'ws', 'ftp']
const secure = ['https', 'wss', 'sftp']

//exports
module.exports.list = get_protocol_list
module.exports.list.formatted = get_protocol_list_formatted
module.exports.types = types
module.exports.secure = secure

//scope actions
function get_protocol_list(){ return types.concat(secure) }
function get_protocol_list_formatted(){
	return get_protocol_list().map(get_protocol)
	//scope actions
	function get_protocol(protocol){ return `${protocol}://`}
}
