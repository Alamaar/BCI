const express = require('express');
const router = express.Router();
const Ajv = require("ajv")
const ajv = new Ajv()
const postingSchema = require('../schemas/postings.schema.json')
const users = require('./users');
const passport = require('passport');
const data = require('./data');

let postCount = 1

const postingSchemaValidator = ajv.compile(postingSchema)


//json Validator for posting actions
function postingsValidator(req, res, next){

    const validatorResult = postingSchemaValidator(req.body)

    if(validatorResult == true){
        next()
    }
   else{
       res.sendStatus(400)
   } 
}

//Create posting
router.post('/', postingsValidator,passport.authenticate('jwt', {session: false}), (req,res)=> {



    const newPostId = postCount++
    const date_ob = new Date()
    const year = date_ob.getFullYear()
    const month = date_ob.getMonth() + 1
    const day = date_ob.getDate()

    // YY:MM:DD
    const currenDate = year + "-" + month + "-" + day

    const newPost = {
        userid : req.user.userid,
        id : newPostId,
        title : req.body.title,
        category : req.body.category,
        location : req.body.location,
        images : req.body.images,
        price : req.body.price,
        posting_date : currenDate,
        delivery: req.body.delivery,
        seller: req.body.seller,
        Description: req.body.Description
      }
        
    data.postings.push(newPost)


   res.json({
       id : newPostId
   })

})


router.param('id', (req,res,next,tagid) => {
    //check if searchedposting id exists and add posting to req
   
    const posting = data.postings.find(posting => (posting.id == tagid))

    if(posting != undefined){
        req.posting = posting
        next()
    }
    else{
        res.sendStatus(404)
    }

} )

//get postings. searh with query options
router.get('/',(req,res) => {

    const city = req.query.city
    const country = req.query.country
    const date = req.query.date
    const category = req.query.category

    let filteredPostings = data.postings


    if(city != undefined){
        filteredPostings = filteredPostings.filter(posting => posting.location.city === city)
    }
    if(country != undefined){
        filteredPostings = filteredPostings.filter(posting => posting.location.country === country)
    }
    if(date != undefined){
        filteredPostings = filteredPostings.filter(posting => posting.posting_date === date)
    } 
    if(category != undefined){
        filteredPostings = filteredPostings.filter(posting => posting.category === category)
    } 

    filteredPostings = postingFilter(filteredPostings)

    res.json(filteredPostings)

})

//get single posting
router.get('/id/:id',(req,res) => {

    //delete user info from posting
    delete req.posting.userid

    res.json(req.posting)
    
})

//Remove user info from postings
function postingFilter(postings){

    const filteredPostings = postings.map(item=>{
        delete item.userid
        return item
      })

    

    return filteredPostings
}
    
//Delete postibng. check logged user is creator
router.delete('/id/:id',passport.authenticate('jwt', {session: false}),(req,res) => {


const userid = req.user.userid
const postid = req.posting.id


if(req.posting.userid === userid){
    data.postings = data.postings.filter(posting => (posting.id != postid))
    res.sendStatus(200)
}
else{
    res.sendStatus(401)
}
})


//Update posting by id, check id matches logged user
router.put('/id/:id',postingsValidator,passport.authenticate('jwt', {session: false}),(req,res) => {

const userid = req.user.userid
const postid = req.posting.id


if(req.posting.userid === userid){
    //delete old post
    data.postings = data.postings.filter(posting => (posting.id !== postid))
    
    //make new post from request

    const newPost = {
        userid : userid,
        id : postid,
        title : req.body.title,
        category : req.body.category,
        location : req.body.location,
        images : req.body.images,
        price : req.body.price,
        posting_date : req.posting.posting_date,
        delivery: req.body.delivery,
        seller: req.body.seller,
        Description: req.body.Description
      }
        
    data.postings.push(newPost)
    
    res.sendStatus(200)

}
else {
    res.sendStatus(401)
    
}


})


module.exports = router