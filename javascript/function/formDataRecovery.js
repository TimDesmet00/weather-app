import { fetchData } from "../component/callApi.js";
import { weatherData } from "../component/apiDataRecovery.js";

const inputCity = document.getElementById("city");
const btnCity = document.getElementById("btn-city");

btnCity.addEventListener("click", () => {
  const cityChoice = inputCity.value;
  if (cityChoice) {
    fetchData(cityChoice, weatherData);
  } else {
    alert("Veuillez entrer une ville.");
  }
});

// export { cityChoice };
