var express = require('express')
var request = require('request')

// setup middleware
var app = express()
app.use(express.bodyParser())
app.use(app.router)
app.use(express.errorHandler())
app.use(express.static(__dirname + '/public')) //setup static public directory
app.set('view engine', 'jade')
app.set('views', __dirname + '/views') //optional since express defaults to CWD/views

// yelp shit
var consumer_key = 'nMttGA-pdyXSk20Ady60NQ'
var consumer_secret = '47R_D2JGjK20j1qmlNyNRRsGWm8'
var token = '9O7nuodRovArOdoJwOESz9O4BL4xaX2m'
var token_secret = 'M0fk8as_3vsanFkMxeTEf8FpduE'
// yelp request url shit
var yelp_url = 'http://api.yelp.com'

var oauth = {
	consumer_key: consumer_key,
	consumer_secret: consumer_secret,
	token: token,
	token_secret: token_secret
}

// render index page
app.get('/', function(req, res){
	res.render('index')
})

app.post('/testapi', function(req, res) {
	var town = req.body.location
	var search_path = '/v2/search'
	var url = yelp_url + search_path + '?term=food&location=' + req.body.location
	request.get({url:url, oauth:oauth, json:true}, function(error, response, body) {
		var businesses = body.businesses
		var info = []
		for (var i = 0; i < businesses.length; i++) {
			info[i] = {
									business_name: businesses[i].name,
			 					 	phone: businesses[i].phone,
								 	deals: businesses[i].deals,
									location: businesses[i].location
								}
		}
		res.end(JSON.stringify(body));
	})
})

app.listen(process.env.PORT || 3000)
