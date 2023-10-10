const inputCity = document.getElementById("city");
const btnCity = document.getElementById("btn-city");

btnCity.addEventListener("click", () => {
  const cityChoice = inputCity.value;
  if (cityChoice) {
    localStorage.setItem("selectedCity", cityChoice);
    // Effectuez ici l'appel à l'API OpenWeatherMap en utilisant la ville choisie (cityChoice)
    fetchData(cityChoice);
  } else {
    alert("Veuillez entrer une ville.");
  }
});

async function fetchData(city) {
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
        forecastsByDay[dayKey] = forecast;
      }
    });

    // Parcourez les prévisions regroupées par jour et affichez-les
    for (const dayKey in forecastsByDay) {
      const forecast = forecastsByDay[dayKey];

      // Utilisez la fonction createForecastElement pour créer un élément pour chaque prévision
      const forecastDiv = createForecastElement(forecast);

      answerApiSection.appendChild(forecastDiv);
    }
  } catch (error) {
    console.error("Erreur lors de la récupération des données météo", error);
  }
}

// Fonction pour créer un élément de prévision avec les classes appropriées
function createForecastElement(forecast) {
  const date = new Date(forecast.dt * 1000);
  const temperatureKelvin = forecast.main.temp;
  const temperatureCelcius = (temperatureKelvin - 273.15).toFixed(1);
  const description = forecast.weather[0].description;
  const humidity = forecast.main.humidity;

  const forecastDiv = document.createElement("div");
  forecastDiv.classList.add("forecast-item");

  const dateP = createForecastInfoElement(
    "Date: " + date.toLocaleDateString(),
    "date"
  );
  const tempP = createForecastInfoElement(
    "Température: " + temperatureCelcius + "°C",
    "temperature"
  );
  const descriptionP = createForecastInfoElement(
    "Description: " + description,
    "description"
  );
  const humidityP = createForecastInfoElement(
    "Humidité: " + humidity + "%",
    "humidity"
  );

  forecastDiv.appendChild(dateP);
  forecastDiv.appendChild(tempP);
  forecastDiv.appendChild(descriptionP);
  forecastDiv.appendChild(humidityP);

  return forecastDiv;
}

// Fonction pour créer un élément d'information de prévision avec une classe spécifiée
function createForecastInfoElement(text, className) {
  const element = document.createElement("p");
  element.textContent = text;
  element.classList.add(className);
  return element;
}

window.addEventListener("load", () => {
  const savedCity = localStorage.getItem("selectedCity");
  if (savedCity) {
    inputCity.value = savedCity;
    fetchData(savedCity);
  }
});
