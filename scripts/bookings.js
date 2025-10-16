/****************************************************
 * FILE: bookings.js
 * ---------------------------------------------
 * PURPOSE: Booking, Accommodation Finder (Mock Data).
 ****************************************************/
document.addEventListener('DOMContentLoaded', () => {
    const bookBtn = document.getElementById('bookBtn');
    const fromCity = document.getElementById('fromCity');
    const toCity = document.getElementById('toCity');
    const travelDates = document.getElementById('travelDates');
    const flightResults = document.getElementById('flightResults');
    const bookResult = document.getElementById('bookResult');

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

        bookResult.innerHTML = '<h3>Searching...</h3><p>Checking flight and hotel suggestions...</p>';
        flightResults.innerHTML = '<h2>Flight & Hotel Suggestions</h2><p>Loading...</p>';
        bookBtn.disabled = true;

        try {
            // Use local mock data or fetch from a JSON file
            const bookingData = await fetchBookingData(origin, destination, dates);

            displayBookingData(bookingData);

            bookResult.innerHTML = `<h3>Trip Summary for ${destination}</h3>
                <p>Flights and accommodations have been loaded successfully.</p>`;

        } catch (error) {
            console.error('Error fetching bookings:', error);
            bookResult.innerHTML = `<h3>❌ Error</h3><p>Failed to retrieve booking information. Details: ${error.message}</p>`;
        } finally {
            bookBtn.disabled = false;
        }
    }

    // --- MOCK FUNCTION: Fetch booking data ---
    async function fetchBookingData(origin, destination, dates) {
        // Option 1: Fetch from local JSON (uncomment if you have destinations.json)
        // const response = await fetch('data/destinations.json');
        // const data = await response.json();
        // Filter data based on destination
        // return data.filter(item => item.city.toLowerCase() === destination.toLowerCase())[0];

        // Option 2: Mock data inline
        return new Promise(resolve => {
            setTimeout(() => {
                resolve({
                    flights: [
                        { airline: 'Global Air', price: 450, route: `${origin} → ${destination}`, date: dates },
                        { airline: 'Budget Wings', price: 380, route: `${origin} → ${destination}`, date: dates }
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
            html += `<li>${h.name} (${h.rating}★): $${h.price}/night - ${h.availability}</li>`;
        });
        html += '</ul>';

        flightResults.innerHTML = html;
    }
});
