// import { cityChoice } from "../function/formDataRecovery.js";

const apiKey = "8c8a54427b5d60c0d66c1eac58dbdc26";

const fetchData = (city, callback) => {
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;

  return fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      callback(data);
    })
    .catch((error) => {
      console.error("Erreur lors de la récupération des données météo", error);
    });
};

export { fetchData };
