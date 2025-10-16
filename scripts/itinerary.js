/****************************************************
 * FILE: itinerary.js
 * ---------------------------------------------
 * PURPOSE: AI Itinerary generation and local storage for Saved Trips.
 ****************************************************/
document.addEventListener('DOMContentLoaded', () => {
    const planBtn = document.getElementById('planBtn');
    const clearBtn = document.getElementById('clearBtn');
    const planInput = document.getElementById('planInput');
    const planResult = document.getElementById('planResult');
    const savedList = document.getElementById('savedList');

    // --- ⚠️ INSECURE: YOUR OPENAI API KEY ---
    const OPENAI_API_KEY = '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'; 
    // ------------------------------------------
    
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

        planResult.innerHTML = '<h3>🤖 Generating Itinerary...</h3><p>The AI is planning your personalized trip: "' + userPlan + '"</p>';
        planBtn.disabled = true;

        try {
            // =======================================================
            // 💡 OPENAI API DIRECT CALL: Itinerary Generator (Text Generation)
            // =======================================================
            const API_URL = 'https://api.openai.com/v1/chat/completions';
            const prompt = `Generate a detailed, day-by-day travel plan based on the user's prompt: ${userPlan}. Structure the output using clear markdown headings and bulleted lists for readability.`;
            
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + OPENAI_API_KEY
                },
                body: JSON.stringify({ 
                    model: "gpt-3.5-turbo",
                    messages: [
                        {"role": "system", "content": "You are a professional travel planner. Generate a detailed, multi-day itinerary in markdown format."},
                        {"role": "user", "content": prompt}
                    ],
                    max_tokens: 1000 
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`OpenAI API Error: ${response.status} - ${errorData.error.message}`);
            }

            const data = await response.json();
            const aiItinerary = data.choices[0].message.content;

            planResult.innerHTML = `<h2>✅ Generated Itinerary</h2>${formatItinerary(aiItinerary)}`;

            // Add Save Button after successful generation
            const saveBtn = document.createElement('button');
            saveBtn.id = 'saveItineraryBtn';
            saveBtn.className = 'cta-btn';
            saveBtn.textContent = '💾 Save This Trip';
            saveBtn.addEventListener('click', () => saveItinerary(userPlan, aiItinerary));
            
            const btnContainer = document.createElement('div');
            btnContainer.style.marginTop = '15px';
            btnContainer.appendChild(saveBtn);
            planResult.appendChild(btnContainer);

        } catch (error) {
            console.error('Error generating itinerary:', error);
            planResult.innerHTML = '<h3>❌ AI Error</h3><p>Could not generate itinerary. Check your API key or usage limits. Details: ' + error.message + '</p>';
        } finally {
            planBtn.disabled = false;
        }
    }
    
    // Function to render the markdown returned by OpenAI (simple replacement since no framework is used)
    function formatItinerary(markdownText) {
        let html = markdownText;
        html = html.replace(/^### (.*$)/gim, '<h4>$1</h4>'); 
        html = html.replace(/^## (.*$)/gim, '<h3>$1</h3>'); 
        html = html.replace(/^# (.*$)/gim, '<h2>$1</h2>');   
        html = html.replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>'); 
        html = html.replace(/\n/g, '<br>'); 
        return `<div class="ai-markdown-output">${html}</div>`;
    }

    // --- Saved Trips (Local Storage) Functionality ---
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
        loadSavedItineraries(); // Reload the list
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
            // Remove the 'Save' button when viewing a saved trip
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