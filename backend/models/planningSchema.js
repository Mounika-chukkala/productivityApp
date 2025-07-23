const mongoose = require("mongoose");
// const eventSchema = new mongoose.Schema({
//   time: {
//     type: Date,
//     required: true,
//   },title: {
//     type: String,
//     required: true,
//   }
// });
// // const goalSchema = new mongoose.Schema({
// //   title: {
// //     type: String,
// //     required: true,
// //   },
 
// // });
const planningSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId,
     ref: "User",
      required: true },
  events:[ {
      title: { type: String },
      time: { type: String }
    }], 
  goals:[{
    type:String
  }],
  
  date: {
     type: String,
      },
});

module.exports = mongoose.model("Planning", planningSchema);
