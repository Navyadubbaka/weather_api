// MAIN FUNCTION (aligned to backend/server.js)
async function getWeather() {
  try {
    const city = document.querySelector(".input").value.trim();

    if (!city) {
      alert("Please enter a city name");
      return;
    }

    // 🔥 CALL BACKEND (NOT external API)
    const response = await fetch(`http://localhost:5000/weather/${city}`);
    const data = await response.json();

    console.log("Backend Data:", data);

    if (data.error) {
      alert(data.error);
      return;
    }

    // 🌆 BASIC INFO (from raw weather data)
    document.getElementById("cityname").innerText = data.name;
    document.getElementById("citytemp").innerText =
      Math.round(data.main.temp - 273.15) + " °C";
    document.getElementById("citydesc").innerText = data.weather[0].description;

    // 📅 DATE & TIME (convert Unix timestamp)
    const dt = new Date(data.dt * 1000);
    document.querySelector(".citydate").innerText = dt.toLocaleDateString();
    document.querySelector(".citytime").innerText = dt.toLocaleTimeString();

    // 🌡️ EXTRA METRICS
    document.querySelector(".pressure").innerText = "Pressure";
    document.querySelector(".pval").innerText = data.main.pressure + " hPa";

    document.querySelector(".humidity").innerText = "Humidity";
    document.querySelector(".hval").innerText = data.main.humidity + " %";

    document.querySelector(".sealevel").innerText = "Sea Level";
    document.querySelector(".sval").innerText = data.main.sea_level
      ? data.main.sea_level + " hPa"
      : "N/A";

    document.querySelector(".grndlevel").innerText = "Ground Level";
    document.querySelector(".gval").innerText = data.main.grnd_level
      ? data.main.grnd_level + " hPa"
      : "N/A";

    // 🌅 SUNRISE / SUNSET (convert Unix timestamps)
    const sunrise = new Date(data.sys.sunrise * 1000);
    const sunset = new Date(data.sys.sunset * 1000);
    document.querySelector(".sunrisetime").innerText =
      sunrise.toLocaleTimeString();
    document.querySelector(".sunsettime").innerText =
      sunset.toLocaleTimeString();

    // 🧪 AQI (from backend aqi data)
    if (data.aqi && data.aqi.list && data.aqi.list[0]) {
      document.querySelector(".AQI").innerText = "AQI";
      document.querySelector(".aqival").innerText = data.aqi.list[0].main.aqi;
      document.querySelector(".so2").innerText = "SO2";
      document.querySelector(".so2val").innerText =
        data.aqi.list[0].components.so2;
      document.querySelector(".co").innerText = "CO";
      document.querySelector(".coval").innerText =
        data.aqi.list[0].components.co;
      document.querySelector(".o3").innerText = "O3";
      document.querySelector(".o3val").innerText =
        data.aqi.list[0].components.o3;
    }

    // 📅 5-DAY FORECAST (from backend forecast data)
    if (
      data.forecast &&
      data.forecast.list &&
      data.forecast.list.length >= 40
    ) {
      // Assuming 3-hour intervals, pick every 8th for daily (24h)
      const dailyIndices = [0, 8, 16, 24, 32];
      for (let i = 0; i < 5; i++) {
        const forecastItem = data.forecast.list[dailyIndices[i]];
        if (forecastItem) {
          const date = new Date(forecastItem.dt * 1000);
          document.querySelector(`.day${i + 1}day`).innerText =
            date.toLocaleDateString(undefined, { weekday: "long" });
          document.querySelector(`.day${i + 1}date`).innerText =
            date.toLocaleDateString();
          document.querySelector(`.day${i + 1}deg`).innerText =
            Math.round(forecastItem.main.temp - 273.15) + " °C";
        }
      }
    }

    // 🕒 TODAY HOURLY DATA (from backend forecast list)
    if (data.forecast && data.forecast.list) {
      const slots = [
        ".Nineam",
        ".twelvepm",
        ".threepm",
        ".sixpm",
        ".ninepm",
        ".twelveam",
      ];

      for (let i = 0; i < slots.length && i < data.forecast.list.length; i++) {
        const hourly = data.forecast.list[i];
        if (hourly) {
          document.querySelector(slots[i]).innerText =
            Math.round(hourly.main.temp - 273.15) + " °C";
        }
      }
    }
  } catch (error) {
    console.error(error);
    alert("Error fetching weather data");
  }
}
