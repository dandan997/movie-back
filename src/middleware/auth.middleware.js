//token相关
const fs = require('fs')
const jwt = require('jsonwebtoken')

const PRIVATE_KEY =fs.readFileSync('./src/app/keys/private.key')
const PUBLIC_KEY = fs.readFileSync('./src/app/keys/public.key')

//登录发送token
const login = async (ctx, next) => {
    const { name,id } = ctx.user
        // console.log(PRIVATE_KEY)
        const token = jwt.sign({id,name},PRIVATE_KEY,{
            expiresIn:60*60*24*30,
            algorithm:'RS256'
        })

        ctx.body = {id,name,token}
        next()
}
//验证token
const authVerify = async (ctx,next)=>{
    //获取token
    const authorization = ctx.headers.authorization
    // console.log(authorization)
    if(authorization==undefined){
        return ctx.app.emit('error',new Error('请先登录！'),ctx)
    }
    const token = authorization.replace('Bearer ','')
    //验证token
    try {
        const result = jwt.verify(token,PUBLIC_KEY,{
            algorithms:['RS256']
        })
        ctx.user = result
        console.log('token验证成功')
        // console.log(result)
        await next()
    } catch (err) {
        const error = new Error('token验证失败')
        ctx.app.emit('error',error,ctx)
    }
}


module.exports = {login,authVerify}