//中间件
//引入
const { md5password } = require('../utils/password-handle')
const fs = require('fs')
const connection = require('../app/database')

//获取海报图片
const getImage = (ctx, next) => {
    const { name } = ctx.request.params
    ctx.response.set('content-type', 'image/jpeg')
    ctx.body = fs.createReadStream(`./static/poster/${name}.jpg`)
}
//获取首页列表信息
const getMovieList = async (ctx, next) => {
    const statement = 'SELECT id,name,doubanRating,year,country,genre,slogan,poster FROM moviedetail'
    const result = await connection.execute(statement, [])
    ctx.body = result[0]
}
//验证密码用户名是否为空以及是否有重复用户名
const verifyUser = async (ctx, next) => {
    const { password, name } = ctx.request.body

    //判断密码用户名都不为空
    if (!name || !password) {
        const error = new Error('用户名或密码不可为空！')
        return ctx.app.emit('error', error, ctx)
    }

    //判断没有重复的用户名
    const statement = `SELECT * FROM users WHERE name = ?;`
    const result = await connection.execute(statement, [name])
    // console.log(result[0].length)
    // @ts-ignore
    if (result[0].length) {
        const error = new Error('用户名已存在！')
        return ctx.app.emit('error', error, ctx)
    }
    await next()
}
//加密密码并存入
const handlePassword = async (ctx, next) => {
    let { password } = ctx.request.body
    password = md5password(password)
    ctx.request.body.password = password
    // console.log(password)
    await next()
}
//创建用户
const create = async (ctx, next) => {
    const { name, password } = ctx.request.body
    // console.log(name, password)
    const statement = `INSERT INTO users (name,password) VALUES(?,?);`
    const result = await connection.execute(statement, [name, password])
    ctx.response.body = '用户创建成功'
    console.log('创建用户成功')
}
//验证密码用户名是否正确
const loginVerify = async (ctx, next) => {
    const { name, password } = ctx.request.body
    //判断用户名密码是否为空
    if (!name || !password) {
        const error = new Error('用户名或密码不可为空！')
        return ctx.app.emit('error', error, ctx)
    }
    //判断用户名是否存在
    const statement = `SELECT * FROM users WHERE name = ?;`
    const result = await connection.execute(statement, [name])
    const user = result[0][0]
    // @ts-ignore
    if (result[0].length == 0) {
        const error = new Error('用户名不存在！')
        return ctx.app.emit('error', error, ctx)
    }
    //判断密码是否正确
    if (result[0][0].password == md5password(password)) {
        ctx.user = user
        return await next()
    } else {
        const error = new Error('密码错误！')
        return ctx.app.emit('error', error, ctx)
    }
}
//增加电影到待看list
const addToTodo = async (ctx, next) => {
    const user_id = ctx.user.id
    const movie_id = ctx.request.params.id
    // console.log(user_id, movie_id)
    try {
        const statement = 'INSERT INTO umr (user_id,movie_id,type) VALUES(?,?,"todo")'
        const result = await connection.execute(statement, [user_id, movie_id])
        ctx.body = result
    } catch (error) {
        console.log(error)
    }

}
//增加电影到已看list
const addToDone = async(ctx,next)=>{
    const user_id = ctx.user.id
    const movie_id = ctx.request.params.id
    //先判断此电影是否是待看状态
    const statement = 'select * from umr where user_id=? and movie_id=?'
    const result = await connection.execute(statement,[user_id,movie_id])
    if(result[0].length == 0){
        const statement = 'INSERT INTO umr (user_id,movie_id,type) VALUES(?,?,"done")'
        const result = await connection.execute(statement, [user_id, movie_id])
        ctx.body = result
    }else{
        const statement = 'UPDATE umr SET type="done" where user_id=? and movie_id=?'
        const result = await connection.execute(statement, [user_id, movie_id])
        ctx.body = result
    }
}
//删除电影
const deleteMovieFromList = async(ctx,next)=>{
    const user_id = ctx.user.id
    const movie_id = ctx.request.params.id
    const statement = 'DELETE FROM umr where user_id=? and movie_id=?'
    const result = connection.execute(statement,[user_id,movie_id])

    ctx.body = result
}
//查询待看列表
const getTodoList = async(ctx,next)=>{
    const user_id = ctx.user.id
    const statement = "SELECT md.id,name,poster,doubanRating,year,country,genre,slogan FROM moviedetail md JOIN `umr` on md.id=umr.movie_id where type='todo' and user_id=?;"
    const result = await connection.execute(statement,[user_id])
    ctx.body = result[0]
}
const getDoneList = async(ctx,next)=>{
    const user_id = ctx.user.id
    const statement = "SELECT md.id,name,poster,doubanRating,year,country,genre,slogan FROM moviedetail md JOIN `umr` on md.id=umr.movie_id where type='done' and user_id=?;"
    const result = await connection.execute(statement,[user_id])
    ctx.body = result[0]
}
module.exports = { getImage, getMovieList, create, verifyUser, handlePassword, loginVerify, addToTodo,addToDone,deleteMovieFromList,getTodoList,getDoneList }