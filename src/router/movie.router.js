const Router = require('koa-router')
//引入中间件
const { getMovieList,addToTodo,addToDone,deleteMovieFromList,getTodoList,getDoneList } = require('../middleware/middleware')
const {authVerify} = require('../middleware/auth.middleware')

const movieRouter = new Router({prefix:'/movie'})

//获取完整首页使用的完整list 先判断是否登录，如果登录则同时返回list状态
movieRouter.get('/list',getMovieList)
//增加待看的电影
movieRouter.post('/todo/:id',authVerify,addToTodo)
//增加已看的电影
movieRouter.post('/done/:id',authVerify,addToDone)
//删除列表中的电影
movieRouter.delete('/:id',authVerify,deleteMovieFromList)
//查询待看列表
movieRouter.get('/todo',authVerify,getTodoList)
//查询待看列表
movieRouter.get('/done',authVerify,getDoneList)

module.exports = movieRouter