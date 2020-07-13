const bcrypt = require('bcryptjs');
const AuthService = require('../Service-Repo/AuthService');

function requireAuth(req, res, next){
    console.log('requireAuth')
    console.log(req.get('Authorization'))

    const authToken = req.get('Authorization') || ''

    let basicToken
    if(!authToken.toLowerCase().startsWith('basic ')){
        return res.status(401).json({
            error: 'Missing basic token (this is the error on line 10 or whatever of basicAuth file)'
        })
    } else {
        basicToken = authToken.slice('basic '.length, authToken.length)
    }

    const [tokenUserName, tokenPassword] = Buffer
        .from(basicToken, 'base64')
        .toString()
        .split(':')

        console.log(tokenUserName, tokenPassword)
    if(!tokenUserName || !tokenPassword){
        console.log('the first if statement activated!')
        console.log(tokenUserName, tokenPassword)
        return res.status(401).json({
            error: 'Unauthorized request (but this is the no token username or password)'
        })
    }
    console.log(req.app.get('db')('users').where({username: tokenUserName}).first())
    req.app.get('db')('users')
        .where({
            username: tokenUserName
        })
        .first()
        
        .then(user => {
            console.log(user)
            if(!user){
                console.log('the second if statement activated!')
                return res.status(401).json({
                    error: 'Unauthorized request (but this is the req.get.app one #theSecondOne)'
                })
            }

        return AuthService.comparePasswords(tokenPassword, user.password)
            .then(passwordsMatch => {
                if(!passwordsMatch){
                    return res.status(401).json({
                        error: `Unauthorized request (from the bcrypt compare thingy)`
                    })
                }
                req.user = user
                next()
            })
        
        })
        .catch(next)
    
}

module.exports = {
    requireAuth
}