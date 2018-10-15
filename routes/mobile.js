var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/dong');

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
		{$project:{storyId:1,rank:1,start:1,storyContent:1,person:1,time:1}},
		{$sort:{start:-1}},
		{$group :{
			_id:$rank,
			// storyId:"$storyId",
			// rank:"$rank",
			// start:"$start",
			storyContent:{$first:'$storyContent'}
			// person:"$person",
			// time:"$time"
		}}

	],function(err,doc){
		console.log(doc);
		res.render('mobile/answerTheStory',{data:doc});
	})
  	
});

// 获取某一级的数据
router.get('/story/rank',function(req,res,next){

})

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
})

module.exports = router;
