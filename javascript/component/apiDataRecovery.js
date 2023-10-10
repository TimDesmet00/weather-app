import { fetchData } from "./callApi.js";

const weatherData = () => {
  // Appele de fetchData pour récupérer les données météo
  fetchData()
    .then((data) => {
      const temperatureKelvin = data.main.temp;
      const temperatureCelcius = temperatureKelvin - 273.15;
      console.log(`Température actuelle : ${temperatureCelcius.toFixed(1)}°C`);
    })
    .catch((error) => {
      console.error(
        "Une erreur s'est produite lors de la récupération des données.",
        error
      );
    });
};

export { weatherData };
