const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const path = require("path");
const fetch = require("node-fetch");

// cloudinary returns a promise
// this function returns the Cloudinary Upload API response
//it handles deleting the file uploaded via multer if the upload was successful
const uploadImage = async (filename) => {
  // create full file path to uploaded file ../uploads/<filename>
  var uploadedFileName = path.join(__dirname, "..", "uploads", filename);
  // console.log(uploadedFileName);
  try {
    const uploadResponse = await cloudinary.uploader.upload(uploadedFileName, {
      upload_preset: process.env.SIGNED_PRESET,
    });
    // console.log(uploadResponse);

    // delete uploaded file in server space
    console.log("file to delete", uploadedFileName);
    fs.unlink(uploadedFileName, (error) => {
      if (error) {
        console.log("delete error", error);
        throw err;
      }
      console.log("Delete File successfully.");
    });
    // return Cloudinary upload reponse
    return uploadResponse;
  } catch (error) {
    console.log("uploadImage error", JSON.stringify(error, null, 2));
    throw new Error(error);
  }
};

// retrieve a list of all images tagged with LIST_TAG
// this is useful for page load
const galleryImages = async (req, res) => {
  fetchOptimizedImageURLs()
    .then((urls) => {
      // console.log("first url", urls[0]);
      res.json(urls);
    })
    .catch((error) => {
      console.log("galleryImages error", error);
    });
};
const getOptimizedURL = (publicId) => {
  return cloudinary.url(publicId, {
    width: 300,
    height: 200,
    crop: "fill",
    gravity: "auto",
    quality: "auto",
    fetch_format: "auto",
    secure: true,
  });
};
const fetchOptimizedImageURLs = async () => {
  const listDeliveryURL = `https://res.cloudinary.com/${
    cloudinary.config().cloud_name
  }/image/list/${process.env.LIST_TAG}.json`;
  // console.log(listDeliveryURL)
  const response = await fetch(listDeliveryURL);
  const data = await response.json();

  const optimizedImageURLs = [];
  for (let i = 0; i < data.resources.length; i++) {
    optimizedImageURLs.push(getOptimizedURL(data.resources[i].public_id));
  }
  // console.log(JSON.stringify(optimizedImageURLs, null, 2));
  return optimizedImageURLs;
};

const upload = async (req, res) => {
  //use the file that multer attached to the request
  const uploadedFile = req.files.file[0];
  const filename = uploadedFile.filename;
  console.log("filename", filename);
  try {
    const uploadResponse = await uploadImage(filename);
    // console.log(uploadResponse);
    // when upload is successful we create a new URL that we can prepend to the front end gallery
    let newImageURL = getOptimizedURL(uploadResponse.public_id);
    console.log("new image", newImageURL);
    res.json({ url: newImageURL });
    // res.json(uploadResponse);
  } catch (error) {
    console.log("upload error", JSON.stringify(error));
  }
};

module.exports = {
  upload,
  galleryImages,
};
