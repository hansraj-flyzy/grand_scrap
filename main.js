const express = require("express");
const axios = require("axios");
var fs = require("fs");
const app = express();

async function getImageObjectFromUrl(apiUrl) {
  try {
    const response = await axios.get(apiUrl);
    const preview = response.headers.location;
    const response2 = await axios.get(preview);
    const type = response2.headers["content-type"];
    const contentDisposition = response2.headers["content-disposition"];
    let name = null;
    if (contentDisposition) {
      const match = contentDisposition.match(/filename="(.+)"/);
      if (match) {
        name = match[1];
      }
    }
    return { preview, type, name };
  } catch (error) {
    console.error(error);
    return null;
  }
}

let baseUrl =
  "https://3jmnwr0xu4.execute-api.ap-south-1.amazonaws.com/prod/api";

const title = "taj";
const type = "activity";
// const type = "stay";

async function stayFunc(title) {
  console.log("Inside stay func", title);
  let stayObj = {};
  let suggestionPath = "/public/get-destinations";
  let url1 = baseUrl + suggestionPath;
  const body = {
    search_text: title,
    req_timestamp: new Date().toISOString(),
  };
  let response = await axios.post(url1, body);
  let place = response.data.results[0];
  //   console.log("here", place);
  stayObj = {
    ...stayObj,
    stay_name: place.name,
    formatted_address: place.formatted_address,
    place_id: place.place_id,
  };
  //   console.log("now", stayObj);
  let photoPath = `/public/place/photos/${stayObj.place_id}`;
  let url2 = baseUrl + photoPath;
  let stayImages = await axios.get(url2);
  let photos = stayImages.data;
  let arr = JSON.stringify(photos);
  //   console.log("here", arr);
  stayObj = {
    ...stayObj,
    stayImages: arr,
  };
  //   console.log("now", stayObj);
  /* GOOGLE MAPS
  let googleMapURL = `http://localhost:6001/${title}`;
  let mapdata = await axios.get(googleMapURL);
  console.log(mapdata.data);
  */
  return stayObj;
}

async function activityFunc(title) {
  console.log("Inside activity func", title);
  let actObj = {};
  actObj = {
    ...actObj,
    activity_name: title,
  };
  // console.log("now", actObj);
  let googleImgURL = `http://localhost:5000/flyzy-web/us-central1/scrape/image/?search_text=${title}&results_length=${1}`;
  let response = await axios.get(googleImgURL);

  let photos = response.data.data;

  console.log(photos);
  /*
  let imgArr = [];
  photos.map((ele) => {
    console.log(ele, typeof ele);
    let curr = getImageObjectFromUrl(ele);
    console.log(curr, "yashi");
    const promise1 = Promise.resolve(curr);
    console.log(curr, "yashi");
    promise1.then((value) => {
      console.log(value, "yash");
      imgArr.push(value);
    });
  });
  console.log(imgArr);
*/
  actObj = { ...actObj, activityImages: photos };
  // console.log("now", actObj);
  return actObj;
}

if (type === "stay") {
  let stayObj = stayFunc(title);
  const promise1 = Promise.resolve(stayObj);

  promise1.then((value) => {
    // console.log(value);
    fs.writeFile("stayFile.json", JSON.stringify(value), (error) => {
      if (error) throw error;
    });
  });
} else if (type === "activity") {
  let activityObj = activityFunc(title);
  const promise1 = Promise.resolve(activityObj);

  promise1.then((value) => {
    // console.log(value);

    fs.writeFile("activityFile.json", JSON.stringify(value), (error) => {
      if (error) throw error;
    });
  });
}

app.listen(8000, () => console.log("app is listening on port 8000."));
