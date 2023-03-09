const renderImages = async (urlList) => {
  // if you get back data, clear the current data
  // const transitionGallery = [{opacity: 0},{opacity: 1}];
  // const transitionTiming = {duration: 000};
  document.getElementById("gallery").innerHTML = "";

  // document.getElementById("gallery").animate(
  //   transitionGallery,
  //   transitionTiming
  // )

  urlList.map((url) => {
    var div = document.createElement("div");
    var img = document.createElement("img");
    img.src = url;
    div.appendChild(img);
    document.getElementById("gallery").appendChild(div);
  });
};

const insertNewImage = async(newImageURL)=>{
  var div = document.createElement("div");
  var img = document.createElement("img");
  img.src = newImageURL;
  div.appendChild(img);
  document.querySelector("#gallery").prepend(div);
}

const renderGalleryImages = async () => {
  let response = await fetch("/gallery_images", {
    method: "GET",
  });

  // result should be an array of images tagged based on an upload preset
  // used in the backend upload process
  let urlList = await response.json();
  renderImages(urlList);
};

document.addEventListener("DOMContentLoaded", (e) => {
  // handle submit by uploading and then refreshing gallery
  document
    .getElementById("upload-form")
    .addEventListener("submit", async (e) => {
      e.preventDefault();
      let response = await fetch("/upload", {
        method: "POST",
        body: new FormData(e.target),
      });

      // result should be an array of images tagged based on an upload preset
      // used in the backend upload process
      let uploadedImage = await response.json();
      debugger
      insertNewImage(uploadedImage.url);
    });

  document.getElementById("file-input").addEventListener("change", (e) => {
    document.getElementById("file-submit").removeAttribute("disabled");
  });

  // load the image gallery when the app loads
  renderGalleryImages();
});
