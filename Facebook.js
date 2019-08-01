var axios 	= require('axios');
var qs 		= require('querystring');
var fs 		= require('fs');


var cookie = 'sb=PL2gXCo7xneXIclyZ2f-6lo2; datr=PL2gXPHKDStY6mP0GeDcs6gi; _fbp=fb.1.1554886802710.1410460204; js_ver=3498; wd=1600x757; ; c_user=100007247612769; xs=16%3AWCAXJPRifkvuDg%3A2%3A1564675985%3A10485%3A6200; fr=1UEMojCVmG5YQAO98.AWWZarIM9CUpLE0mqQ7UWFCTtkU.BcoL08.3p.F1C.0.0.BdQw-Q.AWWu1Qjp; spin=r.1001008379_b.trunk_t.1564675986_s.1_v.2_; presence=EDvF3EtimeF1564675996EuserFA21B07247612769A2EstateFDutF1564675996019CEchFDp_5f1B07247612769F1CC; act=1564676014465%2F9';
var fb_dtsg = 'AQEX1RIu0BVJ:AQHHnIUuo3RE';

var interation = [];

// console.log(typeof interation[100004576056182]);
getInteraction(cookie, fb_dtsg, '100007247612769').then(function(){
	console.log(interation.length);
	

	// var byDate = interation.slice(0);
	// interation.sort(function(a, b) {
	// 	console.log(a.point);
	// 	return a.point - b.point;
	// });
	// console.log('by date:');
	// console.log(interation);
	
});

async function getInteraction(cookie, fb_dtsg, id, after = ''){
	
	var next = '';
	var formData = {
		q: 'node('+id+'){timeline_feed_units.first(500).after('+after+'){page_info,edges{node{id,creation_time,feedback{reactors{nodes{id,name}},commenters{nodes{id,name}}}}}}}',
		fb_dtsg: fb_dtsg
	};

	var conf = {
		url: 'https://www.facebook.com/api/graphql/',
		method: 'post',
		data: formData,
		transformRequest: [
		function(data, headers) {
			return qs.stringify(data);
		}
		],
		headers: {
			'accept': '*/*',
			'accept-encoding': 'gzip, deflate, sdch',
			'accept-language': 'vi,en;q=0.9',
			'cookie': cookie,
			'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36'
		}
	};

	var resp = await axios(conf);
	var data =  resp.data[id];
	var dataInteraction = data.timeline_feed_units.edges;

	var promise = [];

	dataInteraction.map(function(item){
		if (item.node.feedback != null) {
			promise.push(handleObj(item.node.feedback, 'reactors'));
			promise.push(handleObj(item.node.feedback, 'commenters'));
		}
	});
	Promise.all(promise);
	if (data.timeline_feed_units.page_info.has_next_page == true) {
		next = data.timeline_feed_units.page_info.end_cursor;
		await getInteraction(cookie, fb_dtsg, id, next);
	}
	
	// console.log(interation);

	
}


async function getFriend(token){
	return await axios.get('https://graph.facebook.com/v3.0/me/friends?limit=5000&access_token=' + token).then(function(){
		return data.data;
	});
}

function handleObj(obj, type){
	var typePush = {
		reactors: 'like',
		commenters: 'cmt'
	};
	var addType = typePush[type];
	return new Promise(function(resolve, reject){
		
		obj[type].nodes.map(function(item){
			if (typeof interation[item.id] == 'undefined') {
				interation[item.id] = {
					name: item.name,
					like: 0,
					cmt: 0,
					point: 0
				};
			}
			interation[item.id][addType]++;
			interation[item.id].point = interation[item.id].like + interation[item.id].cmt;
		});
		resolve(true);
	});
	
}