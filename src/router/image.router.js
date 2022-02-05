const Router = require('koa-router')
//引入中间件
const { getImage } = require('../middleware/middleware')

const imageRouter = new Router({prefix:'/poster'})

//获取电影海报
imageRouter.get('/:name',getImage)

module.exports = imageRouter