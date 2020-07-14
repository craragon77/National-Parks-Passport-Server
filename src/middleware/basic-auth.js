const bcrypt = require('bcryptjs');
const AuthService = require('../Service-Repo/AuthService');

function requireAuth(req, res, next){
    console.log('requireAuth')
    console.log(req.get('Authorization'))

    const authToken = req.get('Authorization') || ''
    //console.log(authToken)
    let basicToken
    if(!authToken.toLowerCase().startsWith('basic ')){
        return res.status(401).json({
            error: 'Missing basic token (this is the error on line 10 or whatever of basicAuth file)'
        })
    } else {
        basicToken = authToken.slice('basic '.length, authToken.length)
        console.log(basicToken)
    }

    const [tokenUserName, tokenPassword] = Buffer
        .from(basicToken, 'base64')
        .toString()
        .split(':')

        console.log(tokenUserName, tokenPassword)
    if(!tokenUserName || !tokenPassword){
        console.log('the first if statement activated!')
        //console.log(tokenUserName, tokenPassword)
        return res.status(401).json({
            error: 'Unauthorized request (but this is the no token username or password)'
        })
    }
    //console.log(req.app.get('db')('users').where({username: tokenUserName}).first())
    AuthService.getUserWithUserName(req.app.get('db'), tokenUserName)
        .then(username => {
            //console.log(user)
            if(!username){
                //console.log('the second if statement activated!')
                return res.status(401).json({
                    error: 'Unauthorized request (but this is the req.get.app one #theSecondOne)'
                })
            }

        return AuthService.comparePasswords(tokenPassword, username.password)
            .then(passwordsMatch => {
                if(!passwordsMatch){
                    return res.status(401).json({
                        error: `Unauthorized request (from the bcrypt compare thingy)`
                    })
                }
                //replacing req with res did not help much either unfortunately
                req.username = username
                next()
            })
        
        })
        .catch(next)
}

module.exports = {
    requireAuth
}