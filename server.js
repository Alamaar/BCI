const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const users = require('./routes/users');
const postings = require('./routes/postings');
const uploads = require('./uploads/uploads')



app.use(bodyParser.json());
app.use('/users', users.router);
app.use('/postings', postings);
app.use('/uploads',uploads.router)


app.set('port', (process.env.PORT || 3000));



app.get('/', (req, res) => {
  res.send('Hello World!')
})


let serverInstance = null





module.exports = {
  start : function(){
    serverInstance = app.listen(app.get('port'), () => {
      console.log(`Example app listening on port ${app.get('port')}`)
    })
  },
  close : function(){

    serverInstance.close()

  }
}



