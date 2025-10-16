/****************************************************
 * FILE: main.js
 * ---------------------------------------------
 * PURPOSE: General site-wide JavaScript (Auth, Hamburger Menu, etc.).
 ****************************************************/

document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const authBtn = document.getElementById('authBtn');

    // --- 1. User Authentication (Local Storage) ---
    function checkAuthStatus() {
        const username = localStorage.getItem('currentUsername');
        if (username) {
            authBtn.textContent = `Sign Out (${username})`;
            authBtn.classList.add('logged-in');
        } else {
            authBtn.textContent = 'Sign In';
            authBtn.classList.remove('logged-in');
        }
    }

    if (authBtn) {
        authBtn.addEventListener('click', () => {
            if (authBtn.classList.contains('logged-in')) {
                // Sign Out
                localStorage.removeItem('currentUsername');
                alert('You have been signed out.');
            } else {
                // Sign In / Register Placeholder
                const username = prompt('Enter a username to sign in (or register):');
                if (username) {
                    localStorage.setItem('currentUsername', username);
                    alert(`Welcome, ${username}! Your trips can now be saved.`);
                }
            }
            checkAuthStatus();
        });
    }

    checkAuthStatus(); // Initial check

    // --- 2. Hamburger Menu Toggle Logic ---
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }

    // --- 3. Subscribe Form Handler ---
    const subscribeForms = document.querySelectorAll('#subscribeForm');
    subscribeForms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const emailInput = form.querySelector('input[type="email"]');
            alert(`Thank you for subscribing with: ${emailInput.value}`);
            emailInput.value = '';
        });
    });
});
/*
 PURPOSE:
 * Implements the automatic 5-second transitioning slideshow
 * for the hero section of the index.html page, now using 
 * the provided real destination data.
 ****************************************************/


