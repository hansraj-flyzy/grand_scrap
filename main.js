const express = require("express");
const puppeteer = require("puppeteer");
const axios = require("axios");
var fs = require("fs");
const app = express();

const XLSX = require("xlsx");

let baseUrl =
  "https://3jmnwr0xu4.execute-api.ap-south-1.amazonaws.com/prod/api";

async function getImageObjectFromUrl(apiUrl) {
  try {
    const response = await axios.get(apiUrl, {
      maxRedirects: 0,
      validateStatus: function (status) {
        return status >= 200 && status < 303;
      },
    });
    console.log("get to chli", response);
    const preview = response.headers.location;
    console.log("locarion tk bhi pahucha hu", preview, typeof preview);
    const response2 = await axios.get(preview, {
      maxRedirects: 0,
      validateStatus: function (status) {
        return status >= 200 && status < 303;
      },
    });
    console.log("res 2 bhi pahucha hu");
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

async function scrapeHotelDetails() {
  const browser = await puppeteer.launch({
    headless: false,
    args: ["--no-sandbox"],
  });
  const page = await browser.newPage();
  let Data = {};
  const hotelName = "Hotel Green View, Jammu";
  const searchQuery = `https://www.google.com/maps/search/${encodeURIComponent(
    hotelName
  )}`;
  await page.goto(searchQuery);
  try {
    await page.waitForSelector("div.TIHn2 div div.lMbq3e div:nth-child(1) h1");
    const Name = await page.$eval(
      "div.TIHn2 div div.lMbq3e div:nth-child(1) h1",
      (element) => element.textContent.trim()
    );
    Data = {
      ...Data,
      name: Name,
    };

    await page.waitForSelector(
      "div:nth-child(15) div:nth-child(3) button div div.rogA2c div.Io6YTe.fontBodyMedium"
    );

    const address = await page.$eval(
      "div:nth-child(15) div:nth-child(3) button div div.rogA2c div.Io6YTe.fontBodyMedium",
      (element) => element.textContent.trim()
    );
    Data = {
      ...Data,
      address: address,
    };

    await page.waitForSelector(
      "div:nth-child(15) div:nth-child(5) button div div.rogA2c div.Io6YTe.fontBodyMedium"
    );
    const phoneNumber = await page.$eval(
      "div:nth-child(15) div:nth-child(5) button div div.rogA2c div.Io6YTe.fontBodyMedium",
      (element) => element.textContent.trim()
    );
    Data = {
      ...Data,
      phoneNumber: phoneNumber,
    };

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

    Data = {
      ...Data,
      Ammenities: facilities,
    };

    // console.log(Data);
  } catch (error) {
    try {
      await page.waitForSelector(
        "div.TIHn2 div div.lMbq3e div:nth-child(1) h1"
      );
      const Name = await page.$eval(
        "div.TIHn2 div div.lMbq3e div:nth-child(1) h1",
        (element) => element.textContent.trim()
      );
      Data = {
        ...Data,
        name: Name,
      };

      await page.waitForSelector(
        "div:nth-child(11) div:nth-child(3) button div div.rogA2c div.Io6YTe.fontBodyMedium"
      );

      const address = await page.$eval(
        "div:nth-child(11) div:nth-child(3) button div div.rogA2c div.Io6YTe.fontBodyMedium",
        (element) => element.textContent.trim()
      );
      Data = {
        ...Data,
        address: address,
      };

      await page.waitForSelector(
        "div:nth-child(11) div:nth-child(5) button div div.rogA2c div.Io6YTe.fontBodyMedium"
      );
      const phoneNumber = await page.$eval(
        "div:nth-child(11) div:nth-child(5) button div div.rogA2c div.Io6YTe.fontBodyMedium",
        (element) => element.textContent.trim()
      );
      Data = {
        ...Data,
        phoneNumber: phoneNumber,
      };

      await page.waitForSelector(
        "div:nth-child(3) div div button:nth-child(4) div.LRkQ2 div.Gpq6kf.fontTitleSmall"
      );
      await page.click(
        "div:nth-child(3) div div button:nth-child(4) div.LRkQ2 div.Gpq6kf.fontTitleSmall",
        { delay: 100 }
      );
      console.log(Data);
    } catch (error) {
      try {
        await page.waitForSelector(
          "div.TIHn2 div div.lMbq3e div:nth-child(1) h1"
        );
        const Name = await page.$eval(
          "div.TIHn2 div div.lMbq3e div:nth-child(1) h1",
          (element) => element.textContent.trim()
        );
        Data = {
          ...Data,
          name: Name,
        };

        await page.waitForSelector(
          "div:nth-child(11) div:nth-child(3) button div div.rogA2c div.Io6YTe.fontBodyMedium"
        );

        const address = await page.$eval(
          "div:nth-child(11) div:nth-child(3) button div div.rogA2c div.Io6YTe.fontBodyMedium",
          (element) => element.textContent.trim()
        );
        Data = {
          ...Data,
          address: address,
        };
        console.log(Data);
      } catch (error) {
        try {
          await page.waitForSelector(".hfpxzc");
          await page.click(".hfpxzc");

          await page.waitForSelector(
            "div.TIHn2 div div.lMbq3e div:nth-child(1) h1"
          );
          const Name = await page.$eval(
            "div.TIHn2 div div.lMbq3e div:nth-child(1) h1",
            (element) => element.textContent.trim()
          );
          Data = {
            ...Data,
            name: Name,
          };

          await page.waitForSelector(
            "div:nth-child(11) div:nth-child(3) button div div.rogA2c div.Io6YTe.fontBodyMedium"
          );
          const address = await page.$eval(
            "div:nth-child(11) div:nth-child(3) button div div.rogA2c div.Io6YTe.fontBodyMedium",
            (element) => element.textContent.trim()
          );
          Data = {
            ...Data,
            address: address,
          };

          await page.waitForSelector(
            "div:nth-child(11) div:nth-child(5) button div div.rogA2c div.Io6YTe.fontBodyMedium"
          );
          const phoneNumber = await page.$eval(
            "div:nth-child(11) div:nth-child(5) button div div.rogA2c div.Io6YTe.fontBodyMedium",
            (element) => element.textContent.trim()
          );
          Data = {
            ...Data,
            phoneNumber: phoneNumber,
          };

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

          Data = {
            ...Data,
            Ammenities: facilities,
          };
          console.log(Data);
        } catch (error) {
          try {
            await page.waitForSelector(
              "div.TIHn2 div div.lMbq3e div:nth-child(1) h1"
            );
            const Name = await page.$eval(
              "div.TIHn2 div div.lMbq3e div:nth-child(1) h1",
              (element) => element.textContent.trim()
            );
            Data = {
              ...Data,
              name: Name,
            };

            await page.waitForSelector(
              "div:nth-child(15) div:nth-child(3) button div div.rogA2c div.Io6YTe.fontBodyMedium"
            );

            const address = await page.$eval(
              "div:nth-child(15) div:nth-child(3) button div div.rogA2c div.Io6YTe.fontBodyMedium",
              (element) => element.textContent.trim()
            );
            Data = {
              ...Data,
              address: address,
            };

            await page.waitForSelector(
              "div:nth-child(15) div:nth-child(5) button div div.rogA2c div.Io6YTe.fontBodyMedium"
            );
            const phoneNumber = await page.$eval(
              "div:nth-child(15) div:nth-child(5) button div div.rogA2c div.Io6YTe.fontBodyMedium",
              (element) => element.textContent.trim()
            );
            Data = {
              ...Data,
              phoneNumber: phoneNumber,
            };

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

            Data = {
              ...Data,
              Ammenities: facilities,
            };
            console.log(Data);
          } catch (error) {
            await page.waitForSelector(
              "div.TIHn2 div div.lMbq3e div:nth-child(1) h1"
            );
            const Name = await page.$eval(
              "div.TIHn2 div div.lMbq3e div:nth-child(1) h1",
              (element) => element.textContent.trim()
            );
            Data = {
              ...Data,
              name: Name,
            };

            await page.waitForSelector(
              "div:nth-child(11) div:nth-child(3) button div div.rogA2c div.Io6YTe.fontBodyMedium"
            );
            const address = await page.$eval(
              "div:nth-child(11) div:nth-child(3) button div div.rogA2c div.Io6YTe.fontBodyMedium",
              (element) => element.textContent.trim()
            );
            Data = {
              ...Data,
              address: address,
            };

            await page.waitForSelector(
              "div:nth-child(11) div:nth-child(5) button div div.rogA2c div.Io6YTe.fontBodyMedium"
            );
            const phoneNumber = await page.$eval(
              "div:nth-child(11) div:nth-child(5) button div div.rogA2c div.Io6YTe.fontBodyMedium",
              (element) => element.textContent.trim()
            );
            Data = {
              ...Data,
              phoneNumber: phoneNumber,
            };

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

            Data = {
              ...Data,
              Ammenities: facilities,
            };
            return Data;
          }
        }
      }
    }
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
  console.log("stayObj", stayObj);

  /*
  // /* GOOGLE MAPS API*/

  try {
    let mapData = await scrapeHotelDetails();
    stayObj = { ...stayObj, mapData: mapData };
    console.log("map k bd", stayObj);
  } catch (error) {
    console.log("error maps");
  }

  return stayObj;
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
async function ImgObjCreator(photos) {
  console.log("Inside IMGOBJCREATOR");
  let ans = [];
  for (const url of photos) {
    await delay(2000);

    try {
      let imgObj = await getImageObjectFromUrl(url);
      ans.push(imgObj);
      console.log(imgObj, "imgObj");
    } catch (error) {
      console.log("err");
    }
  }
  return ans;
}
async function activityFunc(activity) {
  console.log("Inside activity func", activity.activity_name);
  let actObj = {
    ...activity,
  };

  // console.log("now", actObj);
  let googleImgURL = `http://localhost:5000/flyzy-web/us-central1/scrape/image/?search_text=${
    activity.searchWord
  }&results_length=${2}`;
  let response = await axios.get(googleImgURL);

  let photos = response.data.data;
  actObj = { ...actObj, activityImages: photos };
  // try {
  //   let photosobj = await ImgObjCreator(photos);
  //   console.log(photosobj, "photosObj");

  // } catch (error) {
  //   console.log("ee");
  // }
  // console.log(photos);

  // console.log("now", actObj);
  return actObj;
}

const workbook = XLSX.readFile("MarketplaceListingsSheet2.xlsx");

const staySheet = workbook.SheetNames[0]; // Assuming you want to read the first sheet
const activitySheet = workbook.SheetNames[1];

// Get the sheet data as an array of objects
const staySheetData = XLSX.utils.sheet_to_json(workbook.Sheets[staySheet]);
const activitySheetData = XLSX.utils.sheet_to_json(
  workbook.Sheets[activitySheet]
);

// Iterate through the rows and make API requests
let hotels = [];
staySheetData.forEach((row) => {
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

let activities = [];
activitySheetData.forEach((row) => {
  let currObj = {
    activity_name: row["activity name"],
    package_name: row["package name"],
    searchWord: row["image search keyword"],
    activity_description: row["activity description"],
    inclusion_description: row["inclusion description"],
    state: row["State"],
    Location: row["location"],
    price: row["inclusion price"],
    Remark: row["Remark"],
  };
  activities.push(currObj);
});

async function logHotelNames(hotels) {
  let ans = [];
  for (const hotel of hotels) {
    await delay(2000);
    // console.log(hotel);
    const title = hotel.title;

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
  }
}

async function logActivities(activities) {
  let ans = [];
  for (const activity of activities) {
    await delay(2000);

    try {
      let activityObj = await activityFunc(activity);
      ans.push(activityObj);
      console.log("success");
      fs.writeFile("activityFile.json", JSON.stringify(ans), (error) => {
        if (error) throw error;
      });
    } catch (error) {
      console.log("err");
    }
  }
}
const type = "stay";
if (type === "stay") {
  logHotelNames(hotels);
} else if (type === "activity") {
  logActivities(activities);
}

app.listen(8000, () => console.log("app is listening on port 8000."));
