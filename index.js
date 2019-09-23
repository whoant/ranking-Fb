var axios = require('axios');
var pug = require('pug');
var express = require('express');
var fs = require('fs');
var Facebook = require('./Facebook');


var app = express();
var port = 8000;

var cookie = '';
var fb_dtsg = '';
var token = '';

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
