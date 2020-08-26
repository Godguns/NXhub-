var mongooes=require('mongoose')
mongooes.connect('mongodb://localhost/test', { useNewUrlParser: true })
var Schema=mongooes.Schema
var pixiv=new Schema({
	
	tag:{
        type:[],
        required:true
    },
	info:{
		type:String,
		required:false
	},
	title:{
		type:String,
		required:false
	},
	author:{
		type:String,
		required:false
	},
	imgsrc:{
		type:String,
		required:true
    },
    Album:{
        type:String,
        required:false
    },
    time:{
        type:String,
        required:true
    }


})
module.exports=mongooes.model('Pixiv',pixiv);