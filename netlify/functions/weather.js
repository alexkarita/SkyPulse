exports.handler = async (event) => {
  const { lat, lon, days = 7, ai = true, units = 'metric', lang = 'en' } = event.queryStringParameters;
  const API_KEY = process.env.WEATHER_API_KEY;
  const url = `https://api.weather-ai.co/v1/weather?lat=${lat}&lon=${lon}&days=${days}&ai=${ai}&units=${units}&lang=${lang}`;
  try {
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${API_KEY}` },
    });
    const data = await res.json();
    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify(data),
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
