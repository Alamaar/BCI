const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');
const passport = require('./passportConfig')
const crypto = require('crypto');
const jwt = require('jsonwebtoken')
const usergSchema = require('../schemas/users.schema.json')
const Ajv = require("ajv")
const ajv = new Ajv()
const data = require('./data')

//sercret key
const secretKey = (process.env.jwtKey || "Test")


function passwordCrypt(plainTextPassword){

  const saltRounds = 10;
  const salt = bcrypt.genSaltSync(saltRounds)
  const hash =  bcrypt.hashSync(plainTextPassword, salt)
  return hash
}

users = data.users 

const usersSchemaValidator = ajv.compile(usergSchema)

function usersValidator(req, res, next){

    const validatorResult = usersSchemaValidator(req.body)
    

    if(validatorResult == true){
        next()
    }
   else{
       res.sendStatus(400)
   } 
}


router.post('/login',usersValidator, passport.authenticate('local',{session : false}), (req, res)=> {


  
  const payloadData = {
    user : {
      username : req.user.username,
      userid : req.user.id
    }


  }

  const token = jwt.sign(payloadData, secretKey)

  res.json({token : token})

    
})

router.post('',usersValidator, (req,res)=> {

  //if username exixt
  const username = req.body.username
  let user = data.users.find(user => (user.username === username))

  if(user != undefined){
    res.sendStatus(403)
    
  }
  else{
    const newUser = { 
      id : uuidv4(),
      username : username,
      password : passwordCrypt(req.body.password),
      firstName : req.body.firstName,
      lastName : req.body.lastName
    
    }

    users.push(newUser)

    res.sendStatus(200)
  }
 
})


module.exports.router = router


module.exports.users = users
