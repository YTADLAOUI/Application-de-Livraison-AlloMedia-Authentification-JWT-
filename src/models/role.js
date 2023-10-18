const mongoose= require("mongoose");
const schema=mongoose.Schema;
const roleSchema=new schema({
name:{
type:String,
rquired:true,
unique:true
}
},{timestamps:true});

const roleModel= mongoose.model("role",roleSchema);

module.exports={roleModel}