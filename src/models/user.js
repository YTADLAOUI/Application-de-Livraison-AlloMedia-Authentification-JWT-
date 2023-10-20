const mongoose= require("mongoose");


schema=mongoose.Schema;

const userSchema = new schema({
  name:{
    type : String,
    required : true,
  },
  email:{
    type: String,
    required: true,
    unique:true
  },
  password:{
    type:String,
    require:true,
  },
  phoneNumber:{
    type: Number,
    required:true,
    unique:true
  },
  address:{
    type:String,
    require:true,
  },
  image:{
    type: String,
    require:true,
  },
  role:{
    type: mongoose.Schema.Types.ObjectId,
    ref:'roles'
  },
  isEmailVerfied:{
    type:Boolean,
    require:true
  },
  isVerified:{
    type : Boolean,
    require:true
  },
  isDeleted:{
    type:Boolean,
    require:true
  }
  
},{timestamps:true});

const userModel=mongoose.model("Users",userSchema);

module.exports={userModel}