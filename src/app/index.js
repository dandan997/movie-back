const Koa = require('koa')
const bodyParser = require('koa-bodyparser')

//引入路由
const imageRouter = require('../router/image.router')
const movieRouter = require('../router/movie.router')
const userRouter = require('../router/user.router')

const app = new Koa()

//处理请求中的json数据
app.use(bodyParser())
//路由
app.use(imageRouter.routes())
app.use(imageRouter.allowedMethods())
app.use(movieRouter.routes())
app.use(movieRouter.allowedMethods())
app.use(userRouter.routes())
app.use(userRouter.allowedMethods())

//处理错误
app.on('error',(error,ctx)=>{
    console.log(error.message)
    switch (error.message){
        case '用户名或密码不可为空！':
            ctx.status = 400
            ctx.body = error.message
            break;
        case '用户名已存在！':
            ctx.status = 409
            ctx.body = error.message
            break
        case '用户名不存在！':
            ctx.status = 400
            ctx.body = error.message
            break
        case '密码错误！':
            ctx.status = 400
            ctx.body = error.message
            break
        case 'token验证失败':
            ctx.status = 401
            ctx.body = error.message
            break
        case '没有权限！':
            ctx.status = 401
            ctx.body = error.message
            break
        case '请先登录！':
            ctx.status = 401
            ctx.body = error.message
            break
        default:
            ctx.status = 404
            ctx.body = '发生了错误！'
    }
})

module.exports = app