document.addEventListener('DOMContentLoaded', () => {
    const slideshowWrapper = document.getElementById('heroSlideshow');
    const SLIDE_INTERVAL = 5000; // 5 seconds interval for transition

    // Destination data (provided by the user)
    const destinationData = {
      "destinations": [
        {
          "id": 1,
          "name": "Paris, France",
          "country": "France",
          "region": "Europe",
          "description": "Experience the City of Lights with its iconic Eiffel Tower, romantic cafes, and rich art culture.",
          "image": "https://images.unsplash.com/photo-1502602898657-3e91760cbb34",
          "average_price": 1200,
          "best_season": "Spring",
          "rating": 4.8
        },
        {
          "id": 2,
          "name": "Tokyo, Japan",
          "country": "Japan",
          "region": "Asia",
          "description": "Explore Japan’s vibrant capital—where futuristic technology meets ancient traditions and world-class cuisine.",
          "image": "https://images.unsplash.com/photo-1505066836043-7a2ae83d1338",
          "average_price": 1500,
          "best_season": "Autumn",
          "rating": 4.9
        },
        {
          "id": 3,
          "name": "New York City, USA",
          "country": "United States",
          "region": "North America",
          "description": "Discover the Big Apple, home to Times Square, Broadway, and an endless skyline that never sleeps.",
          "image": "https://images.unsplash.com/photo-1549924231-f129b911e442",
          "average_price": 1100,
          "best_season": "Fall",
          "rating": 4.7
        },
        {
          "id": 4,
          "name": "Cape Town, South Africa",
          "country": "South Africa",
          "region": "Africa",
          "description": "A coastal gem at the foot of Table Mountain, offering ocean views, culture, and stunning wildlife.",
          "image": "https://images.unsplash.com/photo-1542051841857-5f90071e7989",
          "average_price": 900,
          "best_season": "Summer",
          "rating": 4.6
        },
        {
          "id": 5,
          "name": "Sydney, Australia",
          "country": "Australia",
          "region": "Oceania",
          "description": "Visit the Sydney Opera House, enjoy sunny beaches, and explore vibrant harbor life.",
          "image": "https://images.unsplash.com/photo-1506976785307-8732e854ad75",
          "average_price": 1400,
          "best_season": "Spring",
          "rating": 4.8
        },
        {
          "id": 6,
          "name": "Rome, Italy",
          "country": "Italy",
          "region": "Europe",
          "description": "Walk through ancient history in Rome—home to the Colosseum, Roman Forum, and incredible Italian cuisine.",
          "image": "https://images.unsplash.com/photo-1509395176047-4a66953fd231",
          "average_price": 1000,
          "best_season": "Fall",
          "rating": 4.7
        },
        {
          "id": 7,
          "name": "Dubai, UAE",
          "country": "United Arab Emirates",
          "region": "Middle East",
          "description": "A luxury city blending desert adventures, futuristic skyscrapers, and world-class shopping.",
          "image": "https://images.unsplash.com/photo-1504274066651-8d31a536b11a",
          "average_price": 1300,
          "best_season": "Winter",
          "rating": 4.8
        },
        {
          "id": 8,
          "name": "Rio de Janeiro, Brazil",
          "country": "Brazil",
          "region": "South America",
          "description": "Dance to the rhythm of samba, relax on Copacabana Beach, and marvel at Christ the Redeemer.",
          "image": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
          "average_price": 950,
          "best_season": "Summer",
          "rating": 4.6
        }
      ]
    };
    
    // Get the array of destinations
    const destinations = destinationData.destinations;
    let currentSlideIndex = 0;
    let slides = []; // To store the created image elements

    /**
     * Creates and appends image elements to the slideshow container 
     * using the destination data.
     */
    const createSlides = () => {
        slideshowWrapper.innerHTML = ''; // Clear existing content

        destinations.forEach((imgData, index) => {
            const slideContainer = document.createElement('div');
            slideContainer.className = 'hero-slide';
            if (index === 0) {
                // The first slide is active initially
                slideContainer.classList.add('active'); 
            }

            const img = document.createElement('img');
            // Use the real image URL
            img.src = imgData.image; 
            // Use the destination name for alt text
            img.alt = imgData.name; 
            img.classList.add('hero-main-img');
            
            // Add error handling for images just in case
            img.onerror = function() {
                this.onerror=null; // Prevent infinite loop
                this.src='https://placehold.co/400x500/cccccc/333333?text=Image+Load+Error';
            };


            const caption = document.createElement('div');
            caption.className = 'slide-caption';
            // Use the destination name for the caption
            caption.textContent = imgData.name; 
            
            slideContainer.appendChild(img);
            slideContainer.appendChild(caption);
            slideshowWrapper.appendChild(slideContainer);
            slides.push(slideContainer); // Store for easy reference
        });
    };

    /**
     * Shows the slide at the given index with a smooth transition.
     * @param {number} index - The index of the slide to show.
     */
    const showSlide = (index) => {
        if (!slides.length) return;

        // Ensure index wraps around (circular slideshow)
        if (index >= slides.length) {
            currentSlideIndex = 0;
        } else if (index < 0) {
            currentSlideIndex = slides.length - 1;
        } else {
            currentSlideIndex = index;
        }

        // Deactivate all slides
        slides.forEach(slide => slide.classList.remove('active'));

        // Activate the new slide
        slides[currentSlideIndex].classList.add('active');
    };

    /**
     * Starts the automatic slideshow rotation.
     */
    const startSlideshow = () => {
        // Set the interval for the 5-second transition
        setInterval(() => {
            showSlide(currentSlideIndex + 1);
        }, SLIDE_INTERVAL);
    };

    // Initialize and start the slideshow
    createSlides();
    startSlideshow();
});

document.addEventListener("DOMContentLoaded", () => {
  const hamburger = document.querySelector(".hamburger");
  const navLinks = document.querySelector(".nav-links");

  if (hamburger && navLinks) {
    hamburger.addEventListener("click", () => {
      hamburger.classList.toggle("active");
      navLinks.classList.toggle("active");
    });
  }
});
