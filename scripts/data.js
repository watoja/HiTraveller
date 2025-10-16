// scripts/data.js

/**
 * Fetches and filters destination data from the local destinations.json file.
 * @param {Object} [filters] - Optional filters for refining results.
 * @param {string} [filters.region] - Filter by region (e.g., "Europe").
 * @param {number} [filters.minPrice] - Minimum average price.
 * @param {number} [filters.maxPrice] - Maximum average price.
 * @param {number} [filters.minRating] - Minimum rating value.
 * @returns {Promise<Array>} Filtered array of destination objects.
 */
export async function getDestinations(filters = {}) {
  try {
    const response = await fetch("../data/destinations.json");
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    let destinations = data.destinations || [];

    // --- Apply Filters (if any) ---
    destinations = destinations.filter((dest) => {
      const matchRegion = filters.region
        ? dest.region.toLowerCase() === filters.region.toLowerCase()
        : true;

      const matchMinPrice = filters.minPrice
        ? dest.average_price >= filters.minPrice
        : true;

      const matchMaxPrice = filters.maxPrice
        ? dest.average_price <= filters.maxPrice
        : true;

      const matchMinRating = filters.minRating
        ? dest.rating >= filters.minRating
        : true;

      return matchRegion && matchMinPrice && matchMaxPrice && matchMinRating;
    });

    console.log("✅ Destinations loaded:", destinations.length);
    return destinations;
  } catch (error) {
    console.error("❌ Error fetching destinations:", error);
    return [];
  }
}
