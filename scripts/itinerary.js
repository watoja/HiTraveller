/****************************************************
 * FILE: itinerary.js
 * ---------------------------------------------
 * PURPOSE: Local Itinerary generation and storage for Saved Trips.
 ****************************************************/
document.addEventListener('DOMContentLoaded', () => {
    const planBtn = document.getElementById('planBtn');
    const clearBtn = document.getElementById('clearBtn');
    const planInput = document.getElementById('planInput');
    const planResult = document.getElementById('planResult');
    const savedList = document.getElementById('savedList');

    // Load saved trips on page load
    loadSavedItineraries(); 

    if (planBtn) {
        planBtn.addEventListener('click', generateItinerary);
    }
    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            planInput.value = '';
            planResult.innerHTML = '';
        });
    }

    async function generateItinerary() {
        const userPlan = planInput.value.trim();

        if (!userPlan) {
            planResult.innerHTML = 'Please describe your trip to generate an itinerary.';
            return;
        }

        planResult.innerHTML = '<h3>📝 Generating Itinerary...</h3><p>Creating a sample itinerary for: "' + userPlan + '"</p>';
        planBtn.disabled = true;

        try {
            // Using mock/local data to generate itinerary
            const itineraryData = mockItineraryGenerator(userPlan);

            planResult.innerHTML = `<h2>✅ Generated Itinerary</h2>${formatItinerary(itineraryData)}`;

            // Add Save Button after generation
            const saveBtn = document.createElement('button');
            saveBtn.id = 'saveItineraryBtn';
            saveBtn.className = 'cta-btn';
            saveBtn.textContent = '💾 Save This Trip';
            saveBtn.addEventListener('click', () => saveItinerary(userPlan, itineraryData));
            
            const btnContainer = document.createElement('div');
            btnContainer.style.marginTop = '15px';
            btnContainer.appendChild(saveBtn);
            planResult.appendChild(btnContainer);

        } catch (error) {
            console.error('Error generating itinerary:', error);
            planResult.innerHTML = '<h3>❌ Error</h3><p>Could not generate itinerary. Details: ' + error.message + '</p>';
        } finally {
            planBtn.disabled = false;
        }
    }

    // --- Mock Itinerary Generator ---
    function mockItineraryGenerator(userPrompt) {
        return `
Day 1: Arrival & Local Sightseeing in ${userPrompt}
- Check-in at recommended hotel
- Visit local landmarks
- Evening free time

Day 2: Explore the Highlights
- Morning city tour
- Lunch at popular local restaurant
- Afternoon outdoor activity

Day 3: Relax & Departure
- Leisure morning
- Souvenir shopping
- Depart for home
        `;
    }

    // Function to render itinerary text
    function formatItinerary(text) {
        let html = text;
        html = html.replace(/^### (.*$)/gim, '<h4>$1</h4>'); 
        html = html.replace(/^## (.*$)/gim, '<h3>$1</h3>'); 
        html = html.replace(/^# (.*$)/gim, '<h2>$1</h2>');   
        html = html.replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>'); 
        html = html.replace(/\n/g, '<br>'); 
        return `<div class="itinerary-output">${html}</div>`;
    }

    // --- Saved Trips (Local Storage) ---
    function loadSavedItineraries() {
        const savedTrips = JSON.parse(localStorage.getItem('savedTrips')) || [];
        savedList.innerHTML = ''; // Clear existing list

        if (savedTrips.length === 0) {
            savedList.innerHTML = '<li>No trips saved yet. Generate one above!</li>';
            return;
        }

        savedTrips.forEach((trip, index) => {
            const newLi = document.createElement('li');
            newLi.innerHTML = `
                <strong>${trip.title}</strong>
                <button class="fav-btn view-btn" data-index="${index}">View</button>
                <button class="fav-btn delete-btn" data-index="${index}" style="background-color: #f44336; margin-left: 5px;">Delete</button>
            `;
            savedList.appendChild(newLi);
        });

        document.querySelectorAll('.view-btn').forEach(button => {
            button.addEventListener('click', (e) => viewItinerary(e.target.dataset.index));
        });
        document.querySelectorAll('.delete-btn').forEach(button => {
            button.addEventListener('click', (e) => deleteItinerary(e.target.dataset.index));
        });
    }

    function saveItinerary(description, content) {
        const title = prompt('Enter a title for your saved trip:');
        if (!title) return;

        const savedTrips = JSON.parse(localStorage.getItem('savedTrips')) || [];
        savedTrips.push({ 
            title: title, 
            description: description, 
            content: content,
            dateSaved: new Date().toLocaleDateString()
        });
        localStorage.setItem('savedTrips', JSON.stringify(savedTrips));
        alert(`Trip "${title}" saved successfully!`);
        loadSavedItineraries();
    }

    function viewItinerary(index) {
        const savedTrips = JSON.parse(localStorage.getItem('savedTrips')) || [];
        const trip = savedTrips[index];

        if (trip) {
            planResult.innerHTML = `
                <h2>📁 ${trip.title} (Saved Trip)</h2>
                <p><strong>Original Request:</strong> <em>${trip.description}</em></p>
                ${formatItinerary(trip.content)}
            `;
            const saveBtn = document.getElementById('saveItineraryBtn');
            if (saveBtn) saveBtn.remove();
        }
    }

    function deleteItinerary(index) {
        if (!confirm('Are you sure you want to delete this trip?')) return;
        
        let savedTrips = JSON.parse(localStorage.getItem('savedTrips')) || [];
        savedTrips.splice(index, 1);
        localStorage.setItem('savedTrips', JSON.stringify(savedTrips));
        alert('Trip deleted.');
        loadSavedItineraries();
    }
});
