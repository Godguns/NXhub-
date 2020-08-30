var mongooes=require('mongoose')
mongooes.connect('mongodb://localhost/test', { useNewUrlParser: true })
var Schema=mongooes.Schema
var album=new Schema({
	
    Album_imgs:{
        type:[],
        required:false
    },
    Album_info:{
		type:String,
		required:false
	},
	
    Album_author:{
		type:String,
		required:false
	},
	master_img:{
		type:String,
		required:true
    },
    Album_name:{
        type:String,
        required:false
    },
    Album_time:{
        type:String,
        required:true
	}



})
module.exports=mongooes.model('Album',album);