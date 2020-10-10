const mongoose = require ('mongoose');
const Schema = mongoose.Schema;

const WindowsSchema = new Schema({
  
 name:{
   type: String,
   required:true
 },
 text:{
   type:String,
   required:true
 },
 uuid:{
   type:String,
   required:true
 },
 link:{
   type:String
 },
 picture:{
   type:String
 },
 type:{
   type:String,
 }
});

mongoose.model('answers', WindowsSchema);