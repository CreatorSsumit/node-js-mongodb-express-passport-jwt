const express =  require('express');
const router  =  express.Router()
const passport = require('passport');
const passport_local = require('passport-local')
const userSchema = require('../mongoconfig/user')
const jwt =  require('jsonwebtoken'); 
const { SECRET_KEY, EXPIRED_IN } = require('../constant');
passport.use(new passport_local.Strategy(userSchema.authenticate()))
passport.serializeUser(userSchema.serializeUser())
passport.deserializeUser(userSchema.deserializeUser())


router.get('/',(req,res)=>{
    res.jsonp({success:true,page:'index'})
})

const getToken =  (user,expiresIn)=>{
            const token = jwt.sign(user,SECRET_KEY,{expiresIn})
            return token;
        }
const getRefreshToken =  (user)=>{
            const rftoken = jwt.sign(user,SECRET_KEY)
            return rftoken;
        }        

router.post('/signup' , (req,res)=>{
    var {username,password,name} =  req.body;

    if(username&&password){
       userSchema.register(new userSchema({username,name}),password, (err,user)=>{
                if (err) {
                    res.statusCode = 500
                    res.json({error:err})
                  } else {
                    const token  =  getToken({_id:user._id},EXPIRED_IN)
                    const refreshToken  =  getRefreshToken({_id:user._id});

                  if(refreshToken){
                    user.refreshToken.push({refreshToken});
                    user.save().then(e=>{
                        res.status(200).json({success:true,token,refreshToken})
                    }).catch(err=>{
                       res.status(500).json({error:err})
                    })
                  }else {
                    res.status(500).json({ error: 'Error generating refreshToken' });
                  }
         } })
    }
})

router.post("/login", passport.authenticate('local'),(req,res)=>{
    const token = getToken({_id:req.user._id},EXPIRED_IN);
    const refreshToken = getRefreshToken({_id:req.user._id})

    if(refreshToken){
     userSchema.findById(req.user._id).then(user=>{
          user.refreshToken.push({refreshToken});
          user.save().then(()=>{
            res.json({
                success:true,
                token,
                refreshToken
            })
          }).catch(err=>res.json({error:err}))
        },
         err =>  res.json({error:err})
        
        )
    }else{
        res.status(500).json({ error: 'Error generating refreshToken' });
    }})


router.get('/refreshtoken',(req,res)=>{

    const authToken = req.headers?.authorization?.split(" ")?.[1];

    jwt.verify(authToken,SECRET_KEY,(err,result)=>{
        
        if(result){
            userSchema.findById(result._id).then(user=>{
               const refreshTokenIndex = user.refreshToken.findIndex(itm=>itm.refreshToken === authToken );
               
               if(refreshTokenIndex >= 0){

                const token = getToken({_id:result._id},EXPIRED_IN);
                const refreshToken = getRefreshToken({_id:result._id})

              if(refreshToken){
                user.refreshToken[refreshTokenIndex] = {refreshToken};
                    user.save().then(()=>{
                      res.json({
                          success:true,
                          token,
                          refreshToken
                      })
                    }).catch(err=>res.status(500).json({error:err}))
                }else{
                    res.status(500).json({ error: 'Error generating refreshToken' });
                }}
                else{
                    res.status(401).json({error:'Unauthorized Refresh Token , please login again'})
                }
            })
        }else{
            res.status(401).json({error:'Unauthorized Refresh Token'})
        }
    })
})

router.get('/logout',(req,res)=>{
    req.logOut((err,user)=>{
        res.json({
            success:true,
            page:'logout'
        })
    });
    
})





module.exports = router;