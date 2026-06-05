// weather.js — WeatherAI API calls & Open-Meteo geocoding

const WeatherService = (() => {

  async function geocode(cityName) {
    const res = await fetch(
      `${CONFIG.GEO_BASE}/search?name=${encodeURIComponent(cityName)}&count=1&language=en&format=json`
    );
    const data = await res.json();
    if (!data.results || data.results.length === 0) {
      throw new Error(`City "${cityName}" not found. Try a different spelling.`);
    }
    return data.results[0];
  }

  async function fetchWeather({ lat, lon, days = CONFIG.DEFAULT_DAYS, ai = true, units = CONFIG.DEFAULT_UNITS, lang = CONFIG.DEFAULT_LANG }) {
    const endpoint = `${CONFIG.API_BASE}/weather?lat=${lat}&lon=${lon}&days=${days}&ai=${ai}&units=${units}&lang=${lang}`;
    const proxy = `https://api.allorigins.win/raw?url=${encodeURIComponent(endpoint)}`;
    const res = await fetch(proxy, {
      headers: { Authorization: `Bearer ${CONFIG.API_KEY}` },
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      if (res.status === 401) throw new Error('API key invalid.');
      if (res.status === 429) throw new Error('Monthly API quota exceeded.');
      if (res.status === 403) throw new Error('Your plan does not include this feature.');
      throw new Error(err.message || `WeatherAI API error ${res.status}`);
    }

    const data = await res.json();

    // Merge hourly[0] into current for missing fields
    if (data.hourly && data.hourly.length > 0) {
      data.current = { ...data.hourly[0], ...data.current };
    }

    return data;
  }

  async function getByCity(cityName) {
    const geo = await geocode(cityName);
    const weather = await fetchWeather({ lat: geo.latitude, lon: geo.longitude });
    return {
      weather,
      location: {
        name: geo.name,
        countryCode: geo.country_code,
        region: geo.admin1,
        lat: geo.latitude,
        lon: geo.longitude,
      },
    };
  }

  return { getByCity };
})();