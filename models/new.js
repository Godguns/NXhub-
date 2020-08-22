var mongooes=require('mongoose')
mongooes.connect('mongodb://localhost/test', { useNewUrlParser: true })
var Schema=mongooes.Schema
var news=new Schema({
	
	
	username:{
		type:String,
		required:true
	},
	avater:{
		type:String,
		required:true
	},
	content:{
		type:String,
		required:true
	},
	time:{
		type:String,
		required:true
	}


})
module.exports=mongooes.model('News',news);