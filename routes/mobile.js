var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/dong',{ useNewUrlParser: true },function(err,res){
	if(err){
		console.log(err);
	}
});

const con = mongoose.connection;

var theStorySchema = new mongoose.Schema({
	storyId:{type:Number},
	fatherId:{type:Number},
	rank:{type:Number},
	start:{type:Number},
	storyContent:{type:String},
	person:{type:String},
	time:{type:Date,default:Date.now}
})
var theStoryModel = con.model('oneStory',theStorySchema);

/* 获取页面初始数据 */
router.get('/', function(req, res, next) {
	// theStoryModel.find({"storyId":req.query.id},
	// 	{storyId:1,rank:1,start:1,storyContent:1,person:1,time:1},function(err,doc){
	// 	res.render('mobile/answerTheStory',{data:doc});
	// })
	theStoryModel.aggregate([
		{$match:{storyId:parseInt(req.query.id)}},
		{$sort:{start:-1}},
		{$group :{
			_id:"$rank",
			id:{$first:'$_id'},
			rank:{$first:'$rank'},
			start:{$first:'$start'},
			storyContent:{$first:'$storyContent'},
			person:{$first:'$person'},
			time:{$first:'$time'}
		}},
		{$sort:{rank:1}}
	],function(err,doc){
		console.log(doc);
		if(doc == []){
			doc = [
				{
					storyId:null,
					rank:null,
					start:null,
					storyContent:null,
					person:null,
					time:null
				}
			]
		}
		// doc.sort(function(a,b){
		// 	return a.rank - b.rank;
		// })
		res.render('mobile/answerTheStory',{data:doc});
	})
});

// 获取某一级的数据
router.get('/story/rank',function(req,res,next){
	theStoryModel.find({rank:req.query.rank,storyId:req.query.storyId},
		{_id:1,start:1,storyContent:1,person:1,time:1},{sort:{start:-1},skip:1},function(err,doc){
			res.json(doc);
		})
});

// 点赞
router.get('/story/star',function(req,res,next){
	theStoryModel.update({_id:req.query.id},
		{$inc:{start:1}},function(err,doc){
			console.log(doc);
			if(!err){
				res.json({code:200,msg:'success'});
			}
		})
});

// 提交数据
router.post('/story/detail',function(req,res,next){
	// var theStoryEntity = new theStoryModel(req.body);
	// theStoryEntity.save(function(err,doc){
	// 	if(err){

	// 	}else{

	// 	}
	// })
	console.log(JSON.parse(req.body.data));
	theStoryModel.insertMany(JSON.parse(req.body.data),function(err,doc){
		if(err){

		}else{
			res.send({code:200,msg:'successfully'});
		}
	})
});

router.get('/storyList',function(req,res,next){
	theStoryModel.find({'fatherId':0},{_id:1,storyId:1,storyContent:1,person:1,time:1},{},function(err,doc){
		console.log(doc);
		res.render('mobile/answerTheStoryList',{doc:doc})
	})
});

router.get('/storyAllList',function(req,res,next){
	theStoryModel.find({},{_id:1,storyId:1,storyContent:1,person:1,time:1},{},function(err,doc){
		res.render('mobile/answerTheStoryAllList',{doc:doc});
	})
});

router.get('/story/deleteStory',function(req,res,next){
	theStoryModel.remove({"_id":req.query.id},function(err){
		if(err){
			console.log(err);
		}else{
			console.log('delete is successed!!!');
			res.send({code:200,msg:'delete successfully'});
		}
	})
})
module.exports = router;