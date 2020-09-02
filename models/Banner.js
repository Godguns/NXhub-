var mongooes=require('mongoose')
mongooes.connect('mongodb://localhost/test')
var Schema=mongooes.Schema
var banner=new Schema({
	
	
	banner:{
		type:String,
		required:true
	},
})
module.exports=mongooes.model('Bannner',banner);