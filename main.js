const express = require("express");
const puppeteer = require("puppeteer");
const axios = require("axios");
var fs = require("fs");
const app = express();

const XLSX = require("xlsx");

let baseUrl =
  "https://3jmnwr0xu4.execute-api.ap-south-1.amazonaws.com/prod/api";

async function scrapeHotelDetails(title) {
  const browser = await puppeteer.launch({
    headless: false,
    args: ["--no-sandbox"],
  });
  const page = await browser.newPage();
  const Data = [];
  const hotelName = title;
  const searchQuery = `https://www.google.com/maps/search/${encodeURIComponent(
    hotelName
  )}`;
  await page.goto(searchQuery);
  try {
    await page.waitForSelector(".hfpxzc");
    await page.click(".hfpxzc");

    await page.waitForSelector("div.TIHn2 div div.lMbq3e div:nth-child(1) h1");
    const Name = await page.$eval(
      "div.TIHn2 div div.lMbq3e div:nth-child(1) h1",
      (element) => element.textContent.trim()
    );
    Data.push(Name);

    await page.waitForSelector(
      "div:nth-child(11) div:nth-child(3) button div div.rogA2c div.Io6YTe.fontBodyMedium"
    );
    const address = await page.$eval(
      "div:nth-child(11) div:nth-child(3) button div div.rogA2c div.Io6YTe.fontBodyMedium",
      (element) => element.textContent.trim()
    );
    Data.push(address);

    await page.waitForSelector(
      "div:nth-child(11) div:nth-child(5) button div div.rogA2c div.Io6YTe.fontBodyMedium"
    );
    const phoneNumber = await page.$eval(
      "div:nth-child(11) div:nth-child(5) button div div.rogA2c div.Io6YTe.fontBodyMedium",
      (element) => element.textContent.trim()
    );
    Data.push(phoneNumber);

    await page.waitForSelector(
      "div:nth-child(3) div div button:nth-child(4) div.LRkQ2 div.Gpq6kf.fontTitleSmall"
    );
    await page.click(
      "div:nth-child(3) div div button:nth-child(4) div.LRkQ2 div.Gpq6kf.fontTitleSmall",
      { delay: 100 }
    );

    await page.waitForSelector(
      "div.m6QErb.DxyBCb.kA9KIf.dS8AEf div.QoXOEc div div span"
    );
    const facilities = await page.$$eval(
      "div.m6QErb.DxyBCb.kA9KIf.dS8AEf div.QoXOEc div div span",
      (elements) => {
        return elements.map((element) => element.innerText);
      }
    );

    Data.push(facilities);
    // console.log(Data);
  } catch (error) {
    console.log(error);
  }
  try {
    await page.waitForSelector("div.TIHn2 div div.lMbq3e div:nth-child(1) h1");
    const Name = await page.$eval(
      "div.TIHn2 div div.lMbq3e div:nth-child(1) h1",
      (element) => element.textContent.trim()
    );
    Data.push(Name);

    await page.waitForSelector(
      "div:nth-child(15) div:nth-child(3) button div div.rogA2c div.Io6YTe.fontBodyMedium"
    );

    const address = await page.$eval(
      "div:nth-child(15) div:nth-child(3) button div div.rogA2c div.Io6YTe.fontBodyMedium",
      (element) => element.textContent.trim()
    );
    Data.push(address);

    await page.waitForSelector(
      "div:nth-child(15) div:nth-child(5) button div div.rogA2c div.Io6YTe.fontBodyMedium"
    );
    const phoneNumber = await page.$eval(
      "div:nth-child(15) div:nth-child(5) button div div.rogA2c div.Io6YTe.fontBodyMedium",
      (element) => element.textContent.trim()
    );
    Data.push(phoneNumber);

    await page.waitForSelector(
      "div:nth-child(3) div div button:nth-child(4) div.LRkQ2 div.Gpq6kf.fontTitleSmall"
    );
    await page.click(
      "div:nth-child(3) div div button:nth-child(4) div.LRkQ2 div.Gpq6kf.fontTitleSmall",
      { delay: 100 }
    );

    await page.waitForSelector(
      "div.m6QErb.DxyBCb.kA9KIf.dS8AEf div.QoXOEc div div span"
    );
    const facilities = await page.$$eval(
      "div.m6QErb.DxyBCb.kA9KIf.dS8AEf div.QoXOEc div div span",
      (elements) => {
        return elements.map((element) => element.innerText);
      }
    );

    Data.push("Amenities:", facilities);
    // console.log(Data);
  } catch (error) {
    console.log(error);
  }
  try {
    await page.waitForSelector("div.TIHn2 div div.lMbq3e div:nth-child(1) h1");
    const Name = await page.$eval(
      "div.TIHn2 div div.lMbq3e div:nth-child(1) h1",
      (element) => element.textContent.trim()
    );
    Data.push(Name);

    await page.waitForSelector(
      "div:nth-child(11) div:nth-child(3) button div div.rogA2c div.Io6YTe.fontBodyMedium"
    );
    const address = await page.$eval(
      "div:nth-child(11) div:nth-child(3) button div div.rogA2c div.Io6YTe.fontBodyMedium",
      (element) => element.textContent.trim()
    );
    Data.push(address);

    await page.waitForSelector(
      "div:nth-child(11) div:nth-child(5) button div div.rogA2c div.Io6YTe.fontBodyMedium"
    );
    const phoneNumber = await page.$eval(
      "div:nth-child(11) div:nth-child(5) button div div.rogA2c div.Io6YTe.fontBodyMedium",
      (element) => element.textContent.trim()
    );
    Data.push(phoneNumber);

    await page.waitForSelector(
      "div:nth-child(3) div div button:nth-child(4) div.LRkQ2 div.Gpq6kf.fontTitleSmall"
    );
    await page.click(
      "div:nth-child(3) div div button:nth-child(4) div.LRkQ2 div.Gpq6kf.fontTitleSmall",
      { delay: 100 }
    );

    await page.waitForSelector(
      "div.m6QErb.DxyBCb.kA9KIf.dS8AEf div.QoXOEc div div span"
    );
    const facilities = await page.$$eval(
      "div.m6QErb.DxyBCb.kA9KIf.dS8AEf div.QoXOEc div div span",
      (elements) => {
        return elements.map((element) => element.innerText);
      }
    );

    Data.push("Amenities:", facilities);
    // console.log(Data);
    return Data;
  } catch (error) {
    console.log(error);
  } finally {
    if (browser) {
      await browser.close();
    }
    return Data;
  }
}

