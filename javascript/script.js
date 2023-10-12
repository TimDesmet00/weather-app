const inputCity = document.getElementById("city");
const btnCity = document.getElementById("btn-city");
const dailyAverages = [];
const apiKey = "8c8a54427b5d60c0d66c1eac58dbdc26";

btnCity.addEventListener("click", () => {
  const cityChoice = inputCity.value;
  if (cityChoice) {
    localStorage.setItem("selectedCity", cityChoice);

    fetchWeatherData(cityChoice);
  } else {
    alert("Veuillez entrer une ville.");
  }
});

async function fetchWeatherData(city) {
  try {
    if (!apiKey) {
      console.error("La clé API est manquante ou invalide.");
      return;
    }

    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;

    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error("Réponse non valide de l'API");
    }

    const data = await response.json();
    console.log(data);

    const mainWeatherCategory = data.list[0].weather[0].main;

    const answerApiSection = document.getElementById("answer-api");
    answerApiSection.innerHTML = "";

    const forecastsByDay = {};

    data.list.forEach((forecast) => {
      const date = new Date(forecast.dt * 1000);
      const dayKey = date.toLocaleDateString();

      if (!forecastsByDay[dayKey]) {
        forecastsByDay[dayKey] = [];
      }

      forecastsByDay[dayKey].push(forecast);
    });

    for (const dayKey in forecastsByDay) {
      const forecastList = forecastsByDay[dayKey];

      const averageTemperature = calculateDailyAverageTemperature(forecastList);
      const averageDescription = calculateDailyAverageDescription(forecastList);
      const averageHumidity = calculateDailyAverageHumidity(forecastList);

      const dailyAverage = {
        date: dayKey,
        temperature: averageTemperature,
        main: mainWeatherCategory,
        humidity: averageHumidity,
      };

      dailyAverages.push(dailyAverage);
    }

    dailyAverages.forEach((dailyAverage) => {
      const averageDiv = createDailyAverageElement(dailyAverage);
      answerApiSection.appendChild(averageDiv);
    });

    generateChart();
  } catch (error) {
    console.error("Erreur lors de la récupération des données météo", error);
  }
}

const calculateDailyAverageTemperature = (forecastList) => {
  const totalTemperature = forecastList.reduce(
    (accumulator, forecast) => accumulator + forecast.main.temp,
    0
  );
  const averageTemperatureKelvin = totalTemperature / forecastList.length;
  const averageTemperatureCelcius = (averageTemperatureKelvin - 273.15).toFixed(
    1
  );
  return averageTemperatureCelcius;
};

const calculateDailyAverageDescription = (forecastList) => {
  const descriptionCounts = {};
  forecastList.forEach((forecast) => {
    const mainCategory = forecast.weather[0].main;
    descriptionCounts[mainCategory] =
      (descriptionCounts[mainCategory] || 0) + 1;
  });

  let mostFrequentDescription = "";
  let maxCount = 0;
  for (const mainCategory in descriptionCounts) {
    if (descriptionCounts[mainCategory] > maxCount) {
      maxCount = descriptionCounts[mainCategory];
      mostFrequentDescription = mainCategory;
    }
  }

  return mostFrequentDescription;
};

const createDescriptionImageElement = (mainCategory) => {
  const image = document.createElement("img");
  image.classList.add("description-image");

  const codeMapping = {
    "clear sky": "01d",
    "few clouds": "02d",
    "scattered clouds": "03d",
    "broken clouds": "04d",
    "shower rain": "09d",
    rain: "10d",
    thunderstorm: "11d",
    snow: "13d",
    mist: "50d",
  };

  const code = codeMapping[mainCategory.toLowerCase()];

  if (code) {
    image.src = `https://openweathermap.org/img/wn/${code}@2x.png`;
    image.alt = mainCategory;
  } else {
    // Image par défaut, par exemple, "clear sky"
    image.src = "https://openweathermap.org/img/wn/01n@2x.png";
    image.alt = mainCategory;
  }

  return image;
};

const calculateDailyAverageHumidity = (forecastList) => {
  const totalHumidity = forecastList.reduce(
    (accumulator, forecast) => accumulator + forecast.main.humidity,
    0
  );
  const averageHumidity = totalHumidity / forecastList.length;
  return averageHumidity;
};

const createDailyAverageElement = (dailyAverage) => {
  const averageDiv = document.createElement("div");
  averageDiv.classList.add("daily-average");

  const dateP = createDailyInfoElement(`${dailyAverage.date}`, "date");
  const tempP = createDailyInfoElement(
    `${dailyAverage.temperature}°C`,
    "temperature"
  );

  const descriptionImage = createDescriptionImageElement(dailyAverage.main);

  const humidityP = createDailyInfoElement(
    `${dailyAverage.humidity.toFixed(1)}%`,
    "humidity"
  );

  averageDiv.appendChild(dateP);
  averageDiv.appendChild(tempP);
  averageDiv.appendChild(descriptionImage);
  averageDiv.appendChild(humidityP);

  return averageDiv;
};

const createDailyInfoElement = (text, className) => {
  const element = document.createElement("p");
  element.textContent = text;
  element.classList.add(className);
  return element;
};

window.addEventListener("load", () => {
  const savedCity = localStorage.getItem("selectedCity");
  if (savedCity) {
    inputCity.value = savedCity;
    fetchWeatherData(savedCity);
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const generateChartButton = document.getElementById("generateChart");
  generateChartButton.addEventListener("click", () => {
    const chartLabels = dailyAverages.map((average) => average.date);
    const temperatureData = dailyAverages.map((average) => average.temperature);

    const ctx = document.getElementById("temperatureChart").getContext("2d");

    new Chart(ctx, {
      type: "line",
      data: {
        labels: chartLabels,
        datasets: [
          {
            label: "Température moyenne (°C)",
            data: temperatureData,
            borderColor: "rgb(75, 192, 192)",

            fill: false,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  });
});
