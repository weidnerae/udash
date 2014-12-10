var express  = require('express')
var request  = require('request')
var config   = require('./config.json')
var nano     = require('nano')('http://localhost:5984')

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

// yelp request url shit
var yelp_url = 'http://api.yelp.com'
// yelp oauth shit
var oauth = {
	consumer_key: config.consumer_key,
	consumer_secret: config.consumer_secret,
	token: config.token,
	token_secret: config.token_secret
}

// app specific data structures
var deals = [];
var bizs = [];

// render index page
app.get('/', function(req, res){
	res.render('index')
})

app.get('/eat', function(req, res) {
	var town = "boone, nc"
	var search_path = '/v2/search'
	var url = yelp_url + search_path + '?term=food&location=' + town

	request.get({url:url, oauth:oauth, json:true}, function(error, response, body) {
		var businesses = body.businesses
		var restaurants = []
		for (var i = 0; i < businesses.length; i++) {
			restaurants[i] = { name: businesses[i].name, location: businesses[i].location.display_address, avatar: "/images/avatar-01.svg" };
			console.log(JSON.stringify(restaurants[i]))
		}

		res.json(restaurants)
	})
})

app.get('/drink', function(req, res) {
	var town = "boone, nc"
	var search_path = '/v2/search'
	var url = yelp_url + search_path + '?term=food&location=' + town

	request.get({url:url, oauth:oauth, json:true}, function(error, response, body) {
		var businesses = body.businesses
		var rest = []
		var r_locations = []
		for (var i = 0; i < businesses.length; i++) {
			rest[i] = businesses[i].name
			r_locations[i] = businesses[i].location.display_address
			console.log(JSON.stringify(businesses[i].categories))
		}

		res.json({rest: rest, r_locations: r_locations})
	})
})

app.get('/deals', function(req, res) {
	deals = [];
	Cloudant({account: me, password: password}, function(error, cloudant) {
		var db = cloudant.db.use('deals')
		db.list({ include_docs: true }, function (err, body) {
			body.rows.forEach(function (element) {
				deals.push(element.doc)
			})
			console.log("deals grabbed from db: " + deals.length)
			res.json(deals)
		})
	})
})

app.get('/deals2', function(req, res) {
	deals = [];
	var db = nano.db.use('deals')
	db.list({ include_docs: true}, function (err, body) {
		body.rows.forEach(function (element) {
			deals.push(element.doc)
		})
		console.log("deals grabbed from db: " + deals.length)
		res.json(deals)
	})
	// Cloudant({account: me, password: password}, function(error, cloudant) {
	// 	var db = cloudant.db.use('deals2')
	// 	db.list({ include_docs: true }, function (err, body) {
	// 		body.rows.forEach(function (element) {
	// 			deals.push(element.doc)
	// 		})
	// 		console.log("deals grabbed from db: " + deals.length)
	// 		res.json(deals)
	// 	})
	// })
})

app.get('/bizs', function(req, res) {
	bizs = [];
	Cloudant({account: me, password: password}, function(error, cloudant) {
		var db = cloudant.db.use('bizs')
		db.list({ include_docs: true}, function (err, body) {
			body.rows.forEach(function (element) {
				bizs.push(element.doc)
			})
			console.log("bizs grabbed from db: " + bizs.length)

			res.json(bizs)
		})
	})
})

app.listen(process.env.PORT || 80)
