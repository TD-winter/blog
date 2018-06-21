var https = require('https');
var crypto = require('crypto');
var qs = require('querystring');
var fs = require('fs');
var Q = require('q');

function cb(cb,file_path){
	var md5 = crypto.createHash('md5');
	var image = fs.readFileSync(file_path);
	var image_buffer = new Buffer(image).toString("base64");
	var app_key = '3cdHPMf7kcwppfrE';
	var params = {
		"app_id" :"1106984514",
		"time_stamp":Date.now()/1000,
		"nonce_str":Math.random().toString(36).substr(2),
		"image":image_buffer,
		"mode":"0",
		"sign":""
	}

	var str = '';
	for(let key of Object.keys(params).sort()){
		if(params[key] != ''){
			str += key + '=' + qs.escape(params[key]) +'&';
		}
	}
	str += 'app_key=' + qs.escape(app_key);
	str = md5.update(str).digest('hex').toUpperCase();
	params.sign = str;
	var req = https.request(
	    {
		    hostname : 'api.ai.qq.com',
		    path : '/fcgi-bin/face/face_detectface',
		    headers:{
		        'Content-Type': 'application/x-www-form-urlencoded'
		    },
		    method:'POST',
		    agent:false
	    },
	    function (res) {
			res.on('data',function(doc){
		        //console.log('body' + doc);
		        cb.send(doc);
		    })
		    res.on('err',function(doc){
		        console.log('what is the fuck!!!');
		    })
	    }
	)
	req.write(qs.stringify(params));
	req.end();
}

module.exports = cb;