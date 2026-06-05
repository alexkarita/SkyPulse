# SkyPulse 🌤

Real-time weather intelligence powered by the [WeatherAI API](https://weather-ai.co).
Search any city to get live conditions, AI-generated insights, and a 7-day forecast.

## Features
- 🌡 Live temperature, humidity, wind, UV index, wind gust & direction
- 🤖 AI weather summaries via WeatherAI
- 📅 7-day forecast with condition icons
- 📍 City geocoding via Open-Meteo (no extra key needed)
- 🌍 Correct local time for every city
- ⚡ Zero dependencies — plain HTML, CSS, JS

## Project Structure

```
SkyPulse/
├── index.html              # Markup only
├── style.css               # All styles
├── js/
│   ├── weather.js          # WeatherAI API + geocoding calls
│   ├── Ui.js               # DOM rendering
│   └── App.js              # Entry point / event wiring
├── api/
│   └── weather.js          # Vercel serverless function (CORS proxy)
├── netlify/
│   └── functions/
│       └── weather.js      # Netlify serverless function
├── netlify.toml            # Netlify config
├── config.example.js       # Template for local config
└── .gitignore
```

## APIs Used

- **[WeatherAI API](https://weather-ai.co)** — `/v1/weather` endpoint. Provides current conditions, hourly data, 7-day forecast, and AI summaries. Requires API key.
- **[Open-Meteo Geocoding](https://open-meteo.com)** — Converts city names to coordinates. Free, no key needed.

## Setup (Local)

1. Clone the repo
   ```bash
   git clone https://github.com/alexkarita/SkyPulse.git
   cd SkyPulse
   ```

2. Create your config file
   ```bash
   cp config.example.js config.js
   ```

3. Add your WeatherAI API key to `config.js`
   ```js
   const CONFIG = {
     API_KEY: 'wai_your_key_here',
     ...
   };
   ```

4. Open `index.html` with VS Code Live Server or:
   ```bash
   npx serve .
   ```

## Deployment (Vercel)

1. Push to GitHub
2. Import project on [vercel.com](https://vercel.com)
3. Add environment variable: `WEATHER_API_KEY = your_key`
4. Deploy — the `api/weather.js` serverless function handles CORS automatically

## Live Demo

🔗 [sky-pulse-sand.vercel.app](https://sky-pulse-sand.vercel.app)

## API Key Security

`config.js` is listed in `.gitignore` and never committed.
Production deployments use a serverless function so the key is never exposed to the browser.

## Built With

- [WeatherAI API](https://weather-ai.co) — weather data + AI summaries
- [Open-Meteo Geocoding](https://open-meteo.com) — city → lat/lon
- [Syne](https://fonts.google.com/specimen/Syne) + [DM Mono](https://fonts.google.com/specimen/DM+Mono) — Google Fonts
- Vercel — serverless deployment

---
Built by Alex Karita · WeatherAI Integration Assessment
