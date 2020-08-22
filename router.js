var User=require('./models/user')
var News=require('./models/new')
var express=require('express');
var router= express.Router();
const qiniu = require("qiniu");
//登录接口
router.get('/api/v1/auth/login',(req,res)=>{
	var body=req.query
	User.findOne({
		username:body.username,
		password:body.password
	},(err,user)=>{
		if(err){
			res.send("err!")
		}
		if(!user){
			  res.send("no!")
		}else{
		 req.session.user = user
		res.json({
		"code":200,
		"msg":"登录成功",
		"cookie":req.session.user,
		"data":{
			username:body.username,
			password:body.password,
			avater:user.avater
		}
	})
		}
		
  

	})
})
//注册接口
router.get('/api/v1/user/register',(req,res)=>{
	
	console.log("开始")
	var body=req.query;
	var user = new User({
	username: body.username,
	password: body.password,
	avater:body.avater
	
		});

			User.findOne({
					username:body.username,
					password:body.password,
					
				},(err,r)=>{
					
					if (err) {
						res.send("err!")
					}
					if(!r){
							user.save(function(err, ret) {
							if (err) {
								console.log('保存失败',err);
								//console.log(ret)
								res.send("注册失败")
							} else {
								console.log('保存成功');
								console.log(ret);
								res.json({
								"code":200,
								"msg":"注册成功"
								
							})
							}
						});
						 
					}else{

						 res.json({
						 	"code":"err"
						 })
					}
		
					

				})
})

//发布吐槽
router.get('/api/v1/spit2',(req,res)=>{
	var body=req.query
	var news = new News({
					username: body.username,
					content: body.content,
					avater:"http://oss.seefs.cn/FkY0NryjjofNmswpXTWpyinRjxwp",
					time:body.time	 });
				news.save(function(err, ret) {
						if (err) {
							//console.log('保存失败');
						} else {
							//console.log('保存成功');
							console.log(ret);
							res.json({
							"code":200,
							"msg":"发布成功",
							
						})
						}
					});	
})

//获取七牛云token
router.get('/api/v1/file/token',(req,res)=>{
  var body=req.body;
  const accesskey='JDaBeFjynnIIGUCJ0VMXGPpMiZvNNebuW2Wglrf8';
  const ssk='vIbbPa-FICKMinOcLDN0npMyMKRCUAhG6c_XB5Mj';
  const bucket='nxhub';
  let mac=new qiniu.auth.digest.Mac(accesskey,ssk);
  let options={
    scope:bucket,
    // expires:360*24
  };
  let putPolicy=new qiniu.rs.PutPolicy(options);
  let uploadToken=putPolicy.uploadToken(mac);
  res.json({
    "token":uploadToken
  })

})
//获取当前用户信息
router.get('/api/v1/auth',(req,res)=>{
	var body=req.query;
	User.findOne({
		username:body.username,
		password:body.password,
	},(err,user)=>{
		//console.log(user)
		if(err){
			res.send("err!")
		}
		if(!user){
			  res.send("no找不到!")
		}else{
			//console.log(user)
			res.json({
				"code":"200",
				"username":user.username,
				"password":user.password,
				"avater":user.avater

			})
		}

	})	

})

//修改用户信息
router.get('/api/v1/auth/change_info',  (req,res)=>{
		var body=req.query;
		User.findOne({
				username:body.username,
				password:body.password,
		},async (err,data)=>{
			if(err){
			res.send("err!")
		}
		if(!data){
			  res.send("no找不到!")
		}else{
			console.log(data)
		var ret=	await User.updateOne({
				 username: body.username, password:body.password}, { avater: body.avater }
				 );
		console.log("修改结果为",ret)
		res.json({
			"data":ret
		})


		}
	})
})
module.exports = router;