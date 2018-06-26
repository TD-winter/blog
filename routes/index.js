var express = require('express');
var multer = require('multer');
var router = express.Router();
var fs = require('fs');
// var mysql = require('mysql');
// var dbConfig = require('../db/dbConfig.js');
// var pool = mysql.createPool(dbConfig.mysql);
var mongoose = require('mongoose');
// var faceInfo = require('../util/face.js');
var faceInfo = require('../util/qq_face.js');

mongoose.connect('mongodb://localhost:27017/dong');

const con = mongoose.connection;
var TestSchema = new mongoose.Schema({
	name:{type:String},
	age:{type:Number,default:0},
	email:{type:String},
	time:{type:Date,default:Date.now}
});
var TestModel = con.model("test1",TestSchema);
// var TestEntity = new TestModel({
// 	name:'TD-winter',
// 	age:27,
// 	emai:'747386743@qq.com'
// });

var articleSchema = new mongoose.Schema({
	title:{type:String},
	writer:{type:String},
	brief:{type:String},
	article:{type:String},
	time:{type:Date,default:Date.now}
})
var articleModel = con.model("article",articleSchema);

// TestEntity.save(function(error,doc){
// 	if(error){
// 		console.log(error);
// 	}else{
// 		console.log(doc);
// 	}
// })

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
	articleModel.find({},function(err,doc){
		res.render('index',{title:'dongdong',doc:doc});
	})
	
});
router.get('/edit',function(req,res,next){
	res.render('edit',{title:'编辑文章'});
});
router.post('/addArticle',function(req,res,next){
	var articleEntity = new articleModel(req.body);
	articleEntity.save(function(err,doc){
		if(err){
			console.log(err)
		}else{
			res.send({code:200,msg:'Added successfully'});
		}
	})
})
router.get('/page',function(req,res,next){
	articleModel.find({"_id":req.query.id},function(err,doc){
		console.log(doc);
		res.render('page',{doc:doc});
	})
})

// router.get('/dong',function(req,res,next){
// 	pool.getConnection(function(err,connection){
// 		connection.query("select foot,hostid,color,count(*) as number from pigeon group by foot",function(err,result){
// 			res.json(result);
// 		});
// 		connection.release();
// 	});
// });
// router.get('/why',function(req,res,next){
// 	pool.getConnection(function(err,connection){
// 		connection.query('select sky=? from race where id = ?',['晴',37],function(err,result){
// 			console.log(result);
// 			res.json(result);
// 		})
// 	});
// });
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