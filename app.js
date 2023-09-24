const express = require('express');
const cookieParser = require('cookie-parser')
const app  = express();
const cors = require('cors');
const indexRouter = require('./routes/index')
const userRouter = require('./routes/user')
const passport = require('passport');
const passport_local = require('passport-local')
const userSchema = require('./mongoconfig/user');
const expressSession =  require('express-session')
const { PORT, SECRET_KEY ,WHITELISTED_DOMAINS} = require('./constant');



require('./mongoconfig/index')

app.use(cors({
    origin:(origin,callback)=>{
            if (!origin || WHITELISTED_DOMAINS.indexOf(origin) !== -1) {
              callback(null, true)
            } else {
              callback(new Error("Not allowed by CORS"))
            }
        },
          credentials:true
    })
 )

app.use(express.json());
app.use(expressSession({
    resave:false,
    saveUninitialized:false,
    secret:SECRET_KEY
}))
app.use(passport.initialize())
app.use(passport.session())
app.use('/',indexRouter);
app.use('/user',userRouter);


app.listen(PORT,()=>{
    console.log('listening on port ' + PORT)
})