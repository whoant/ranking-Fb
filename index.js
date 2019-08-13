var axios = require('axios');
var image2base64 = require('image-to-base64');
var pug = require('pug');
var express = require('express');
var fs = require('fs');
var Facebook = require('./Facebook');


var app = express();
var port = 8000;

var cookie = 'c_user=100007247612769; xs=1:Ticnp3wSdaAsRw:2:1565696118:10485:6200; fr=3TsFkFAW76Hzq8a3H.AWV3aqqIqf18ctlvlwfnt81-bfk.BdUqB2..AAA.0.0.BdUqB2.AWXoFCnN; datr=dqBSXdkVxrgWvT8KTdA29j6V';
var fb_dtsg = 'AQFQEMQ4S5Pl:AQH6kgaBHdrc';
var token = 'EAAAAUaZA8jlABAOJVTzd45TW75jPux2OrkJfZCXgKDqXYBg6ZAaZA1U0c91dTdtDbLYNoeQMj2ZCcypnNWWGjYIzgzDL5BNnF8ZC2rZCipGq9wovEPKtYpOwZC2eWF6owVcQoERPhgELtuYwZB25PtEUXtJZC4Jor3s2l6IYVU0DgUTgZDZD';

app.use(express.static('views'));
app.set('view engine', 'pug');
app.set('views', './views');

app.get('/', async function(req, res){

	var data = await Facebook(cookie, fb_dtsg, '100007247612769',token);
	res.render('index', {
		users: data
	});

});

app.listen(port, function(){
	console.log('Listening on port : '+ port);
});
