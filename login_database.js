const mongose=require('mongoose');
mongose.connect('mongodb://127.0.0.1:27017/db')

const Schema=new mongose.Schema({
    Designation:String,
    Name:String,
    Number:Number,
    Password:String,
    
    
})
 module.exports=mongose.model('user',Schema);