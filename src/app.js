let elements = {
  navigator: null,
  Title: null,
  city: null,

  Lat: null,
  Lon: null,

  userLat: null,
  userLon: null,

  Wind: null,
  Humidity: null,
  Pressure: null,
  Temp: null,
  Feelslike: null,
  Sunrise: null,
  Sunset: null,
  Location: null,

  dateHour: null,
  tempHour: null,
  humidityHour: null,
  windSpeedHour: null,

  dateWeek: null,
  tempWeek: null,
  humidityWeek: null,
  windSpeedWeek: null,
};
let stateToday = {
  Location: null,
  Wind: null,
  Humidity: null,
  Pressure: null,
  Temp: null,
  Feelslike: null,
  Sunrise: null,
  Sunset: null,
};
let stateFuture = {
  day: null,
  temp: null,
  humidity: null,
  windSpeed: null,
};

let hoursArray = [];

let weekArray = [];

const changePage = () => {
  elements.navigator.pushPage("views/Hour.html");
};

const changePage2 = (APIKey) => {
  elements.navigator.pushPage("views/10days.html", { data: { key: APIKey } });
};

const changeStyles = (e) => {
  const plat = e.target.checked ? "android" : "ios";
  ons.forcePlatformStyling(plat);
};

const timeConverter = (dt) => {
  var a = new Date(dt * 1000);
  var months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  var year = a.getFullYear();
  var month = months[a.getMonth()];
  var date = a.getDate();
  var hour = a.getHours() < 10 ? "0" + a.getHours() : a.getHours();
  var min = a.getMinutes() < 10 ? "0" + a.getMinutes() : a.getMinutes();
  var sec = a.getSeconds() < 10 ? "0" + a.getSeconds() : a.getSeconds();
  var time = date + " " + month + " " + hour + ":" + min;
  return time;
};

// Notification
const notify = (title, msg) =>
  !msg?.actions
    ? new Notification(title, msg)
    : serviceWorkerNotify(title, msg);

const askPermission = async () => {
  // Is Web Notifications available on the browser
  if (!("Notification" in window)) {
    console.error("Notification API is not available on this device!");
    return false;
  }

  // Did the user previously allow notifications
  if (Notification.permission === "granted") {
    return true;
  }

  // If the user denied or hasn't been asked yet
  if (
    Notification.permission === "denied" ||
    Notification.permission === "default"
  ) {
    try {
      // Ask for permission
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        return true;
      }
      return false;
    } catch (e) {
      console.error("There was an issue acquiring Notification permissions", e);
      return false;
    }
  }
  return false;
};

const notifyBasic = async () => {
  const permission = await askPermission();
  if (permission) {
    const rslt = notify("Forecast fetched");
    console.log("Success!", rslt);
  }
};

//Onsen notification
var showToast = function () {
  ons.notification.toast("Forecast fetched successfully", {
    timeout: 2000,
  });
};

//Location
const onLocateSuccess = (position) => {
  // const coords = position.coords;
  const { coords } = position;

  elements.userLat = coords.latitude;
  elements.userLon = coords.longitude;
  console.log(coords.latitude, coords.longitude);
};

const errors = {
  1: "[PERMISSION_DENIED] Permission was denied to access location services.",
  2: "[POSITION_UNAVAILABLE] The GPS was not able to determine a location",
  3: "[TIMEOUT] The GPS failed to determine a location within the timeout duration",
};

const onLocateFailure = (error) => {
  console.error("Could not access location services!");
  console.error("errors[error.code]", errors[error.code]);
  console.error("error.message", error.message);
};

const userLocate = () => {
  if (!navigator.geolocation) {
    console.log("Geolocation is not supported by your browser!");
  } else {
    navigator.geolocation.getCurrentPosition(onLocateSuccess, onLocateFailure);
  }
};

