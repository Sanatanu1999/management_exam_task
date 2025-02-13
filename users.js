const mongoose=require('mongoose');
const userSchema=new mongoose.Schema({
    user_name:{
        type:String
    },
    user_image:{
        type:String
    },
    user_email:{
        type:String
    },
    password:{
        type:String
    },
    emailVerify:{
        type:Boolean,
        default:false
    }
},{
    timestamps:true,
    versionKey:false
});

const userModel=new mongoose.model('users',userSchema);

module.exports=userModel;