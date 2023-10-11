const inputCity = document.getElementById("city");
const btnCity = document.getElementById("btn-city");
const dailyAverages = [];
let apiKey;

btnCity.addEventListener("click", () => {
  const cityChoice = inputCity.value;
  if (cityChoice) {
    localStorage.setItem("selectedCity", cityChoice);

    fetchWeatherData(cityChoice);

    fetch("./config.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error("La requête a échoué");
        }
        console.log(response.json);
        return response.json();
      })
      .then((config) => {
        console.log("clé de l'api: ", config.apiKey);
        apiKey = config.apiKey;
      })
      .catch((error) => {
        console.error(
          "Erreur lors du chargement de la configuration : ",
          error
        );
      });
  } else {
    alert("Veuillez entrer une ville.");
  }
});

// async function getApiKey() {
//   try {
//     const response = await fetch("./config.json");
//     if (!response.ok) {
//       throw new Error("Impossible de charger la configuration.");
//     }
//     const config = await response.json();
//     console.log("cle API récupérée :", config.apiKey);
//     if (config && config.apiKey) {
//       return config.apiKey;
//     } else {
//       console.error("Erreur lors de l'accès à la clé API.");
//       return null;
//     }
//   } catch (error) {
//     console.error("Erreur lors du chargement de la configuration : ", error);
//     return null;
//   }
// }

async function fetchWeatherData(city) {
  try {
    const apiKey = await getApiKey();

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
        description: averageDescription,
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
    const description = forecast.weather[0].description;
    descriptionCounts[description] = (descriptionCounts[description] || 0) + 1;
  });

  let mostFrequentDescription = "";
  let maxCount = 0;
  for (const description in descriptionCounts) {
    if (descriptionCounts[description] > maxCount) {
      maxCount = descriptionCounts[description];
      mostFrequentDescription = description;
    }
  }

  return mostFrequentDescription;
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

  const dateP = createDailyInfoElement(`Date: ${dailyAverage.date}`, "date");
  const tempP = createDailyInfoElement(
    `Température: ${dailyAverage.temperature}°C`,
    "temperature"
  );
  const descriptionP = createDailyInfoElement(
    `Description: ${dailyAverage.description}`,
    "description"
  );
  const humidityP = createDailyInfoElement(
    `Humidité: ${dailyAverage.humidity.toFixed(1)}%`,
    "humidity"
  );

  averageDiv.appendChild(dateP);
  averageDiv.appendChild(tempP);
  averageDiv.appendChild(descriptionP);
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
