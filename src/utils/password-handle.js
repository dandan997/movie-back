const cyrpto = require('crypto')
//加密密码
const md5password = (password)=>{
	const md5 = cyrpto.createHash('md5')
	const result = md5.update(password).digest('hex')
	return result
}

module.exports = {md5password}