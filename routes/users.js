var express = require('express');
var router = express.Router();

const nodemailer = require('nodemailer');
const user = '747386743@qq.com',pass = 'oxyuqypblffubdcd';
const smtpTransport = nodemailer.createTransport({
	service : 'QQ',
	auth :{
		user : user,
		pass : pass
	}
});

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');

  smtpTransport.sendMail({
  	from:'747386743@qq.com',
  	to:'747386743@qq.com',
  	subject:'嘿嘿嘿，一封暖暖的小邮件',
  	html:'<h3>哈哈哈，我最美</h3>'
  },(err,res) => {
  	console.log(err,res);
  })

});
module.exports = router;