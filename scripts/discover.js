// scripts/discover.js

async function loadDestinations() {
  try {
    const response = await fetch('data/destinations.json');
    const data = await response.json();
    const list = document.querySelector('.destination-list');

    data.destinations.forEach(dest => {
      const card = document.createElement('div');
      card.classList.add('destination-card');
      card.innerHTML = `
        <img src="${dest.image}" alt="${dest.name}">
        <h3>${dest.name}</h3>
        <p>${dest.description}</p>
        <p><strong>Best Season:</strong> ${dest.best_season}</p>
        <p><strong>Avg. Price:</strong> $${dest.average_price}</p>
      `;
      list.appendChild(card);
    });
  } catch (err) {
    console.error('Error loading destinations:', err);
  }
}

document.addEventListener('DOMContentLoaded', loadDestinations);
