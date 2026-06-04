// app.js — Entry point. Wires UI events to WeatherService.

async function getWeather() {
  const cityRaw = document.getElementById('cityInput').value.trim();
  if (!cityRaw) { UI.showError('Please enter a city name.'); return; }

  UI.hideError();
  UI.setLoading(true);

  try {
    const result = await WeatherService.getByCity(cityRaw);
    console.log('API result:', JSON.stringify(result, null, 2));
    console.log('calling renderDashboard...');
    UI.renderDashboard(result);
    console.log('renderDashboard done');
    document.getElementById('dashboard').style.display = 'block';
    document.getElementById('welcome').style.display = 'none';
  } catch (err) {
    console.error('Error:', err);
    UI.showError(err.message || 'Something went wrong. Please try again.');
    UI.showWelcome();
  } finally {
    UI.setLoading(false);
  }
}

function quickSearch(city) {
  document.getElementById('cityInput').value = city;
  getWeather();
}

// Keyboard shortcut: Enter to search
document.getElementById('cityInput').addEventListener('keydown', e => {
  if (e.key === 'Enter') getWeather();
});

function goBack() {
  document.getElementById('dashboard').style.display = 'none';
  document.getElementById('welcome').style.display = 'block';
  document.getElementById('cityInput').value = '';
}