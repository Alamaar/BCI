
var cloudinary = require('cloudinary').v2;
var { CloudinaryStorage } = require('multer-storage-cloudinary');
var express = require('express');
var multer = require('multer');
const router = express.Router();



// Config 
// Config cloudinary storage for multer-storage-cloudinary
var storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: '/uploads'
  },
});

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