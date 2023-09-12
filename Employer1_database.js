const mongo=require('mongoose');
mongo.connect('mongodb://127.0.0.1:27017/db')

const Schema=new mongo.Schema({
    Serial_Number:Number,
    Company:String,
    email:String,
    Number:Number,
    Job_Name:String,
    Id:Number
})
 module.exports=mongo.model('Employer',Schema);


 