var express = require('express')
var port = process.env.PORT || 3000
var path = require('path')
var bodyParser = require('body-parser')
var mongoose = require('mongoose')
var cookieParser = require('cookie-parser')
var session = require('express-session')
var morgan = require('morgan')

var app = express()
var dbUrl = 'mongodb://localhost/promotion'

//connect to mongoDB
mongoose.connect(dbUrl)

app.set('views', path.join(__dirname, 'app/views/pages'))
app.set('view engine', 'jade')
app.use(cookieParser())


app.use(session({
 	secret: 'my cms',
 	resave: false,
 	saveUninitialized: false
}))

app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'public')))
app.locals.moment = require('moment')
app.listen(port)

//设置入口文件，输出日志和错误信息
if ('development' === app.get('env')) {
	app.set('showStackError', true)
	app.use(morgan(':method :url :status'))
	//格式化源代码
	app.locals.pretty =true 
	mongoose.set('debug', true)
}

//导出路由模块
require('./config/router')(app)

console.log('my-cms started on port' +　port)

