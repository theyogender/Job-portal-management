const mongo=require('mongoose');
mongo.connect('mongodb://127.0.0.1:27017/db')

const Schema=new mongo.Schema({
    user_Id:String,
    Serial_Number:Number,
    Company:String,
    email:String,
    Number:Number,
    Job_Name:String,
    Registered_Number:Number
})
 module.exports=mongo.model('Employer',Schema);


 