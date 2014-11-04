var express  = require('express')
var request  = require('request')
var Cloudant = require('cloudant')

// setup middleware
// testing github crap
var app = express()
app.use(express.bodyParser())
app.use(app.router)
app.use(express.errorHandler())
app.use(express.static(__dirname + '/public')) //setup static public directory
app.use(express.static(__dirname + '/bower_components'))
app.set('view engine', 'jade')
app.set('views', __dirname + '/views') //optional since express defaults to CWD/views

// yelp shit
var consumer_key = 'nMttGA-pdyXSk20Ady60NQ'
var consumer_secret = '47R_D2JGjK20j1qmlNyNRRsGWm8'
var token = '9O7nuodRovArOdoJwOESz9O4BL4xaX2m'
var token_secret = 'M0fk8as_3vsanFkMxeTEf8FpduE'
// yelp request url shit
var yelp_url = 'http://api.yelp.com'
// yelp oauth shit
var oauth = {
	consumer_key: consumer_key,
	consumer_secret: consumer_secret,
	token: token,
	token_secret: token_secret
}

// cloudant database stuff!
var me = 'weidnerae'
var password = 'hundred100' // i beg of you to please not abuse my bad programming practices of not passing the password in via environment variables

// initialize connection to cloudant
Cloudant({account:me, password:password}, function(er, cloudant) {
	console.log('========== CONNECTING TO CLOUDANT ==========')
	if (er)
		return console.log("Error connecting to cloudant account: %s: %s", me, er.message)

	console.log("Connected to cloudant account: %s", me)

	cloudant.ping(function(er, reply) {
		if (er)
			return console.log('Failed to ping cloudant, did your network just go down?')

		console.log('Server version = %s', reply.version)
		console.log('I am %s and my roles are %j', reply.userCtx.name, reply.userCtx.roles)

		cloudant.db.list(function(er, all_dbs) {
			if (er)
				return console.log('Error listing all databases: %s', er.message)

				console.log('Databases: %s', all_dbs.join(','))
				console.log('========== DONE CONNECTING TO CLOUDANT =========')
		})
	})
})

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

		// // every time we want to access the cloudant databases we need to use the Cloudant object to authenticate and then access the databases
		// // in the callback function
		// Cloudant({account:me, password:password}, function(er, cloudant) {
		// 	// since we are testing, start by trying to destroy the db we created previously
		// 	cloudant.db.destroy('test_food_deals', function() {
		// 		// go ahead and re-create it
		// 		cloudant.db.create('test_food_deals', function() {
		// 			// select the database we want to input into
		// 			var test_food_deals = cloudant.use('test_food_deals')
		//
		// 			// insert data into database
		// 			test_food_deals.insert({restaurants: rest}, 'restaurants', function(err, body, header) {
		// 				if (err)
		// 					return console.log('[test_food_details.insert] ' + err.message)
		//
		// 				console.log('Inserted restaurant information into cloudant database')
		// 			})
		//
		// 			test_food_deals.insert({locations: r_locations}, 'restaurant_locations', function(err, body, header) {
		// 				if (err)
		// 					return console.log('[test_food_details.insert] ' + err.message)
		//
		// 				console.log('Inserted restaurant location information into cloudant database')
		// 			})
		// 		})
		// 	})
		// })
		// finally, render the eat page
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
		res.end(JSON.stringify(body))
	})
})

app.get('/dailyfooddeals', function(req, res) {
	res.json([ { logo: "/images/avatar-01.svg",
							 deal: "this is a deal!!!!!!",
							 name: "business name"},
						 { logo: "/images/avatar-01.svg",
						   deal: "2 for 1 drinkz",
							 name: "town tavern"} ])
})

app.listen(process.env.PORT || 3000)
