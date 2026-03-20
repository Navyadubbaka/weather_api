require("dotenv").config();

const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const API_KEY = process.env.API_KEY;

app.get("/weather/:city", async (req, res) => {
  try {
    const city = req.params.city;

    // 🌤 CURRENT WEATHER
    const weatherRes = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`
    );

    const data = weatherRes.data;

    // 🌫 AQI
    const aqiRes = await axios.get(
      `https://api.openweathermap.org/data/2.5/air_pollution?lat=${data.coord.lat}&lon=${data.coord.lon}&appid=${API_KEY}`
    );

    // 📅 FORECAST
    const forecastRes = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}`
    );

    const forecast = forecastRes.data;

    // 🔁 SEND RAW + EXTRA (to match your JS)
    res.json({
      // original weather response
      ...data,

      // AQI
      aqi: aqiRes.data,

      // forecast
      forecast: forecast,
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Error fetching data" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});