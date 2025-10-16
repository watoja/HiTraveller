/****************************************************
 * FILE: bookings.js
 * ---------------------------------------------
 * PURPOSE: Booking, Accommodation Finder (Amadeus/Mock) and AI Analysis (OpenAI).
 ****************************************************/
document.addEventListener('DOMContentLoaded', () => {
    const bookBtn = document.getElementById('bookBtn');
    const fromCity = document.getElementById('fromCity');
    const toCity = document.getElementById('toCity');
    const travelDates = document.getElementById('travelDates');
    const flightResults = document.getElementById('flightResults');
    const bookResult = document.getElementById('bookResult');

    // --- ⚠️ INSECURE: YOUR OPENAI API KEY ---
    const OPENAI_API_KEY = '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'; 
    // ------------------------------------------

    if (bookBtn) {
        bookBtn.addEventListener('click', getBookingSuggestions);
    }

    async function getBookingSuggestions() {
        const origin = fromCity.value.trim();
        const destination = toCity.value.trim();
        const dates = travelDates.value.trim();

        if (!origin || !destination || !dates) {
            bookResult.innerHTML = 'Please fill in all travel details.';
            return;
        }

        bookResult.innerHTML = '<h3>Searching...</h3><p>Checking live prices and availability...</p>';
        flightResults.innerHTML = '<h2>Flight & Hotel Suggestions</h2><p>Loading...</p>';
        bookBtn.disabled = true;

        try {
            // =======================================================
            // 💡 AMADEUS API INTEGRATION POINT (MOCK)
            // =======================================================
            // In a real app, this would use Amadeus Flight Offers Search and Hotel Search APIs.
            const bookingData = await mockBookingApiCall(origin, destination, dates);
            
            // =======================================================
            // 💡 OPENAI API INTEGRATION POINT: Summarization/Chatbot
            // =======================================================
            const travelContext = await getOpenAiAnalysis(destination, bookingData);
            
            displayBookingData(bookingData);
            bookResult.innerHTML = `<h3>🤖 AI Trip Analysis for ${destination}</h3>${travelContext}`;

        } catch (error) {
            console.error('Error fetching bookings:', error);
            bookResult.innerHTML = '<h3>❌ Error</h3><p>Failed to retrieve booking information or AI analysis. Details: ' + error.message + '</p>';
        } finally {
            bookBtn.disabled = false;
        }
    }

    // --- OPENAI ANALYSIS FUNCTION ---
    async function getOpenAiAnalysis(destination, bookingData) {
        const prompt = `Analyze the following mock travel data for ${destination} and provide a concise, engaging summary of the best flight and hotel options, including two practical travel tips for this location: ${JSON.stringify(bookingData)}`;
        
        try {
            const API_URL = 'https://api.openai.com/v1/chat/completions';
            
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + OPENAI_API_KEY
                },
                body: JSON.stringify({ 
                    model: "gpt-3.5-turbo",
                    messages: [
                        {"role": "system", "content": "You are a booking analyst providing summary and tips."},
                        {"role": "user", "content": prompt}
                    ],
                    max_tokens: 250
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`OpenAI API Error: ${response.status} - ${errorData.error.message}`);
            }

            const data = await response.json();
            const analysisText = data.choices[0].message.content;

            if (analysisText) {
                 return `
                    <p><strong>AI Insights:</strong></p>
                    <div class="ai-analysis-text">${analysisText.split('\n').map(p => `<p>${p}</p>`).join('')}</div>
                `;
            } else {
                return '<p>No AI analysis could be generated.</p>';
            }

        } catch (error) {
            console.error('OpenAI Analysis error:', error);
            return '<p>Failed to retrieve AI travel analysis. Check your API key or usage limits.</p>';
        }
    }

    // --- MOCK FUNCTION (Simulates Amadeus API data) ---
    function mockBookingApiCall(origin, destination, dates) {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve({
                    flights: [
                        { airline: 'Global Air', price: 450, route: `${origin} to ${destination}`, date: dates },
                        { airline: 'Budget Wings', price: 380, route: `${origin} to ${destination}`, date: dates }
                    ],
                    hotels: [
                        { name: 'Luxury Stay Hotel', price: 150, rating: 5, availability: 'Available' },
                        { name: 'Mid-Range Inn', price: 80, rating: 3, availability: 'Available' }
                    ]
                });
            }, 1000);
        });
    }

    // --- DISPLAY FUNCTION ---
    function displayBookingData(data) {
        let html = '<h2>✈️ Flight Offers</h2><ul>';
        data.flights.forEach(f => {
            html += `<li>${f.airline}: $${f.price} - ${f.route}</li>`;
        });
        html += '</ul>';

        html += '<h2>🏨 Accommodation Finder</h2><ul>';
        data.hotels.forEach(h => {
            html += `<li>${h.name} (${h.rating} stars): $${h.price}/night - ${h.availability}</li>`;
        });
        html += '</ul>';

        flightResults.innerHTML = html;
    }
});