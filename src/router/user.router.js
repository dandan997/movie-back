const Router = require('koa-router')

const {create,verifyUser,handlePassword,loginVerify,} = require('../middleware/middleware')
const {login,authVerify,getUserInfo} = require('../middleware/auth.middleware')

const userRouter = new Router({prefix:'/user'})

//用户注册
userRouter.post('/',verifyUser,handlePassword,create)
//用户登录
userRouter.post('/login',loginVerify,login)
// //验证登录
// userRouter.post('/test',authVerify)
//验证token
userRouter.post('/getUserInfo',authVerify,getUserInfo)

module.exports = userRouter