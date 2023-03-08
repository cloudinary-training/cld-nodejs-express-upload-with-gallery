const renderImages = async (urlList) => {
  // if you get back data, clear the current data
  document.getElementById("gallery").innerHTML = "";

  urlList.map((url) => {
    var div = document.createElement("div");
    var img = document.createElement("img");
    img.src = url;
    div.appendChild(img);
    document.getElementById("gallery").appendChild(div);
  });
};

const renderGalleryImages = async() =>{

  let response = await fetch("/gallery_images", {
    method: "GET"
  });

  // result should be an array of images tagged based on an upload preset
  // used in the backend upload process
  let urlList = await response.json();
  renderImages(urlList);
}

document.addEventListener("DOMContentLoaded", (e) => {
  // load the image gallery when the app loads
  renderGalleryImages();

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
      let urlList = await response.json();
      renderImages(urlList.urls);
    });
});
