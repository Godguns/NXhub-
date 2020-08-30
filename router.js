var User=require('./models/user')
var News=require('./models/new')
var Pixiv=require('./models/pixiv')
var Album=require('./models/album')
var express=require('express');
var router= express.Router();
const qiniu = require("qiniu");
const e = require('express');
var Talklist=require('./models/talklist')
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
			avater:user.avater,
			history:user.history,
			collect:user.collect
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
						 	"code":"这个用户名已经被注册过啦！"
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
					avater:body.avater,
					time:body.time,
					img:body.img
					 });
				news.save(function(err, ret) {
						if (err) {
							console.log('发布吐槽失败',err);
								res.json({
							"code":200,
							"msg":"发布失败",
							
						})
						} else {
							console.log('发布吐槽成功');
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
     expires:360*24
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
				"avater":user.avater,
				"fork":user.fork,
				"history":user.history,
				"collect":user.collect

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
				 await News.updateMany({
					username: body.username}, { avater: body.avater }
					);

		console.log("修改结果为",ret)
		res.json({
			"data":ret
		})


		}
		})
})
//获取吐槽动态
router.get('/api/v1/spit',(req,res)=>{
		News.find(function(err,ret){
			if(err){

				res.json({
					"data":"查询失败"
				})
				console.log('查询失败');
			}else{
				console.log('查询成功');
				res.json({
					"data":ret
				})
			}
			})	
})
//获取个人动态
router.get('/api/peason',(req,res)=>{
	News.find({
		username:req.query.username

	},function(err,ret){
				if(err){

				res.json({
					"data":"查询失败"
				})
				console.log('查询失败');
			}else{
				console.log('查询成功');
				res.json({
					"data":ret
				})
			}
	})
})
//获取用户的关注列表
router.get('/findfork',(req,res)=>{
	var body=req.query;
	User.findOne({
		username:body.username,
	},async (err,ret)=>{
		if (err) {
			res.send("err!")
		}else if(!ret){
			console.log("没有此用户")
		}else{
			res.json({
				'fork':ret.fork
			})
		}
	})
})
//添加关注
router.get('/addfork',async (req,res)=>{
	var body=req.query;
	User.findOne({
		username:body.username,

	},async (err,ret)=>{
		if (err) {
			res.send("err!")
		}else if(!ret){
			console.log("没有此用户")
		}
		else{
				await User.updateOne({
				username: ret.username, password:ret.password,avater: ret.avater}, { fans: body.fork.split(',')}
				);
				await User.updateOne({
					username:body.user
				},{fork:body.usergz.split(',')})

				User.findOne({username:body.username},(err,ret)=>{
					res.json({
						'data':ret
					})	
				})
			
		}
	})

})
//根据用户名字返回用户信息
router.get('/getpeopleinfo',(req,res)=>{
	var body=req.query;
	User.findOne({
		username:body.username,
		
	},(err,user)=>{
		//console.log(user)
		if(err){
			res.send("err!")
		}
		if(!user){
			  res.send("no找不到!")
		}else{
			News.find({
				username:req.query.username
		
			},function(err,ret){
						if(err){
		
						res.json({
							"data":"查询失败"
						})
						console.log('查询失败');
					}else{
						console.log('查询成功');
						res.json({
							"data":ret,
							"info":user
						})
					}
			})
			
			
		}

	})

})
//获取用户的粉丝
router.get('/getuserforks',async (req,res)=>{
	var body=req.query;
	User.findOne({
		username:body.username
	}, async(err,ret)=>{
		if(err){
			res.json({
				code:"err!"
			})
		}else{
			var result=[];
			var avaterlist=[]
			for(let i=0;i<ret.fans.length;i++){
				
				await User.findOne({
					username:ret.fans[i]
				}, (err,ret)=>{
					if(err){
						res.send("出错了")
					}else{
						console.log(ret)
						result.push(ret)
						
						
					}
				})
			}
			for(let i=0;i<ret.fork.length;i++){
				await User.findOne({username:ret.fork[i]},(err,ret)=>{
					if(err){
						res.send("出错了")
					}else{
						console.log(ret)
						avaterlist.push(ret)
						
						
					}
				})

			}
			console.log("触发！！！")
		setTimeout(()=>{
			res.json({
				"data":result,
				"forks":avaterlist
			})
		},200)
		}
	})

})
//用户上传图片接口
router.get('/supdate',(req,res)=>{
	var body=req.query;
	var pixiv=new Pixiv({
		tag:body.tag,
		info:body.info,
		title:body.title,
		author:body.author,
		imgsrc:body.imgsrc,
		Album:body.Album,
		time:body.time,
		avater:body.avater
	});
	pixiv.save(async (err,ret)=>{
		if(err){
			res.json({
				"data":"err"
			})
		}else{
		
			
			var newhistory=[]
		await	User.findOne({username:body.author},(err,ret)=>{
				if(err){
					console.log("myc!")
				}else{
				
					newhistory=	ret.history
					
				}
			})
			newhistory.push(body.imgsrc)
			var ret=await User.updateOne({username: body.author}, {history:newhistory});
			res.json({
				"data":ret
			})
		}
	})

})
//为瀑布流提供图片数据
router.get('/getpics',(req,res)=>{
	Pixiv.find({

	},(err,ret)=>{
		if(err){
			res.json({
				"data":"获取瀑布流数据失败"
			})
		}else{
			res.json({
				"data":ret
			})
		}

	})

})
//添加收藏
router.get('/tocollect',(req,res)=>{
	var body=req.query;
	User.findOne({
		username:body.username,
		
	},async (err,ret)=>{
		if(err){
			res.json({
				"data":"wrong!"
			})
		}else{
			var newcollect=ret.collect;
			newcollect.push(body.img)
		 await	User.updateOne({ username: body.username},{collect:newcollect});
		 res.json({
			 "data":"OK"
		 })
		}
	})

})
//根据图片名字获取用户信息
router.get('/usermsg',(req,res)=>{
	var body =req.query;
	Pixiv.findOne({
		imgsrc:body.img
	},async(err,ret)=>{
			if(err){
				console.log("err!")
			}else{
				//console.log(body.im)
			await	User.findOne({username:ret.author},(err,result)=>{
					
					
						if (err) {
							console.log("查询失败")
						}else{
							res.json({
								"data":result
							})
						}
				})
			}

	})
})
//获取评论参数是_id
router.get('/get_talklist',(req,res)=>{
	var body=req.query;
	Pixiv.findOne({
		_id:body._id

	},(err,ret)=>{
		if (err) {
			console.log("查询评论失败")
		}else{
			Talklist.find({imgsrc:ret.imgsrc},(err,ret)=>{
				if (err) {
					res.json({
						"data":err
					})
				}else{
					console.log(ret)
					res.json({
						"data":ret
					})
				}
			})
		}
	})

})
//添加评论
router.get('/addtalk',(req,res)=>{
	var body=req.query;
	var talkliist=new Talklist({
		imgsrc:body.imgsrc,
		username:body.username,
		avater:body.avater,
		content:body.content,
		time:body.time,
		reback:body.reback
	})
	talkliist.save({
		
	},(err,ret)=>{
		if (err) {
			res.json({
				"data":err
			})
		}else{
			res.json({
				"data":ret
			})
		}
	})
})
//添加专辑
router.get('/add_album',(req,res)=>{
	var body=req.query;
	var album=new Album({
		Album_imgs:body.Album_imgs,
		Album_info:body.Album_info,
		Album_author:body.Album_author,
		master_img:body.master_img,
		Album_name:body.Album_name,
		Album_time:body. Album_time,

	})
	album.save((err,ret)=>{
		if (err) {
			console.log(err,"添加专辑失败")
		}else{
			res.json({
				"data":ret
			})
		}
	})
})
//获取专辑
router.get('/get_album',(req,res)=>{
	var body=req.query;
	Album.find({

	},(err,ret)=>{
		if (err) {
			console.log("获取专辑失败")
		}else{
			res.json({
				"data":ret
			})
		}
	})
})
module.exports = router;