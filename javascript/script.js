const inputCity = document.getElementById("city");
const btnCity = document.getElementById("btn-city");
const dailyAverages = [];

btnCity.addEventListener("click", () => {
  const cityChoice = inputCity.value;
  if (cityChoice) {
    localStorage.setItem("selectedCity", cityChoice);
    // Effectuez ici l'appel à l'API OpenWeatherMap en utilisant la ville choisie (cityChoice)
    fetchWeatherData(cityChoice);
  } else {
    alert("Veuillez entrer une ville.");
  }
});

async function fetchWeatherData(city) {
  try {
    const apiKey = "8c8a54427b5d60c0d66c1eac58dbdc26";
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;

    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error("Réponse non valide de l'API");
    }

    const data = await response.json();

    // Effacez le contenu actuel de la section "answer-api"
    const answerApiSection = document.getElementById("answer-api");
    answerApiSection.innerHTML = "";

    // Créez un objet pour stocker les prévisions par jour
    const forecastsByDay = {};

    // Parcourez les données et regroupez-les par jour
    data.list.forEach((forecast) => {
      const date = new Date(forecast.dt * 1000);
      const dayKey = date.toLocaleDateString();

      // Si la date n'existe pas dans l'objet, créez une nouvelle entrée
      if (!forecastsByDay[dayKey]) {
        forecastsByDay[dayKey] = [];
      }

      forecastsByDay[dayKey].push(forecast);
    });

    // Parcourez les prévisions regroupées par jour et calculez les moyennes
    // const dailyAverages = [];
    for (const dayKey in forecastsByDay) {
      const forecastList = forecastsByDay[dayKey];

      // Calcul de la moyenne quotidienne
      const averageTemperature = calculateDailyAverageTemperature(forecastList);
      const averageDescription = calculateDailyAverageDescription(forecastList);
      const averageHumidity = calculateDailyAverageHumidity(forecastList);

      // Créez un objet de moyenne quotidienne
      const dailyAverage = {
        date: dayKey,
        temperature: averageTemperature,
        description: averageDescription,
        humidity: averageHumidity,
      };

      dailyAverages.push(dailyAverage);
    }

    // Affichez les moyennes journalières dans la section "answer-api"
    dailyAverages.forEach((dailyAverage) => {
      const averageDiv = createDailyAverageElement(dailyAverage);
      answerApiSection.appendChild(averageDiv);
    });

    generateChart();
  } catch (error) {
    console.error("Erreur lors de la récupération des données météo", error);
  }
}

// Fonction pour calculer la température moyenne par jour
function calculateDailyAverageTemperature(forecastList) {
  const totalTemperature = forecastList.reduce(
    (accumulator, forecast) => accumulator + forecast.main.temp,
    0
  );
  const averageTemperatureKelvin = totalTemperature / forecastList.length;
  const averageTemperatureCelcius = (averageTemperatureKelvin - 273.15).toFixed(
    1
  );
  return averageTemperatureCelcius;
}

// Fonction pour calculer la description moyenne par jour
function calculateDailyAverageDescription(forecastList) {
  // Vous pouvez mettre en place votre propre logique pour déterminer la description moyenne
  // Par exemple, en comptant combien de fois chaque description apparaît et en retournant la plus fréquente.
  const descriptionCounts = {};
  forecastList.forEach((forecast) => {
    const description = forecast.weather[0].description;
    descriptionCounts[description] = (descriptionCounts[description] || 0) + 1;
  });

  // Trouver la description la plus fréquente
  let mostFrequentDescription = "";
  let maxCount = 0;
  for (const description in descriptionCounts) {
    if (descriptionCounts[description] > maxCount) {
      maxCount = descriptionCounts[description];
      mostFrequentDescription = description;
    }
  }

  return mostFrequentDescription;
}

// Fonction pour calculer l'humidité moyenne par jour
function calculateDailyAverageHumidity(forecastList) {
  const totalHumidity = forecastList.reduce(
    (accumulator, forecast) => accumulator + forecast.main.humidity,
    0
  );
  const averageHumidity = totalHumidity / forecastList.length;
  return averageHumidity;
}

// Fonction pour créer un élément de moyenne quotidienne
function createDailyAverageElement(dailyAverage) {
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
}

// Fonction pour créer un élément d'information de prévision avec une classe spécifiée
function createDailyInfoElement(text, className) {
  const element = document.createElement("p");
  element.textContent = text;
  element.classList.add(className);
  return element;
}

window.addEventListener("load", () => {
  const savedCity = localStorage.getItem("selectedCity");
  if (savedCity) {
    inputCity.value = savedCity;
    fetchWeatherData(savedCity);
  }
});

document.addEventListener("DOMContentLoaded", () => {
  // Ciblez le bouton "Afficher le graphique" et ajoutez un gestionnaire d'événements
  const generateChartButton = document.getElementById("generateChart");
  generateChartButton.addEventListener("click", () => {
    // Récupérez les données nécessaires pour le graphique
    const chartLabels = dailyAverages.map((average) => average.date);
    const temperatureData = dailyAverages.map((average) => average.temperature);

    // Ciblez le canvas pour le graphique
    const ctx = document.getElementById("temperatureChart").getContext("2d");

    // Créez le graphique en utilisant Chart.js
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