async function stayFunc(hotel) {
  console.log("Inside stay func", hotel.title);
  let stayObj = {
    ...hotel,
  };
  let suggestionPath = "/public/get-destinations";
  let url1 = baseUrl + suggestionPath;
  const body = {
    search_text: hotel.title,
    req_timestamp: new Date().toISOString(),
  };
  let response = await axios.post(url1, body);
  let place = response.data.results[0];
  console.log("here", place);
  stayObj = {
    ...stayObj,
    formatted_address: place?.formatted_address,
    location: place?.location,
    stay_name2: place?.name,
    place_id: place?.place_id,
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

  // console.log("stayObj B4 google maps", stayObj);
  /*
  // /* GOOGLE MAPS*/

  // let mapdata = await scrapeHotelDetails(title);
  // // console.log(mapdata);
  // const promise1 = Promise.resolve(mapdata);
  // promise1.then((value) => {
  //   console.log(value, "yash");
  //   stayObj = {
  //     ...stayObj,
  //     hotelDetails: value,
  //   };
  //   console.log("yash", stayObj);
  //   return stayObj;
  // });
  // */
  // console.log("final", stayObj);
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
  let googleImgURL = `http://localhost:5000/flyzy-web/us-central1/scrape/image/?search_text=${title}&results_length=${5}`;
  let response = await axios.get(googleImgURL);

  let photos = response.data.data;

  console.log(photos);
  actObj = { ...actObj, activityImages: photos };
  // console.log("now", actObj);
  return actObj;
}

const workbook = XLSX.readFile(
  "C:/Users/shree balajicomputer/Desktop/intern/grand_scrap/MarketplaceListingsSheet.xlsx"
);

const sheetName = workbook.SheetNames[0]; // Assuming you want to read the first sheet

// Get the sheet data as an array of objects
const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

// Iterate through the rows and make API requests
let hotels = [];
sheetData.forEach((row) => {
  let data = row["stay name"]; // Replace 'YourColumnName' with the actual column name containing the request data
  // console.log(data);
  let currObj = {
    title: row["stay name"],
    price: row["Starting Price"],
    stay_description: row["stay description"],
    star: row["Star"],
    state: row["State"],
    city: row["City"],
  };
  hotels.push(currObj);
});
let ans = [];
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function logHotelNames(hotels) {
  for (const hotel of hotels) {
    await delay(2000);
    // console.log(hotel);
    const title = hotel.title;
    const type = "stay";

    if (type === "stay") {
      // console.log(stayObj);

      try {
        let stayObj = await stayFunc(hotel);
        ans.push(stayObj);
        console.log("success");
        fs.writeFile("stayFile.json", JSON.stringify(ans), (error) => {
          if (error) throw error;
        });
      } catch (error) {
        console.log("err");
      }
    } else if (type === "activity") {
      let activityObj = await activityFunc(title);
      ans.push(activityObj);
      try {
        console.log("success");
        fs.writeFile("activityFile.json", JSON.stringify(ans), (error) => {
          if (error) throw error;
        });
      } catch (error) {
        console.log("err");
      }
    }
  }
}

logHotelNames(hotels);
app.listen(8000, () => console.log("app is listening on port 8000."));
