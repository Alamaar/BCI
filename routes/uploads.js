
var express = require('express');
var multer = require('multer');
const router = express.Router();



// Config 
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})
var upload = multer({ storage: storage })

router.use(express.static(__dirname + '/public'));
router.use('/', express.static('uploads'));


router.post('/', upload.single('image'), function (req, res) {

  
  
  if(req.file !== undefined){
      res.json({
        path : req.file.path
      })

    }else{
      res.sendStatus(400)
    }
})





module.exports.router = router