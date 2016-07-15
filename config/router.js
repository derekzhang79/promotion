
var Index = require('../app/controllers/index')
var User = require('../app/controllers/user')
var Media = require('../app/controllers/media')
var Comment = require('../app/controllers/comment')
var Category = require('../app/controllers/category')

module.exports = function (app) {
  //pre handle user 
  app.use(function (req, res, next) {
    var _user = req.session.user 
    app.locals.user = _user
    console.log(_user)
    next()
  })

  /*首页*/
  //index page
  app.get('/', Index.index)
  app.get('/results', Index.search)

  /*促销相关内容*/
  //detail page
  app.get('/media/:id', Media.detail)
  //admin page
  app.get('/admin/media/new', User.loginRequired, User.adminRequired, Media.new)
  //admin update media
  app.get('/admin/media/update/:id', User.loginRequired, User.adminRequired, Media.update)
  //list page 
  app.get('/admin/media/list', User.loginRequired, User.adminRequired, Media.list)
  // admin post media
  app.post('/admin/media', User.loginRequired, User.adminRequired, Media.saveFile, Media.save)
  //list delete media
  app.delete('/admin/media', User.loginRequired, User.adminRequired, Media.delete)

  /*用户*/
  //post regist page
  app.post('/user/regist', User.regist)
  //post login page
  app.post('/user/login', User.login)
  //get regist page
  app.get('/regist', User.showRegist)
  //get login page
  app.get('/login', User.showLogin)
  //logout page 
  app.get('/logout', User.logout)
  //userlist page 
  app.get('/admin/user/list', User.loginRequired, User.adminRequired, User.list)
  app.get('/admin/user/:id', User.loginRequired, User.adminRequired, User.showUpdate)
  app.post('/admin/user/update', User.loginRequired, User.adminRequired, User.update)
  app.delete('/admin/user', User.loginRequired, User.adminRequired, User.delete)

  /*评论*/
  app.post('/user/comment', User.loginRequired, Comment.save)

  /*分类*/
  app.get('/admin/category/new', User.loginRequired, User.adminRequired, Category.new)
  app.post('/admin/category', User.loginRequired, User.adminRequired, Category.save)
  app.get('/admin/category/list', User.loginRequired, User.adminRequired, Category.list)
  app.get('/admin/category/medias', User.loginRequired, User.adminRequired, Category.list)
  app.get('/admin/category/showUpdate/:id', User.loginRequired, User.adminRequired, Category.showUpdate)
  app.post('/admin/updateCategory/:id', User.loginRequired, User.adminRequired, Category.update)
  app.delete('/admin/category', User.loginRequired, User.adminRequired, Category.delete)
}
