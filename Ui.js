// ui.js — All DOM rendering and UI state management

const UI = (() => {
  const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // ── WMO condition code → emoji + label ─────────────────────────────────────
  const WMO = {
    0:  { icon: '☀️',  label: 'Clear Sky' },
    1:  { icon: '🌤',  label: 'Mainly Clear' },
    2:  { icon: '⛅',  label: 'Partly Cloudy' },
    3:  { icon: '☁️',  label: 'Overcast' },
    45: { icon: '🌫',  label: 'Foggy' },
    48: { icon: '🌫',  label: 'Icy Fog' },
    51: { icon: '🌦',  label: 'Light Drizzle' },
    53: { icon: '🌦',  label: 'Drizzle' },
    55: { icon: '🌦',  label: 'Heavy Drizzle' },
    61: { icon: '🌧',  label: 'Light Rain' },
    63: { icon: '🌧',  label: 'Rain' },
    65: { icon: '🌧',  label: 'Heavy Rain' },
    71: { icon: '❄️',  label: 'Light Snow' },
    73: { icon: '❄️',  label: 'Snow' },
    75: { icon: '❄️',  label: 'Heavy Snow' },
    80: { icon: '🌦',  label: 'Rain Showers' },
    81: { icon: '🌧',  label: 'Heavy Showers' },
    95: { icon: '⛈',   label: 'Thunderstorm' },
    99: { icon: '⛈',   label: 'Severe Thunderstorm' },
  };

  function getIcon(code) {
    const n = parseInt(code);
    return (!isNaN(n) && WMO[n]) ? WMO[n].icon : '🌤';
  }

  function getLabel(code) {
    const n = parseInt(code);
    return (!isNaN(n) && WMO[n]) ? WMO[n].label : 'Clear';
  }

  // ── Element helpers ─────────────────────────────────────────────────────────
  function el(id)          { return document.getElementById(id); }
  function html(id, value) { el(id).innerHTML = value; }
  function text(id, value) { el(id).textContent = value; }
  function unit(value, suffix) {
    return `${value}<span class="stat-unit">${suffix}</span>`;
  }

  // ── Loading state ───────────────────────────────────────────────────────────
  function setLoading(isLoading) {
    el('loader').style.display    = isLoading ? 'block' : 'none';
    el('dashboard').style.display = isLoading ? 'none' : 'block';
    el('welcome').style.display   = 'none';
    el('searchBtn').disabled      = isLoading;
    el('searchBtn').textContent   = isLoading ? 'Loading…' : 'Get Weather';
  }

  // ── Error banner ────────────────────────────────────────────────────────────
  function showError(msg) {
    const box = el('errorBox');
    box.textContent = '⚠ ' + msg;
    box.style.display = 'block';
    setTimeout(() => { box.style.display = 'none'; }, 6000);
  }

  function hideError() { el('errorBox').style.display = 'none'; }

  // ── Hero card ───────────────────────────────────────────────────────────────
  function renderHero({ weather, location }) {
    const now      = new Date();
    const timezone = weather.location?.timezone || 'UTC';
    const current  = weather.current;
    const { name, countryCode, region, lat, lon } = location;

    text('cityName', name);
    text('coordsLine',
      `${countryCode}${region ? ' · ' + region : ''} · ${parseFloat(lat).toFixed(2)}°, ${parseFloat(lon).toFixed(2)}°`
    );
    html('timestamp',
      now.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'short', timeZone: timezone }) +
      '<br>' +
      now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: timezone })
    );

    const temp      = current.temperature;
    const feelsLike = current.feels_like;
    const code      = current.condition_code;

    html('tempValue', `${Math.round(temp)}<span class="temp-unit">°C</span>`);
    text('conditionTag', `${getIcon(code)} ${getLabel(code)}`);
    text('feelsLike', feelsLike != null ? `Feels like ${Math.round(feelsLike)}°C` : '');

    return { temp, code };
  }

  // ── Stats grid ──────────────────────────────────────────────────────────────
  function renderStats(current) {
    const hum    = current.humidity    ?? '—';
    const wind   = current.wind_speed  ?? '—';
    const precip = current.precipitation_probability ?? '—';
    const uv     = current.uv_index    ?? '—';
    const gust   = current.wind_gust   ?? '—';
    const dir    = current.wind_direction ?? '—';

    html('humidity',      unit(hum, '%'));
    html('windSpeed',     unit(typeof wind === 'number' ? Math.round(wind) : wind, 'km/h'));
    html('precipitation', unit(precip !== '—' ? precip + '%' : '—', ' chance'));
    html('cloudCover',    uv !== '—' ? String(uv) : '—');
    html('visibility',    unit(dir !== '—' ? dir + '°' : '—', ''));
    html('pressure',      unit(gust !== '—' ? Math.round(gust) : '—', ' km/h'));

    return { hum, wind };
  }

  // ── AI insight ──────────────────────────────────────────────────────────────
  function renderAI(weather, cityName, temp, code, hum, wind) {
    const summary = weather.ai_summary ?? weather.summary ?? weather.insight ?? null;
    text('aiInsight',
      summary ||
      `Current conditions in ${cityName}: ${Math.round(temp)}°C, ${getLabel(code)}. ` +
      `Humidity at ${hum}%, winds at ${typeof wind === 'number' ? Math.round(wind) : wind} km/h.`
    );
  }

  // ── 7-day forecast ──────────────────────────────────────────────────────────
  function renderForecast(forecast = []) {
    if (!forecast.length) return;
    html('forecastRow',
      forecast.slice(0, 7).map(day => {
        const date = new Date(day.date || day.time || Date.now());
        const hi   = day.temp_max   ?? day.temperature_max  ?? day.max  ?? '—';
        const lo   = day.temp_min   ?? day.temperature_min  ?? day.min  ?? '—';
        const code = day.condition_code ?? day.condition ?? '';
        return `
          <div class="forecast-item">
            <div class="forecast-day">${DAYS[date.getDay()]}</div>
            <div class="forecast-icon">${getIcon(code)}</div>
            <div class="forecast-high">${hi !== '—' ? Math.round(hi) : '—'}°</div>
            <div class="forecast-low">${lo  !== '—' ? Math.round(lo) : '—'}°</div>
          </div>`;
      }).join('')
    );
  }

  // ── Master render ───────────────────────────────────────────────────────────
  function renderDashboard({ weather, location }) {
    const current  = weather.current;
    const forecast = weather.daily ?? weather.forecast ?? [];

    const { temp, code } = renderHero({ weather, location });
    const { hum, wind }  = renderStats(current);
    renderAI(weather, location.name, temp, code, hum, wind);
    renderForecast(forecast);

    el('welcome').style.display   = 'none';
    el('dashboard').style.display = 'block';
  }

  // ── Welcome screen ──────────────────────────────────────────────────────────
  function showWelcome() {
    el('welcome').style.display   = 'block';
    el('dashboard').style.display = 'none';
  }

  return { setLoading, showError, hideError, renderDashboard, showWelcome };
})();