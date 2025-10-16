/****************************************************
 * FILE: scripts/static_image_loader.js
 * ---------------------------------------------
 * PURPOSE: Loads destinations.json and statically populates feature images on index.html.
 ****************************************************/

document.addEventListener('DOMContentLoaded', () => {
    // The path to the JSON file provided by the user
    const JSON_PATH = 'destinations.json';

    fetch(JSON_PATH)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to load destinations.json');
            }
            return response.json();
        })
        .then(data => {
            const destinations = data.destinations;
            if (!destinations || destinations.length === 0) return;
            
            // Map the JSON data to the static image keys used in index.html
            const featureMap = {
                'index_feature_1': destinations.find(d => d.name.includes('Paris')) || destinations[0],
                'index_feature_2': destinations.find(d => d.name.includes('Tokyo')) || destinations[1],
                'index_feature_3': destinations.find(d => d.name.includes('New York')) || destinations[2],
                'index_hero_main': destinations[0],
                'index_hero_side': destinations[1]
            };

            // Find all elements in the HTML with the 'data-img-key' attribute
            const placeholders = document.querySelectorAll('[data-img-key]');

            placeholders.forEach(imgElement => {
                const key = imgElement.getAttribute('data-img-key');
                const destination = featureMap[key];

                if (destination) {
                    // Fill the image source and alt text
                    imgElement.src = destination.image;
                    imgElement.alt = `Travel scene in ${destination.name}`;
                    imgElement.style.display = 'block'; // Make sure the image is visible
                    
                    // Add styling for feature tiles on index.html
                    if (key.startsWith('index_feature')) {
                         imgElement.style.width = '100%'; 
                         imgElement.style.height = '150px'; 
                         imgElement.style.objectFit = 'cover'; 
                         imgElement.style.borderRadius = '8px';
                    }
                }
            });
        })
        .catch(error => {
            console.error("Error loading static destination data:", error);
        });
});