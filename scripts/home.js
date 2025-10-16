document.addEventListener('DOMContentLoaded', () => {
  const slideshowWrapper = document.getElementById('heroSlideshow');
  

  // Fetch destination data
  fetch('data/destinations.json')
    .then(response => response.json())
    .then(data => {
      const destinations = data.destinations;
      let currentSlideIndex = 0;

      // Create slides dynamically
      destinations.forEach((dest, index) => {
        const slide = document.createElement('div');
        slide.className = 'hero-slide';
        if (index === 0) slide.classList.add('active');

        const img = document.createElement('img');
        img.src = dest.image;
        img.alt = dest.name;
        img.classList.add('hero-main-img');

        const caption = document.createElement('div');
        caption.className = 'slide-caption';
        caption.textContent = dest.name;

        slide.appendChild(img);
        slide.appendChild(caption);
        slideshowWrapper.appendChild(slide);
      });

      const slides = document.querySelectorAll('.hero-slide');
      const SLIDE_INTERVAL = 5000;

      function showSlide(index) {
        slides.forEach(s => s.classList.remove('active'));
        slides[index].classList.add('active');
      }

      setInterval(() => {
        currentSlideIndex = (currentSlideIndex + 1) % slides.length;
        showSlide(currentSlideIndex);
      }, SLIDE_INTERVAL);
    })
    .catch(err => {
      console.error('Error loading destinations:', err);
      slideshowWrapper.textContent = 'Failed to load destination images.';
    });
});
