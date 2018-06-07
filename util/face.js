var https = require('https');
var qs = require('querystring');
var fs = require('fs');
var Q = require('q');

let res_data = null;

const param = qs.stringify({
    'grant_type': 'client_credentials',
    'client_id': 'uwClbEZewFZOy6Yo403uKQSg',
    'client_secret': 'vPfl18GNWLYV1NjM1CHycrCPpEFzsEzx'
});

function requestUrl(){
    return Q.Promise(function(resolve,reject,notify){
       https.get(
            {
                hostname: 'aip.baidubce.com',
                path: '/oauth/2.0/token?' + param,
                agent: false
            },
            function (res) {
                res.on('data', (res) => {
                    res = new Buffer(res,'base64').toString();
                    res = JSON.parse(res);
                    resolve(res.access_token);
                });
            }
        ) 
    })
}
function requestUrl_2(access_token,file_path){
    return Q.Promise(function(resolve,reject,notify){
        var faceImg = fs.readFileSync(file_path);
        var base64str = new Buffer(faceImg).toString('base64');
        //console.log(base64str);
        const faceUp = qs.stringify({
            'image' : base64str,
            'image_type' : 'BASE64',
            'face_field' : 'age,beauty'
        })

        var options = {
            hostname : 'aip.baidubce.com',
            path : '/rest/2.0/face/v3/detect?access_token='+access_token,
            headers:{
                'Content-Type': 'application/json'
            },
            method:'POST',
            agent:false
        }
        var req = https.request(options,(res) => {
            res.on('data',function(doc){
                console.log('body' + doc);
                resolve(doc);
            })
            res.on('err',function(doc){
                console.log('what is the fuck!!!');
            })
        })
        req.write(faceUp);
        req.end();
    })
}

function cb(cb,file_path){
    requestUrl().then(function(access_token){
        return requestUrl_2(access_token,file_path);
    }).then(function(data){
        cb.send(data);
    })
}

module.exports = cb;