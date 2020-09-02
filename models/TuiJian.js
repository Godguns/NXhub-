var mongooes=require('mongoose')
mongooes.connect('mongodb://localhost/test')
var Schema=mongooes.Schema
var tuijian=new Schema({
	username:{
		type:String,
		required:true
	},
	
	avater:{
		type:String,
		required:true
	},
})
module.exports=mongooes.model('TuiJian',tuijian);