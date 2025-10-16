/****************************************************
 * FILE: discover.js
 * ---------------------------------------------
 * PURPOSE: Destination search using local JSON data.
 ****************************************************/

document.addEventListener('DOMContentLoaded', () => {
  const findBtn = document.getElementById('findBtn');
  const destInput = document.getElementById('destInput');
  const resultBox = document.getElementById('resultBox');
  const micBtn = document.getElementById('micBtn');

  // Load destinations.json
  async function loadDestinations() {
    try {
      const response = await fetch('data/destinations.json');
      if (!response.ok) throw new Error('Failed to load destinations.');
      return await response.json();
    } catch (err) {
      console.error('Error loading destination data:', err);
      resultBox.innerHTML = `<p class="error">❌ Could not load destination data.</p>`;
      return [];
    }
  }

  // Event listeners
  if (findBtn) findBtn.addEventListener('click', findDestination);
  if (micBtn) micBtn.addEventListener('click', useSpeech);

  // Find destination based on input
  async function findDestination() {
    const userPrompt = destInput.value.trim().toLowerCase();
    if (!userPrompt) {
      resultBox.innerHTML = '<p>Please describe your ideal getaway.</p>';
      return;
    }

    resultBox.innerHTML = `<h3>🌍 Searching...</h3><p>Finding destinations that match: "${userPrompt}"</p>`;
    findBtn.disabled = true;

    const destinations = await loadDestinations();

    // Simple keyword match
    const matched = destinations.filter(dest => {
      const keywords = `${dest.name} ${dest.region} ${dest.description} ${dest.type}`.toLowerCase();
      return userPrompt.split(' ').some(word => keywords.includes(word));
    });

    if (matched.length > 0) {
      resultBox.innerHTML = renderDestinations(matched);
    } else {
      resultBox.innerHTML = `<h3>😕 No match found</h3><p>Try describing your preferences differently.</p>`;
    }

    findBtn.disabled = false;
  }

  // Render matched destinations
  function renderDestinations(destinations) {
    return `
      <h2>✨ Recommended Destinations</h2>
      <div class="destination-grid">
        ${destinations.map(dest => `
          <div class="destination-card">
            <img src="${dest.image}" alt="${dest.name}">
            <h3>${dest.name}</h3>
            <p><strong>Region:</strong> ${dest.region}</p>
            <p>${dest.description}</p>
            <button class="cta-btn" onclick="window.location.href='booking.html'">Book Now</button>
          </div>
        `).join('')}
      </div>
    `;
  }

  // Speech recognition (Web Speech API)
  function useSpeech() {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Speech Recognition not supported in this browser.');
      return;
    }

    const recognition = new webkitSpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.start();

    recognition.onresult = event => {
      const speechResult = event.results[0][0].transcript;
      destInput.value = speechResult;
      findDestination();
    };

    recognition.onerror = event => {
      console.error('Speech recognition error:', event.error);
      alert('Speech recognition error: ' + event.error);
    };
  }
});
