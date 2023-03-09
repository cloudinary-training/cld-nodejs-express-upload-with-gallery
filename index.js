require('dotenv').config();
const cloudinary = require('cloudinary').v2;
console.log('cloudinary config:', cloudinary.config().cloud_name);

const express = require('express')
const multer = require('multer');
const routes = require('./routes');

const app = express();

//using the storage option
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './uploads')
  },
  filename: function(req, file, cb) {
    cb(null, file.originalname)
  }
});
const upload = multer({ storage });

// upload.fields is middleware that will add an array named 'file' to req 
// to the request such that req.files['file'][0] would reference 1 file
app.post('/upload', upload.fields([{ name: 'file' }]), routes.upload);

// an api that just fetches uploaded images and returns an array of optimized URLs
app.get('/gallery_images', routes.galleryImages);

app.use(express.static('public'));
// load the files that are in the public directory

app.get('/', (req, res) => {
  res.sendFile('/home/runner/public/index.html')
})

app.listen(3000, () => { // Listen on port 3000
  console.log('Listening! http://localhost:3000') // Log when listen success
})