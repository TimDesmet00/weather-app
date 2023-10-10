// import { fetchData } from "./callApi.js";

const weatherData = (data) => {
  if (data) {
    // Appele de fetchData pour récupérer les données météo
    //   fetchData(city)
    // .then((data) => {
    const temperatureKelvin = data.main.temp;
    const temperatureCelcius = temperatureKelvin - 273.15;
    console.log(`Température actuelle : ${temperatureCelcius.toFixed(1)}°C`);
  } else {
    console.error("Aucune donnée n'a été renvoyée par l'API.");
  }
};
//     .catch((error) => {
//       console.error(
//         "Une erreur s'est produite lors de la récupération des données.",
//         error
//       );
//     });
// };

export { weatherData };