// Save Data
const saveState = async (name, object) => {
  console.log("saving state:", object);

  try {
    await localforage.setItem(name, object);
  } catch (e) {
    return console.log("error", e);
  }
  console.log("success");
};
const loadState = async () => {
  console.log("loading state");

  await localforage
    .iterate(function (value, key, iterationNumber) {
      if (key == "Today") {
        let text = window.navigator.onLine;
        console.log(text);
        elements.Location = value.Location;
        elements.Feelslike = value.Feelslike;
        elements.Humidity = value.Humidity;
        elements.Pressure = value.Pressure;
        elements.Sunrise = value.Sunrise;
        elements.Sunset = value.Sunset;
        elements.Temp = value.Temp;
        elements.Wind = value.Wind;

        const temp = document.querySelector("#temp");
        const feelslike = document.querySelector("#feelslike");
        const location = document.querySelector("#location");
        const wind = document.querySelector("#wind");
        const humidity = document.querySelector("#humidity");
        const pressure = document.querySelector("#pressure");
        const sunrise = document.querySelector("#sunrise");
        const sunset = document.querySelector("#sunset");

        let locationSub = document.getElementById("type1");
        let tempSub = document.getElementById("type2");
        let feelslikeSub = document.getElementById("type3");
        let windSub = document.getElementById("type4");
        let humiditySub = document.getElementById("type5");
        let pressureSub = document.getElementById("type6");
        let sunriseSub = document.getElementById("type7");
        let sunsetSub = document.getElementById("type8");

        if (
          locationSub &&
          tempSub &&
          feelslikeSub &&
          windSub &&
          humiditySub &&
          pressureSub &&
          sunriseSub &&
          sunsetSub
        ) {
          try {
            location.removeChild(locationSub);
            temp.removeChild(tempSub);
            feelslike.removeChild(feelslikeSub);
            wind.removeChild(windSub);
            humidity.removeChild(humiditySub);
            pressure.removeChild(pressureSub);
            sunrise.removeChild(sunriseSub);
            sunset.removeChild(sunsetSub);
          } catch (e) {
            console.log(e);
          }
        }

        if (
          elements.Location &&
          elements.Feelslike &&
          elements.Humidity &&
          elements.Pressure &&
          elements.Sunrise &&
          elements.Sunset &&
          elements.Temp &&
          elements.Wind
        ) {
          location.appendChild(
            ons.createElement(
              `<ons-list-item id="type1"><p>${elements.Location}</p></ons-list-item>`
            )
          );
          temp.appendChild(
            ons.createElement(
              `<ons-list-item id="type2"><p>${elements.Temp}</p></ons-list-item>`
            )
          );
          feelslike.appendChild(
            ons.createElement(
              `<ons-list-item id="type3"><p>${elements.Feelslike}</p></ons-list-item>`
            )
          );
          wind.appendChild(
            ons.createElement(
              `<ons-list-item id="type4"><p>${elements.Wind}</p></ons-list-item>`
            )
          );
          humidity.appendChild(
            ons.createElement(
              `<ons-list-item id="type5"><p>${elements.Humidity}</p></ons-list-item>`
            )
          );
          pressure.appendChild(
            ons.createElement(
              `<ons-list-item id="type6"><p>${elements.Pressure}</p></ons-list-item>`
            )
          );
          sunrise.appendChild(
            ons.createElement(
              `<ons-list-item id="type7"><p>${elements.Sunrise}</p></ons-list-item>`
            )
          );
          sunset.appendChild(
            ons.createElement(
              `<ons-list-item id="type8"><p>${elements.Sunset}</p></ons-list-item>`
            )
          );
        } else if (key == "hour") {
          let rowCount = 1;
          const list = document.querySelector("#tableHourly");
          function removeAllChildNodes(parent) {
            while (parent.firstChild) {
              parent.removeChild(parent.firstChild);
            }
          }

          try {
            console.log("test1");
            value.forEach(() => {
              let row = document.getElementById(`${rowCount}`);
              console.log(row);
              console.log(rowCount);
              removeAllChildNodes(row);
              rowCount += 1;
            });
          } catch (e) {
            console.log(e);
          }

          let count = 1;
          value.forEach((el) => {
            elements.dateHour = el.day;
            elements.tempHour = el.temp;
            elements.humidityHour = el.humidity;
            elements.windSpeedHour = el.windSpeed;

            list.appendChild(
              ons.createElement(`
              <ons-row id= "${count}">
              <ons-col  width="100px">${elements.dateHour}</ons-col>
              <ons-col  width="60px">${elements.tempHour}</ons-col>
              <ons-col >${elements.humidityHour}</ons-col>
              <ons-col >${elements.windSpeedHour}</ons-col>
            </ons-row>
                `)
            );
            count++;
          });
        } else if (key == "week") {
          // const progressBar = document.querySelector("#progress-bar");
          // progressBar.remove();
          let rowCount = 1;
          const list1 = document.querySelector("#tableDays");
          function removeAllChildNodes(parent) {
            while (parent.firstChild) {
              parent.removeChild(parent.firstChild);
            }
          }

          try {
            console.log("test1");
            value.forEach(() => {
              let row = document.getElementById(`${rowCount}`);
              console.log(row);
              console.log(rowCount);
              removeAllChildNodes(row);
              rowCount += 1;
            });
          } catch (e) {
            console.log(e);
          }

          try {
            let count = 1;
            value.forEach((el) => {
              elements.dateWeek = el.day;
              elements.tempWeek = el.temp;
              elements.humidityWeek = el.humidity;
              elements.windSpeedWeek = el.windSpeed;

              list1.appendChild(
                ons.createElement(`
              <ons-row id = "${count}">
              <ons-col  width="100px">${elements.dateWeek}</ons-col>
              <ons-col  width="60px">${elements.tempWeek}</ons-col>
              <ons-col >${elements.humidityWeek}</ons-col>
              <ons-col >${elements.windSpeedWeek}</ons-col>
            </ons-row>
                `)
              );
              count++;
            });
          } catch (err) {
            console.log(err);
          }
        }
      }
    })
    .then(function () {
      console.log("Iteration has completed");
    })
    .catch(function (err) {
      // This code runs if there were any errors
      console.log(err);
    });
};

