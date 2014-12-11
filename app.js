var express  = require('express')
var request  = require('request')
var config   = require('./config.json')
var nano     = require('nano')('http://localhost:5984')
var calendar = require('./calendar')

var oneDay   = 1000 * 60 * 60 * 24;

// setup middleware
// testing github crap
var app = express()
app.use(express.bodyParser())
app.use(app.router)
app.use(express.errorHandler())
app.use(express.static(__dirname + '/public', { maxAge: oneDay })) //setup static public directory
app.use(express.static(__dirname + '/bower_components', { maxAge: oneDay}))
app.set('view engine', 'jade')
app.set('views', __dirname + '/views') //optional since express defaults to CWD/views


// render index page
app.get('/', function(req, res){
	res.render('index')
})

app.get('/deals2', function(req, res) {
	var db = nano.db.use('deals')
	db.list({ include_docs: true}, function (err, body) {
		var deals = [];
		body.rows.forEach(function (element) {
			deals.push(element.doc)
		})
		console.log("deals grabbed from db: " + deals.length)
		res.json(deals)
	})
})

app.get('/bizs', function(req, res) {
	var db = nano.db.use('bizs')
	db.list({ include_docs: true}, function (err, body) {
		var bizs = [];
		body.rows.forEach(function (element) {
			bizs.push(element.doc)
		})
		console.log("bizs grabbed from db: " + bizs.length)
		res.json(bizs)
	})
})

app.get('/events', function(req, res) {
	calendar(function (err, body) {
		res.json(body)
	})
})

app.listen(80)
