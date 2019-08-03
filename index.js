var axios = require('axios');
var image2base64 = require('image-to-base64');
var pug = require('pug');
var express = require('express');
var fs = require('fs');
var Facebook = require('./Facebook');


var app = express();
var port = 8000;

var cookie = 'datr=N1hEXcgd2ItyeWdDcyoRTkUR; fr=1jvFqaic964XLJFOy.AWVb7qn0amYMO7Blf298YkWwaL0.BdRFg3.E9.AAA.0.0.BdRFg3.AWWXV4Ch; sb=N1hEXd5cCQ8r9iuf5PudST-Y; c_user=100007247612769; xs=50%3AVJ5iF70s7BfmYg%3A2%3A1564760119%3A10485%3A6200; ';
var fb_dtsg = 'AQFuQNjyyOr0:AQEIuwW0yanC';
var token = 'EAAAAZAw4FxQIBABzhRMJIIFKZCVZA4UafMApF02wknv6UluYM4PEXMXMac5eZCF6i1x5ALTpjJJjlMZBY67xZATxRzRx3D6SBCu18VHMOJyTVCWjG7przLD1acF6cGZCzUu4ytKMH1J4uZBrCypahCreOih9a4EBef8EJ6YxG6RZCugZDZD';


var url = 'https://scontent.fdad2-1.fna.fbcdn.net/v/t1.0-9/54523675_2224247644493468_4947626798268547072_n.jpg?_nc_cat=110&_nc_oc=AQmRIqryBLR_nPkpTo3JYOOkhk18mqc-c6SCFTyUfBi9bnSvlBLsVWWw33FxreQ1IqrYoTJYUf--O3bhtpW1IMo-&_nc_ht=scontent.fdad2-1.fna&oh=cf52d6e834eb7e0af64972a32758133a&oe=5DADCD27';

app.use(express.static('views'));
app.set('view engine', 'pug');
app.set('views', './views');

app.get('/', async function(req, res){

	var data = await Facebook(cookie, fb_dtsg, '100007247612769',token);
	console.log(data.length);

	res.render('index', {
		users: data
	});

});

app.listen(port, function(){
	console.log('Listening on port : '+ port);
});

function coverImage(url){
	return image2base64(url)
	.then(function(response){
		return response;
	});
}