const serviceWorkerNotify = async (title, msg) => {
  const registration = await navigator.serviceWorker.ready;
  if (registration) return registration.showNotification(title, msg);
};

const notifynotification = (title, msg) =>
  !msg?.actions
    ? new Notification(title, msg)
    : serviceWorkerNotify(title, msg);

const Permission = async () => {
  // Is Web Notifications available on the browser
  if (!("Notification" in window)) {
    console.error("Notification API is not available on this device!");
    return false;
  }

  // Did the user previously allow notifications
  if (Notification.permission === "granted") {
    return true;
  }

  // If the user denied or hasn't been asked yet
  if (
    Notification.permission === "denied" ||
    Notification.permission === "default"
  ) {
    try {
      // Ask for permission
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        return true;
      }
      return false;
    } catch (e) {
      console.error("There was an issue acquiring Notification permissions", e);
      return false;
    }
  }
  return false;
};
const notifyActions = async () => {
  const permission = await Permission();
  if (permission) {
    const title = "Weather Notification";
    const msg = {
      badge: "icon.png",
      tag: "weather-notification",
      icon: "icon.png",
      image: "icon.png",
      body: "You have checked weather application recently!",
      actions: [
        { action: "accept", title: "Accept", icon: "yes.png" },
        { action: "decline", title: "Decline", icon: "no.png" },
      ],
    };
    const rslt = notifynotification(title, msg);
    console.log("Success!", rslt);
  }
};

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js");
}

// window.addEventListener("online", saveState())
window.addEventListener("offline", () => loadState());

