module.exports = function(req, res, next){
    if(req.session.user && req.session.user.user_level === 1){
       return  next()
    }
    return res.redirect("/home")
}