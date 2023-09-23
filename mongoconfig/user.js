const mongoose = require('mongoose')
const plm =  require('passport-local-mongoose');

const Session = new mongoose.Schema({
    refreshToken: {
      type: String,
      default: "",
    },
  })

const schema  =  new mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    name:String,
    refreshToken: {
        type: [Session],
      },   
})

schema.set("toJSON", {
    transform: function (doc, ret, options) {
      delete ret.refreshToken
      return ret
    },
  })

schema.plugin(plm);  

module.exports =  mongoose.model('Passportuser',schema)