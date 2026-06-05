export default async function handler(req, res) {
  const { lat, lon, days = 7, ai = true, units = 'metric', lang = 'en' } = req.query;
  const API_KEY = process.env.WEATHER_API_KEY;
  const url = `https://api.weather-ai.co/v1/weather?lat=${lat}&lon=${lon}&days=${days}&ai=${ai}&units=${units}&lang=${lang}`;
  try {
    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${API_KEY}` },
    });
    const data = await response.json();
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}