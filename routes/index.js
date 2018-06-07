var express = require('express');
var multer = require('multer');
var router = express.Router();
var fs = require('fs');
var mysql = require('mysql');

var faceInfo = require('../util/face.js');
var dbConfig = require('../db/dbConfig.js');
var pool = mysql.createPool(dbConfig.mysql);

var createFolder = function(folder){
	try{
		fs.accessSync(folder);
	}catch(e){
		fs.mkdirSync(folder);
	}
}
var uploadFolder = './uploads';
createFolder(uploadFolder);
var storage = multer.diskStorage({
	destination:function(req,file,cb){
		cb(null,uploadFolder);
	},
	filename:function(req,file,cb){
		cb(null,file.fieldname + '_' + Date.now()+'.png');
	}
})
var upload = multer({storage: storage});
//var connection = mysql.createConnection(dbConfig.mysql);

/* GET home page. */

router.get('/',function(req,res,next){
	res.render('index',{title:'dongdong'});
});
router.get('/dong',function(req,res,next){
	pool.getConnection(function(err,connection){
		connection.query("select foot,hostid,color,count(*) as number from pigeon group by foot",function(err,result){
			res.json(result);
		});
		connection.release();
	});
});
router.get('/why',function(req,res,next){
	pool.getConnection(function(err,connection){
		connection.query('select sky=? from race where id = ?',['晴',37],function(err,result){
			console.log(result);
			res.json(result);
		})
	});
});
router.post('/face/info',upload.single('pic'),function(req,res,next){
    var file = req.file;
	faceInfo(res,file.path);
})

router.get('/dddd',function(req,res,next){
	var data = 'Hello,guliang,I xihuan ni!';
	fs.writeFile('dong.txt',data,function(err){
		if(err){
			
		}else{
			res.download("dong.txt");
		}
	})
});
module.exports = router;