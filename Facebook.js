var axios 	= require('axios');
var qs 		= require('querystring');
var fs 		= require('fs');


var interation = {};


async function run(cookie, fb_dtsg, userId, token){
	var resuft = [];
	var promiseListPic = [];
	getToken(cookie);
	await getFriend(token);
	await getInteraction(cookie, fb_dtsg, '100007247612769');
	// fs.writeFileSync('data.txt', JSON.stringify(interation), {encoding: 'utf8', flag: 'a'});
	// interation = JSON.parse(fs.readFileSync('data.txt', {encoding: 'utf8'}));

	// sẵp xếp lại Object theo point
	var objectSort = Object.keys(interation).sort(function(a, b){
		return interation[b].point - interation[a].point;
	});
	// lấy 5 người có điểm cao nhất
	
	for (var i = 0; i < 5; i++) {
		promiseListPic.push(getAvt(objectSort[i]));
		resuft.push(interation[objectSort[i]]);
	}

	await Promise.all(promiseListPic).then(function(item){
		for (var i = 0; i < 5; i++) {
			resuft[i].url = item[i];
		}
		
	});

	return resuft;

}

async function getToken(cookie){
	var conf = {
		url: 'https://m.facebook.com/composer/ocelot/async_loader/?publisher=feed',
		method: 'get',
		headers: {
			'accept': '*/*',
			'accept-encoding': 'gzip, deflate, sdch',
			'accept-language': 'vi,en;q=0.9',
			'cookie': cookie,
			'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36'
		}
	};

	var resp = await axios(conf);
	var data = resp.data.replace(/\\/g, '');
	// console.log(data);
	console.log(data.match('/"accessToken":"(.+?)"/g'));
}

async function getAvt(uid){
	var link = await axios.get('https://graph.facebook.com/'+uid+'?fields=picture.width(960).height(960)&redirect=false');
	return link.data.picture.data.url;
}

async function getInteraction(cookie, fb_dtsg, id, after = ''){

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
		var nextLink = data.timeline_feed_units.page_info.end_cursor;
		await getInteraction(cookie, fb_dtsg, id, nextLink);
	}
	
}

async function getFriend(token){
	console.log('Đang lấy danh sách bạn bè');
	var listFriend = await axios.get('https://graph.facebook.com/v3.0/me/friends?limit=5000&access_token=' + token);
	listFriend = listFriend.data;

	listFriend.data.map(function(item){
		interation[item.id] = {id: item.id, name: item.name, like: 0, cmt: 0, point: 0};
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
			if (typeof interation[item.id] !== 'undefined') {
				interation[item.id][addType]++;
				interation[item.id].point = interation[item.id].like + interation[item.id].cmt;
			}
			
		});
		resolve(true);
	});
	
}

module.exports = run;