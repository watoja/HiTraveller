import { getFromStorage } from "./storage.js";

const itineraryList = document.querySelector("#itineraryList");

window.addEventListener("DOMContentLoaded", () => {
  const itinerary = getFromStorage("itinerary") || [];
  itineraryList.innerHTML = itinerary.map(item => `<li>${item}</li>`).join("");
});
