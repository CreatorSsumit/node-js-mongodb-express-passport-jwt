const mongoose = require('mongoose');

mongoose.connect("mongodb+srv://skkushwaha:Madurga98@cluster0.4pwndht.mongodb.net/?retryWrites=true&w=majority",{
    useNewUrlParser: true,
    useUnifiedTopology: true
  }).then(()=>{
    console.log('mongo connected')
}).catch(err=>{
    console.log(err)
})

module.exports = mongoose