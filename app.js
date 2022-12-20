const express = require("express");
// using https to parse JSON data
const https = require("https");
// using body-parser to handle the post requests
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

// content to return on home page request
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

// handling the post requests
app.post("/", function (req, res) {
  // api url
  const query = req.body.cityName;
  const apiKey = "a15a92f60c1aca7cecdc4545e30a7543";
  const unit = "metric";

  const url =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    query +
    "&appid=" +
    apiKey +
    "&units=" +
    unit;

  // function to parse data from API URL
  https.get(url, function (response) {
    console.log(response.statusCode);
    // sending data from API JSON as HTML elements after fetching the data
    response.on("data", function (data) {
      // fetching data from API call
      const weatherData = JSON.parse(data);
      const temp = weatherData.main.temp;
      const description = weatherData.weather[0].description;
      const icon = weatherData.weather[0].icon;
      const imageUrl = "https://openweathermap.org/img/wn/" + icon + "@2x.png";

      // writing content on res and finally sending the whole data
      res.write("<p>The weather is currently " + description + "</p>");
      res.write(
        "<h1>The temperature in " +
          query +
          " is: " +
          temp +
          " degree Celsius</h1>"
      );
      res.write("<img src=" + imageUrl + ">");

      res.send();
    });
  });
});

// starting the server
app.listen(3000, function () {
  console.log("Server started on port 3000");
});
