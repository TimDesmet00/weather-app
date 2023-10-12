// import { apikey } from "./var.js";

// const getApiKey = () => {
//   let apiKey;
//   console.log("coucou");
//   fetch("./config.json")
//     .then((response) => {
//       if (!response.ok) {
//         throw new Error("La requête a échoué");
//       }
//       console.log("fichier: ", response.json);
//       return response.json();
//     })
//     .then((config) => {
//       console.log("clé de l'api: ", config.value);
//       return (apiKey = config.value);
//     })
//     .catch((error) => {
//       console.error("Erreur lors du chargement de la configuration : ", error);
//     });
// };

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