document.addEventListener("init", (e) => {
  if (e.target.id === "home") {
    elements = {
      navigator: document.querySelector("#navigator"),
    };
    ons.preload(["views/Hour.html"]);
    ons.preload(["views/10days.html"]);

    //const APIKey = "102e73626aa2853fb59c4f3e115f3a6c"
    const APIKey = "89f969d82495b2f3d4991f118ae932e3";

    const locate = document.getElementById("locateBtn");
    locate.addEventListener("click", () => {
      notifyActions();
      City = document.getElementById("city").value;

      let url = `https://api.openweathermap.org/data/2.5/weather?q=${City}&appid=${APIKey}&units=metric`;
      const get = async () => {
        // do the API call and get JSON response
        // const image = document.querySelector('#imgContainer')
        const temp = document.querySelector("#temp");
        const feelslike = document.querySelector("#feelslike");
        const location = document.querySelector("#location");
        const wind = document.querySelector("#wind");
        const humidity = document.querySelector("#humidity");
        const pressure = document.querySelector("#pressure");
        const sunrise = document.querySelector("#sunrise");
        const sunset = document.querySelector("#sunset");

        const response = await fetch(url);

        const weather = await response.json();
        showToast();
        console.log(weather);

        elements.Lat = weather.coord.lat;
        elements.Lon = weather.coord.lon;

        elements.Wind = weather.wind.speed + " " + "m/s";
        elements.Humidity = weather.main.humidity + " " + "%";
        elements.Pressure = weather.main.pressure + " " + "hPa";
        elements.Temp = weather.main.temp + " " + "°C";
        elements.Feelslike = weather.main.feels_like + " " + "°C";
        elements.Sunrise = timeConverter(weather.sys.sunrise);
        elements.Sunset = timeConverter(weather.sys.sunset);
        elements.Location = weather.name;

        // save data
        stateToday.Wind = elements.Wind;
        stateToday.Humidity = elements.Humidity;
        stateToday.Pressure = elements.Pressure;
        stateToday.Temp = elements.Temp;
        stateToday.Feelslike = elements.Feelslike;
        stateToday.Sunrise = elements.Sunrise;
        stateToday.Sunset = elements.Sunset;
        stateToday.Location = elements.Location;
        saveState("Today", stateToday);

        let locationSub = document.getElementById("type1");
        let tempSub = document.getElementById("type2");
        let feelslikeSub = document.getElementById("type3");
        let windSub = document.getElementById("type4");
        let humiditySub = document.getElementById("type5");
        let pressureSub = document.getElementById("type6");
        let sunriseSub = document.getElementById("type7");
        let sunsetSub = document.getElementById("type8");

        if (
          locationSub &&
          tempSub &&
          feelslikeSub &&
          windSub &&
          humiditySub &&
          pressureSub &&
          sunriseSub &&
          sunsetSub
        ) {
          location.removeChild(locationSub);
          temp.removeChild(tempSub);
          feelslike.removeChild(feelslikeSub);
          wind.removeChild(windSub);
          humidity.removeChild(humiditySub);
          pressure.removeChild(pressureSub);
          sunrise.removeChild(sunriseSub);
          sunset.removeChild(sunsetSub);
        }

        // image.appendChild(ons.createElement(`<img src='assets/images/pokemon/${order}.png' style="width: 100%"/>`))
        location.appendChild(
          ons.createElement(
            `<ons-list-item id="type1"><p>${elements.Location}</p></ons-list-item>`
          )
        );
        temp.appendChild(
          ons.createElement(
            `<ons-list-item id="type2"><p>${elements.Temp}</p></ons-list-item>`
          )
        );
        feelslike.appendChild(
          ons.createElement(
            `<ons-list-item id="type3"><p>${elements.Feelslike}</p></ons-list-item>`
          )
        );
        wind.appendChild(
          ons.createElement(
            `<ons-list-item id="type4"><p>${elements.Wind}</p></ons-list-item>`
          )
        );
        humidity.appendChild(
          ons.createElement(
            `<ons-list-item id="type5"><p>${elements.Humidity}</p></ons-list-item>`
          )
        );
        pressure.appendChild(
          ons.createElement(
            `<ons-list-item id="type6"><p>${elements.Pressure}</p></ons-list-item>`
          )
        );
        sunrise.appendChild(
          ons.createElement(
            `<ons-list-item id="type7"><p>${elements.Sunrise}</p></ons-list-item>`
          )
        );
        sunset.appendChild(
          ons.createElement(
            `<ons-list-item id="type8"><p>${elements.Sunset}</p></ons-list-item>`
          )
        );
      };
      get();

      if (elements.Temp && elements.Location) {
        let shareButton = document.getElementById("shareBtn");
        shareButton.addEventListener("click", () => {
          if (navigator.share) {
            navigator
              .share({
                title: "Today Weather",
                text: `Your current location is ${elements.Location} and the temperature is ${elements.Temp}. Please check more informaiton in attached link`,
                url: "https://louis-2307.github.io/Final-Project-Web/",
              })
              .then(() => console.log("Successful share"))
              .catch((error) => console.log("Error sharing", error));
          }
        });
      }
    });
    try {
      const nextButton = document.getElementById("nextBtn");
      nextButton.addEventListener("click", () => {
        elements.navigator.pushPage("views/Hour.html", {
          data: { key: APIKey },
        });
        // window.addEventListener('offline', () => loadState())
      });
    } catch (err) {
      console.log(err);
    }
  }

  if (e.target.id === "hour") {
    //loadState()

    ons.preload(["views/10days.html"]);
    const APIKey = e.target.data.key;

    let url = null;

    if (elements.Lat == null && elements.Lon == null) {
      url = `https://api.openweathermap.org/data/2.5/onecall?lat=${elements.userLat}&lon=${elements.userLon}&units=metric&exclude=minutely&appid=${APIKey}`;
    } else {
      url = `https://api.openweathermap.org/data/2.5/onecall?lat=${elements.Lat}&lon=${elements.Lon}&units=metric&exclude=minutely&appid=${APIKey}`;
    }

    const progressBar = document.querySelector("#progress-bar");
    if (APIKey) {
      const subget = async () => {
        try {
          const subresponse = await fetch(url);
          if (subresponse.ok) {
            progressBar.remove();
          }
          const subjson = await subresponse.json();
          console.log(subjson);
          const hourlyForecast = subjson.hourly;

          let rowCount = 1;
          let list = document.querySelector("#tableHourly");
          function removeAllChildNodes(parent) {
            while (parent.firstChild) {
              parent.removeChild(parent.firstChild);
            }
          }

          try {
            //console.log('test')
            hourlyForecast.forEach(() => {
              let row = document.getElementById(`${rowCount}`);
              //console.log(row)
              //console.log(rowCount)
              removeAllChildNodes(row);
              rowCount += 1;
            });
          } catch (e) {
            console.log(e);
          }

          hoursArray = [];
          let count = 1;
          hourlyForecast.forEach((el) => {
            elements.dateHour = timeConverter(el.dt);
            elements.tempHour = el.temp;
            elements.humidityHour = el.humidity;
            elements.windSpeedHour = el.wind_speed;
            // console.log(
            //   date + " hrs " + temp + "°C " + humidity + "% " + windSpeed + "m/s"
            // );

            // save data
            hoursArray.push({
              day: elements.dateHour,
              temp: elements.tempHour,
              humidity: elements.humidityHour,
              windSpeed: elements.windSpeedHour,
            });
            saveState("hour", hoursArray);

            list.appendChild(
              ons.createElement(`
          <ons-row id= ${count}>
            <ons-col  width="100px">${elements.dateHour}</ons-col>
            <ons-col  width="60px">${elements.tempHour}</ons-col>
            <ons-col >${elements.humidityHour}</ons-col>
            <ons-col >${elements.windSpeedHour}</ons-col>
          </ons-row>
              `)
            );
            count++;
          });
        } catch (err) {
          console.log(err);
        }
      };
      subget();
    }
    try {
      const nextButton = document.getElementById("nextBtn1");
      nextButton.addEventListener("click", () => {
        changePage2(APIKey);
        //window.addEventListener('offline', () => loadState())
      });
    } catch (err) {
      console.log(err);
    }
  }
  if (e.target.id === "10days") {
    //loadState();

    ons.preload(["views/10days.html"]);
    const APIKey = e.target.data.key;

    let url = null;

    if (elements.Lat == null && elements.Lon == null) {
      url = `https://api.openweathermap.org/data/2.5/onecall?lat=${elements.userLat}&lon=${elements.userLon}&units=metric&exclude=minutely&appid=${APIKey}`;
    } else {
      url = `https://api.openweathermap.org/data/2.5/onecall?lat=${elements.Lat}&lon=${elements.Lon}&units=metric&exclude=minutely&appid=${APIKey}`;
    }

    const progressBar = document.querySelector("#progress-bar");
    if (APIKey) {
      const subget = async () => {
        try {
          const subresponse = await fetch(url);
          if (subresponse.ok) {
            progressBar.remove();
          }
          const subjson = await subresponse.json();
          console.log(subjson);

          const dailyForecast = subjson.daily;

          let rowCount = 1;
          const list1 = document.querySelector("#tableDays");
          function removeAllChildNodes(parent) {
            while (parent.firstChild) {
              parent.removeChild(parent.firstChild);
            }
          }

          try {
            //console.log('test1')
            dailyForecast.forEach(() => {
              let row = document.getElementById(`${rowCount}`);
              // console.log(row)
              //console.log(rowCount)
              removeAllChildNodes(row);
              rowCount += 1;
            });
          } catch (e) {
            console.log(e);
          }

          weekArray = [];
          let count = 1;
          dailyForecast.forEach((el) => {
            elements.dateWeek = timeConverter(el.dt);
            elements.tempWeek = el.temp.day;
            elements.humidityWeek = el.humidity;
            elements.windSpeedWeek = el.wind_speed;
            console.log(
              elements.dateWeek +
                " hrs " +
                elements.tempWeek +
                "°C " +
                elements.humidityWeek +
                "% " +
                elements.windSpeedWeek +
                "m/s"
            );

            // save data
            weekArray.push({
              day: elements.dateWeek,
              temp: elements.tempWeek,
              humidity: elements.humidityWeek,
              windSpeed: elements.windSpeedWeek,
            });
            saveState("week", weekArray);

            list1.appendChild(
              ons.createElement(`
          <ons-row id= ${count}>
            <ons-col  width="100px">${elements.dateWeek}</ons-col>
            <ons-col  width="60px">${elements.tempWeek}</ons-col>
            <ons-col >${elements.humidityWeek}</ons-col>
            <ons-col >${elements.windSpeedWeek}</ons-col>
          </ons-row>
              `)
            );
            count++;
          });
        } catch (err) {
          console.log(err);
        }
      };
      subget();
    }
  }
});

const popPage = () => elements.navigator.popPage();
// Padd the history with an extra page so that we don't exit right away
window.addEventListener("load", () => window.history.pushState({}, ""));
// When the browser goes back a page, if our navigator has more than one page we pop the page and prevent the back event by adding a new page
// Otherwise we trigger a second back event, because we padded the history we need to go back twice to exit the app.
window.addEventListener("popstate", () => {
  const { pages } = elements.navigator;
  if (pages && pages.length > 1) {
    popPage();
    window.history.pushState({}, "");
  } else {
    window.history.back();
  }
});
