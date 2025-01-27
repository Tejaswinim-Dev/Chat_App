const mongoose=require('mongoose')

const userSchema=new mongoose.Schema({
    username:{
        type:String,
        required:true,
        min:3,
        max:20,
        unique:true
    },
    email:{
        type:String,
        required:true,
        max:50,
        unique:true

    },
    password:{
        type:String,
        required:true,
        min:8
    },
    isAvatarImageSet:{
        type:Boolean,
        default:false
        
    },
    avatarImg:{
        type:String,
        default:""
    }
},{timestamps:true});

const userModel=mongoose.model('Users',userSchema);

module.exports=userModel;