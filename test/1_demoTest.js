const chai = require('chai')
const assert = require('assert');
const expect = chai.expect
const chaiHttp = require('chai-http')
chai.use(chaiHttp)
const server = require('../server')
const chaiJsonSchemaAjv = require('chai-json-schema-ajv')
chai.use(chaiJsonSchemaAjv)


const postingSchema = require('../schemas/postings.schema.json')
const postingArraySchema = require('../schemas/postings.array.schema.json')

const addr = 'http://localhost:3000'

//Start server


let token = null

let token2 = null


let postIds = []

const citys = ['Oulu','Tampere','Turku', 'Jyväskylä', 'Rovaniemi']
const categorys = ['Bikes', 'Home', 'Cars', 'Computers', 'Books']





describe('Api test', function() {


    before(function(){
        server.start()
    })
    after(function(){
        server.close()
    })

    describe('Create/login test', function(done) {

        describe('Create user test', function(){
            it('Should create user', function(done){
                chai.request(addr)
                .post('/users')
                .send({
                    username : "Test",
                    password : "Test",
                    firstName : "Test",
                    lastName : "User"

                })
                .end(function(err, res){
                    expect(err).to.be.null
                    expect(res).to.have.status(200)


                    done()
                    
                })

                
            })

            it('Should respond forbidden creating same username', function(done){
                chai.request(addr)
                .post('/users')
                .send({
                    username : "Test",
                    password : "Test",
                    firstName : "Test",
                    lastName : "User"

                })
                .end(function(err, res){
                    expect(res).to.have.status(403)
                    done()
                })


            })

            it('Should not allow wrong input', function(done){
                chai.request(addr)
                .post('/users')
                .send({
                    username : "Test",
                   // password missing
                    firstName : "Test",
                    lastName : "User"

                })
                .end(function(err, res){
                    expect(res).to.have.status(400)
                    done()
                })


            })

            it('Should create second user', function(done){
                chai.request(addr)
                .post('/users')
                .send({
                    username : "Test2",
                    password : "Test2",
                    firstName : "Test2",
                    lastName : "User2"

                })
                .end(function(err, res){
                    expect(res).to.have.status(200)
                    done()
                })


            })


        })

        describe('Login test', function(){
            
            it('Shoul login and return jwt token', function(done){
                chai.request(addr)
                .post('/users/login')
                .send({
                    username : "Test",
                    password : "Test"

                })
                .end(function(err, res){
                    expect(err).to.be.null
                    expect(res).to.have.status(200)
                    
                    token = res.body.token
                    done()
                })



            

        })
    

            it('Should refuse to connect with wrong password', function(done){
                chai.request(addr)
                .post('/users/login')
                .send({
                    username : "Test",
                    password : "wrong password"

                })
                .end(function(err, res){
                    expect(err).to.be.null
                    expect(res).to.have.status(401)
                    
                    done()
                })


            })

            it('Shoul login second account', function(done){
                chai.request(addr)
                .post('/users/login')
                .send({
                    username : "Test2",
                    password : "Test2"

                })
                .end(function(err, res){
                    expect(err).to.be.null
                    expect(res).to.have.status(200)
                    
                    token2 = res.body.token
                    done()
                })

            })



        })
    })

        describe('Posting test', function(){

            describe('Upload image',function(){

                it('Should upload image and return images address',function(done){
                    chai.request(addr)
                    .post('/uploads')
                    .field('file', 'image')
                    .attach('image', './test/test.png', 'test.png')
                    .then((result) => {
                        expect(result).to.have.status(200)
                        expect(result.body.path).to.include('test.png')
                        done()
                        

                    })
                })

                it('Should fail image upload',function(){
                    chai.request(addr)
                    .post('/uploads')
                    .then((result) => {
                        expect(result).to.have.status(400)
                        done()
                    })
                    


                })
            })


            describe('Should create post', function(){
                //Create 5 posts
                for(let i = 0; i < 5; i++){
                it('Should create posts',function(done){
                    chai.request(addr)
                    .post('/postings')
                    .auth(token, {type : 'bearer'})
                    .send({
                            title: "string",
                            category: categorys[i],
                            location: {
                              country: "string",
                              city: citys[i],
                              zip: "string"
                            },
                            images: {
                              images1: "string"
                              
                            },
                            price: "string",
                            posting_date: "string",
                            delivery: "string",
                            seller: {
                              name: "string",
                              number: "string",
                              email: "string",
                              lastname: "string"
                            },
                            Description: "string"

                    })
                    .end(function(err, res){
                        
                        expect(err).to.be.null
                        expect(res).to.have.status(200)
                       

                
                        const id = res.body.id
                        postIds.push(id)

                        done()
                })




                })
            }

                it('Should not create post having missing fields', function(done){
                    chai.request(addr)
                    .post('/postings')
                    .auth(token, {type : 'bearer'})
                    .send({
                            title: "string",
                            category: "string",
                            location: {
                              country: "string",
                              city: "string",
                              zip: "string"
                            },
                            images: {
                              images1: "string"
                              
                            },
                            //price: "string",
                            posting_date: "string",
                            delivery: "string",
                            seller: {
                              name: "string",
                              number: "string",
                              email: "string",
                              lastname: "string"
                            },
                            Description: "string"

                    })
                    .end(function(err, res){  
                        expect(res).to.have.status(400)

                        done()
                })

                })





            })

            describe('Modify post', function(){

                it('Should modify post',function(done){
                    chai.request(addr)
                    .put('/postings/id/' + postIds[0])
                    .auth(token, {type : 'bearer'})
                    .send({
                            title: "string",
                            category: "string",
                            location: {
                              country: "string",
                              city: "string",
                              zip: "string"
                            },
                            images: {
                              images1: "string"
                              
                            },
                            price: "string",
                            posting_date: "string",
                            delivery: "string",
                            seller: {
                              name: "string",
                              number: "string",
                              email: "string",
                              lastname: "string"
                            },
                            Description: "string"

                    })
                    .end(function(err, res){
                        
                        expect(err).to.be.null
                        expect(res).to.have.status(200)

                        done()
                })


                })

                it('Wouldnt allow modifyn post with wrong user', function(done){

                    const url = '/postings/id/' + postIds[0]
                    chai.request(addr)
                    .put(url)
                    .auth(token2, {type : 'bearer'})
                    .send({
                            title: "string",
                            category: "string",
                            location: {
                              country: "string",
                              city: "string",
                              zip: "string"
                            },
                            images: {
                              images1: "string"
                              
                            },
                            price: "string",
                            posting_date: "string",
                            delivery: "string",
                            seller: {
                              name: "string",
                              number: "string",
                              email: "string",
                              lastname: "string"
                            },
                            Description: "string"

                    })
                    .end(function(err, res){
                        
                        expect(err).to.be.null
                        expect(res).to.have.status(401)

                        done()
                })


               


                })

            })


            describe('Delete post',function(){
                it('Would allow delete post with wrong user', function(done){
                    const url = '/postings/id/' + postIds[0]
                    chai.request(addr)
                    .delete(url)
                    .auth(token2, {type : 'bearer'})
                    .send()
                    .end(function(err, res){
                        expect(err).to.be.null
                        expect(res).to.have.status(401)
                        done()



                })
            })

                it('Should delete post with authentication', function(done){
                    const url = '/postings/id/' + postIds[0]
                    chai.request(addr)
                    .delete(url)
                    .auth(token, {type : 'bearer'})
                    .send()
                    .end(function(err, res){
                        expect(err).to.be.null
                        expect(res).to.have.status(200)

                        //delete data from tables
                        citys.shift()
                        categorys.shift()
                        postIds.shift()
                        done()

                    


                })

            })
        })
        describe('Get postings', function(){

            it('Should get post by id', function(done){
                const url = '/postings/id/' + postIds[0]
                chai.request(addr)
                .get(url)
                .end(function(err,res){
                    expect(err).to.be.null
                    expect(res.body).to.be.jsonSchema(postingSchema)
                    done()
                })



            })

        })

            
        describe('Shuold filter postings', function(){

            it('Should only have postings with city 1',function(done){
                chai.request(addr)
                .get('/postings')
                .query({city : citys[0]})
                .end(function(err,res){
                    expect(err).to.be.null;
                    expect(res).to.have.status(200);
                    
                    //check if any other city exist in response
                    let found = false;
                    
                    for(let i=0; i<res.body.length; i++) {

                        if(res.body[i].location.city != citys[0])
                            found = true
                    }

                    if(found == true) {
                        assert.fail('Other citys found')
                    }

                    done()
                    

                })
                    

            })


            it('Should get all postings', function(done){
                chai.request(addr)
                .get('/postings')
                .end(function(err,res){
                    expect(err).to.be.null
                    expect(res.body).to.be.jsonSchema(postingArraySchema)
                    //check all added data is found
                    let found = false

                    for(let i=0; i<res.body.length; i++) {
                        if((res.body[i].location.city != citys[i]) &&
                        (res.body[i].category != categorys[i]) &&
                        (res.body[i].id != postIds[i])){
                            found = true
                            
                        }


                        if(found == true) {
                            assert.fail('Data dosent match')
                        }
                            
                    }




                    done()



            })


        })


        

        })




    })

})
