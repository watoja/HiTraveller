// Example of fetching data from the Travel Advisor API or your sample dataset
export async function getDestinations(query) {
  try {
    const response = await fetch(`https://api.api-ninjas.com/v1/city?name=${query}`, {
      headers: { "X-Api-Key": "YOUR_API_KEY" }
    });
    const data = await response.json();

    return data.length
      ? data.map(city => ({
          name: city.name,
          description: `Located in ${city.country}, population: ${city.population.toLocaleString()}.`
        }))
      : [{ name: query, description: "No data found for this destination." }];
  } catch (error) {
    console.error("Error fetching destinations:", error);
    return [];
  }
}
