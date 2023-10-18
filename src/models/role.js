const mongoose= require("mongoose");
schema=mongoose.Schema;
const roleSchema = new schema({
name:{
type:String,
rquired:true,
unique:true

}},{timestamps:true});

const roleModel = mongoose.model("roles",roleSchema);

module.exports={roleModel}