function requireAuth(req, res, next){
    console.log('requireAuth')
    console.log(req.get('Authorization'))

    const authToken = req.get('Authorization') || ''

    let basicToken
    if(!authToken.toLowerCase().startsWith('basic ')){
        return res.status(401).json({
            error: 'Missing basic token'
        })
    } else {
        basicToken = authToken.slice('basic '.length, authToken.length)
    }

    const [tokenUserName, tokenPassword] = Buffer
        .from(basicToken, 'base64')
        .toString()
        .split(':')

    if(!tokenUserName || !tokenPassword){
        console.log('the first if statement activated!')
        return res.status(401).json({
            error: 'Unauthorized request (but this is the no token username or password)'
        })
    }

    req.app.get('db')('users')
        .where({
            username: tokenUserName
        })
        .first()
        .then(user => {
            if(!user || user.password !== tokenPassword){
                console.log('the second if statement activated!')
                return res.status(401).json({
                    error: 'Unauthorized request (but this is the req.get.app one #theSecondOne)'
                })
            }
        next()
        })
        .catch(next)
    
}

module.exports = {
    requireAuth
}