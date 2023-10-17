const string = require("@hapi/joi/lib/types/string");
const { Timestamp } = require("mongodb");
const mongoose= require("mongoose");
const schema=mongoose.Schema;
const roleSchema=new schema({
name:string,
rquired:true,
unique:true
},{timestamps:true});

const roleModel= mongoose.model("role",roleSchema);

module.exports={roleModel}