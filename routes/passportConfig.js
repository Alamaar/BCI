const passport = require('passport')
const LocalStrategy = require('passport-local')
const JwtStrategy = require('passport-jwt').Strategy,
ExtractJwt = require('passport-jwt').ExtractJwt

const data = require('./data')
const bcrypt = require('bcryptjs');

 //JWT check
let jwtValidationOptions = {}
jwtValidationOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
jwtValidationOptions.secretOrKey = (process.env.jwtKey || "Test")


passport.use(new JwtStrategy(jwtValidationOptions, function(jwt_payload, done){

  let user = data.users.find(user => (user.id === jwt_payload.user.userid) )
  
    
  if(user != undefined){
    done(null, jwt_payload.user)
    }
  else{
      
      done(null, false)
    }  

}))


passport.use(new LocalStrategy(function verify(username, password, cb) {

    let user = data.users.find(user => (user.username === username) && bcrypt.compareSync(password, user.password))
  
    if(user != undefined){
      cb(null, user)
    }
    else{
      cb(null, false)
    }
  
  }))

  module.exports = passport