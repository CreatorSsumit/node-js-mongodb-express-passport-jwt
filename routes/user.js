const express =  require('express');
const router  =  express.Router()
const passport = require("passport")
const passportJwt = require('passport-jwt');
const { SECRET_KEY } = require('../constant');
const userSchema  = require('../mongoconfig/user')

let opts ={}
opts.jwtFromRequest = passportJwt.ExtractJwt.fromAuthHeaderAsBearerToken()
opts.secretOrKey = SECRET_KEY

passport.use(new passportJwt.Strategy(opts,(jwt_payload,done)=>{
    userSchema.findOne({ _id: jwt_payload._id }).then(user=>{

          if (user) {
            return done(null, user)
          } else {
            return done(null, false)
            // or you could create a new account
          }

    }).catch(err=>{
        done(err,false)
    })
  
}))

router.use(passport.authenticate('jwt', { session: false })
// ,(req,res,next)=>{     // if you need req,res , otherwise it ok
//     next()
// }
)


router.get('/profile',(req,res)=>{
    res.jsonp({success:true,page:'profile'})
})




module.exports = router;