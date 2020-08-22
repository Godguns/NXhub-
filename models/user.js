var mongooes=require('mongoose')
mongooes.connect('mongodb://localhost/test')
var Schema=mongooes.Schema
var userSchema=new Schema({
	username:{
		type:String,
		required:true
	},
	password:{
		type:String,
		required:true
	},
	avater:{
		type:String,
		required:true
	}
})
module.exports=mongooes.model('User',userSchema);