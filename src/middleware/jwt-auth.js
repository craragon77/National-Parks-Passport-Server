const AuthService = require('../Service-Repo/AuthService');

function jwtAuth(req, res, next){
    const authToken = req.get('Authorization' || '')
    console.log(authToken)
    let bearerToken
    if(authToken == null || !authToken.toLowerCase().startsWith('bearer ')){
       return res.status(401).json({
            error: 'missing bearer token, son! (but like, this is coming from the jwt-auth header thingy or whatever)'
        })
    } else {
        bearerToken = authToken.slice(7, authToken.length)
    }

    try {
        const payload = AuthService.verfiyJwt(bearerToken)

        AuthService.getUserWithUserName(req.app.get('db'), payload.sub)
        .then(user => {
            //for some reason, this line is the source of the headers error that I am getting :(
            if (!user)
                return res.status(401).json({
                    error: 'Unauthorized request (but from the database check or whatever'
                })
                //but adding return here helped. Is this the fix?
        return req.user = user
        next()
        })
        .catch(error => {
            console.log(error)
            next(error)
        })
    } 
    
    catch(error){
        return res.status(401).json({
            error: `Unauthorized request (but like this is the bottom one)`
        })
    }
    
    next()
}

module.exports = {
    jwtAuth
}