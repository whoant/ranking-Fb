var axios = require('axios');
var image2base64 = require('image-to-base64');


var url = 'https://scontent.fdad2-1.fna.fbcdn.net/v/t1.0-9/54523675_2224247644493468_4947626798268547072_n.jpg?_nc_cat=110&_nc_oc=AQmRIqryBLR_nPkpTo3JYOOkhk18mqc-c6SCFTyUfBi9bnSvlBLsVWWw33FxreQ1IqrYoTJYUf--O3bhtpW1IMo-&_nc_ht=scontent.fdad2-1.fna&oh=cf52d6e834eb7e0af64972a32758133a&oe=5DADCD27';

coverImage(url).then(function(data){
	console.log(data);
});



function coverImage(url){
	return image2base64(url)
	.then(function(response){
		return response;
	});
}