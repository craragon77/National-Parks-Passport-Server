function requireAuth(req, res, next){
    return res.status(401).json({
        error: 'missing bearer token, son!'
    })
    next()
}

module.exports = {
    requireAuth
}