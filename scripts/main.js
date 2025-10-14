document.querySelector("#subscribeForm").addEventListener("submit", (e) => {
  e.preventDefault();
  alert("Thank you for subscribing to HiTraveller updates!");
  e.target.reset();
});
import { getFromStorage } from "./storage.js";

const itineraryList = document.querySelector("#itineraryList");

window.addEventListener("DOMContentLoaded", () => {
  const itinerary = getFromStorage("itinerary") || [];
  itineraryList.innerHTML = itinerary.map(item => `<li>${item}</li>`).join("");
});

// Mobile Menu Toggle
const hamburger = document.querySelector(".hamburger");
const navLinks = document.querySelector(".nav-links");

hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("active");
  navLinks.classList.toggle("open");
});

// Optional: Close menu when a link is clicked
document.querySelectorAll(".nav-links a").forEach(link =>
  link.addEventListener("click", () => {
    hamburger.classList.remove("active");
    navLinks.classList.remove("open");
  })
);

// Subscription form interaction
const subscribeForm = document.querySelector("#subscribeForm");
if (subscribeForm) {
  subscribeForm.addEventListener("submit", (e) => {
    e.preventDefault();
    alert("✅ Thank you for subscribing to HiTraveller updates!");
    e.target.reset();
  });
}
