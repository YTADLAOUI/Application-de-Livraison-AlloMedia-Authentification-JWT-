const { schema } = require("@hapi/joi/lib/compile");
const boolean = require("@hapi/joi/lib/types/boolean");
const string = require("@hapi/joi/lib/types/string");
const mongoose= require("mongoose");
const schema=mongoose.schema;

const userSchema=new schema({
  name:{
    type:string,
    required:true,
  },
  email:{
    type:string,
    required: true,
    unique:true
  },
  password:{
    type:string,
    require:true,
  },
  phoneNumber:{
    type:string,
    required:true,
    unique:true
  },
  address:{
    type:string,
    require:true,
  },
  image:{
    type:string,
    require:true,
  },
  role:{
    type:mongoose.schema.Types.ObjetId,
    ref:'roleModel'
  },
  isVerified:{
    type:boolean,
    require:true
  },
  isDeleted:{
    type:boolean,
    require:true
  }
  
},{timestamps:true});

const userModel=mongoose.model("Users",userSchema);

module.exports={userModel}