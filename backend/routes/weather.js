const express = require("express");
const axios = require("axios");

const router = express.Router();

router.get("/:city", async (req, res) => {
    try {
        const city = req.params.city;

        const response = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=YOUR_API_KEY&units=metric`
        );

        const data = response.data;

        res.json({
            city: data.name,
            temperature: data.main.temp,
            condition: data.weather[0].description,
            humidity: data.main.humidity,
            wind: data.wind.speed
        });

    } catch (error) {
        res.status(500).json({ error: "Failed to fetch weather data" });
    }
});

module.exports = router;