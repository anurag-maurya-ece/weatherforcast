const btn = document.getElementById('get-weather-btn');
const input = document.getElementById('city-input');
const resultDiv = document.getElementById('weather-result');

// Initialize the weather app
initializeWeatherApp();

function initializeWeatherApp() {
  setTimeBasedBackground();
  addClouds();
  
  // Add event listeners
  btn.addEventListener('click', fetchWeather);
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') fetchWeather();
  });
  
  // Update background every minute
  setInterval(setTimeBasedBackground, 60000);
}

function addClouds() {
  const cloudCount = 3;
  for (let i = 1; i <= cloudCount; i++) {
    const cloud = document.createElement('div');
    cloud.className = `cloud cloud${i}`;
    document.body.appendChild(cloud);
  }
}

function addStars() {
  const existingStars = document.querySelector('.stars');
  if (existingStars) return;
  
  const starsDiv = document.createElement('div');
  starsDiv.className = 'stars';
  
  // Create 150 stars with random positions and delays
  for (let i = 0; i < 150; i++) {
    const star = document.createElement('span');
    star.style.left = Math.random() * 100 + '%';
    star.style.top = Math.random() * 80 + '%';
    star.style.animationDelay = Math.random() * 3 + 's';
    star.style.animationDuration = (2 + Math.random() * 2) + 's';
    starsDiv.appendChild(star);
  }
  
  document.body.appendChild(starsDiv);
}

function removeStars() {
  const stars = document.querySelector('.stars');
  if (stars) stars.remove();
}

function addSun() {
  const existingSun = document.querySelector('.sun');
  if (existingSun) return;
  
  const sun = document.createElement('div');
  sun.className = 'sun';
  document.body.appendChild(sun);
}

function removeSun() {
  const sun = document.querySelector('.sun');
  if (sun) sun.remove();
}

function addMoon() {
  const existingMoon = document.querySelector('.moon');
  if (existingMoon) return;
  
  const moon = document.createElement('div');
  moon.className = 'moon';
  document.body.appendChild(moon);
}

function removeMoon() {
  const moon = document.querySelector('.moon');
  if (moon) moon.remove();
}

function addRain() {
  const existingRain = document.querySelector('.rain-container');
  if (existingRain) return;
  
  const rainContainer = document.createElement('div');
  rainContainer.className = 'rain-container';
  
  // Create 50 rain drops
  for (let i = 0; i < 50; i++) {
    const drop = document.createElement('div');
    drop.className = 'rain-drop';
    drop.style.left = Math.random() * 100 + '%';
    drop.style.animationDuration = (0.5 + Math.random() * 0.5) + 's';
    drop.style.animationDelay = Math.random() * 2 + 's';
    rainContainer.appendChild(drop);
  }
  
  document.body.appendChild(rainContainer);
}

function removeRain() {
  const rain = document.querySelector('.rain-container');
  if (rain) rain.remove();
}

function addSnow() {
  const existingSnow = document.querySelector('.snow-container');
  if (existingSnow) return;
  
  const snowContainer = document.createElement('div');
  snowContainer.className = 'snow-container';
  
  // Create 40 snowflakes
  for (let i = 0; i < 40; i++) {
    const flake = document.createElement('div');
    flake.className = 'snowflake';
    flake.style.left = Math.random() * 100 + '%';
    flake.style.animationDuration = (3 + Math.random() * 3) + 's';
    flake.style.animationDelay = Math.random() * 5 + 's';
    flake.style.opacity = 0.5 + Math.random() * 0.5;
    snowContainer.appendChild(flake);
  }
  
  document.body.appendChild(snowContainer);
}

function removeSnow() {
  const snow = document.querySelector('.snow-container');
  if (snow) snow.remove();
}

function addLightning() {
  const existingLightning = document.querySelector('.lightning');
  if (existingLightning) return;
  
  const lightning = document.createElement('div');
  lightning.className = 'lightning';
  document.body.appendChild(lightning);
}

function removeLightning() {
  const lightning = document.querySelector('.lightning');
  if (lightning) lightning.remove();
}

function clearWeatherEffects() {
  removeRain();
  removeSnow();
  removeLightning();
}

function setTimeBasedBackground() {
  const hour = new Date().getHours();
  const body = document.body;
  
  // Remove all weather classes first
  body.classList.remove('night', 'sunny', 'cloudy', 'rainy', 'snowy', 'clear-night', 'thunderstorm');
  clearWeatherEffects();
  removeStars();
  removeSun();
  removeMoon();
  
  // Set based on time (6am-6pm is day)
  if (hour >= 6 && hour < 18) {
    body.classList.add('sunny');
    addSun();
  } else {
    body.classList.add('night');
    addStars();
    addMoon();
  }
}

function setWeatherBackground(weatherMain, description) {
  const body = document.body;
  const hour = new Date().getHours();
  const isNight = hour < 6 || hour >= 18;
  
  // Remove existing weather classes
  body.classList.remove('night', 'sunny', 'cloudy', 'rainy', 'snowy', 'clear-night', 'thunderstorm');
  clearWeatherEffects();
  removeStars();
  removeSun();
  removeMoon();
  
  const weather = weatherMain.toLowerCase();
  
  if (isNight) {
    addMoon();
    
    if (weather === 'clear') {
      body.classList.add('clear-night');
      addStars();
    } else if (weather === 'clouds') {
      body.classList.add('night', 'cloudy');
      addStars();
    } else if (weather === 'rain' || weather === 'drizzle') {
      body.classList.add('night', 'rainy');
      addStars();
      addRain();
    } else if (weather === 'thunderstorm') {
      body.classList.add('night', 'thunderstorm');
      addStars();
      addRain();
      addLightning();
    } else if (weather === 'snow') {
      body.classList.add('night', 'snowy');
      addStars();
      addSnow();
    } else {
      body.classList.add('night');
      addStars();
    }
  } else {
    // Daytime
    addSun();
    
    if (weather === 'clear') {
      body.classList.add('sunny');
    } else if (weather === 'clouds') {
      body.classList.add('cloudy');
    } else if (weather === 'rain' || weather === 'drizzle') {
      body.classList.add('rainy');
      addRain();
    } else if (weather === 'thunderstorm') {
      body.classList.add('thunderstorm');
      addRain();
      addLightning();
    } else if (weather === 'snow') {
      body.classList.add('snowy');
      addSnow();
    } else {
      body.classList.add('sunny');
    }
  }
}

function getWeatherEmoji(weatherMain) {
  const weather = weatherMain.toLowerCase();
  const hour = new Date().getHours();
  const isNight = hour < 6 || hour >= 18;
  
  const weatherEmojis = {
    clear: isNight ? '🌙' : '☀️',
    clouds: isNight ? '☁️' : '⛅',
    rain: '🌧️',
    drizzle: '🌦️',
    thunderstorm: '⛈️',
    snow: '❄️',
    mist: '🌫️',
    fog: '🌫️',
    haze: '🌫️',
    smoke: '🌫️',
    dust: '🌫️',
    sand: '🌫️',
  };
  
  return weatherEmojis[weather] || '🌤️';
}

function getWeatherMainFromDescription(description) {
  const desc = description.toLowerCase();
  
  if (desc.includes('clear')) return 'Clear';
  if (desc.includes('cloud')) return 'Clouds';
  if (desc.includes('rain')) return 'Rain';
  if (desc.includes('drizzle')) return 'Drizzle';
  if (desc.includes('thunder') || desc.includes('storm')) return 'Thunderstorm';
  if (desc.includes('snow')) return 'Snow';
  if (desc.includes('mist') || desc.includes('fog') || desc.includes('haze')) return 'Mist';
  
  return 'Clear';
}

async function fetchWeather() {
  const city = input.value.trim();
  
  if (!city) {
    resultDiv.textContent = 'Please enter a city name.';
    resultDiv.classList.remove('loading');
    return;
  }

  resultDiv.textContent = 'Loading weather data...';
  resultDiv.classList.add('loading');
  resultDiv.innerHTML = '<div style="font-size: 18px; font-weight: 600;">🌍 Fetching weather data...</div>';

  try {
    const url = `http://127.0.0.1:5000/weather?city=${encodeURIComponent(city)}`;
    const resp = await fetch(url);

    if (!resp.ok) {
      let errText = 'City not found or service unavailable';
      try {
        const errJson = await resp.json();
        errText = errJson.error || JSON.stringify(errJson);
      } catch (e) {
        errText = `Server returned status ${resp.status}`;
      }
      resultDiv.innerHTML = `<div style="color: #e53e3e; font-weight: 600;">❌ Error: ${errText}</div>`;
      resultDiv.classList.remove('loading');
      return;
    }

    const data = await resp.json();
    
    // Extract weather main type from description
    const weatherMain = getWeatherMainFromDescription(data.description);
    
    // Set background based on weather
    setWeatherBackground(weatherMain, data.description);
    
    // Get appropriate emoji
    const emoji = getWeatherEmoji(weatherMain);
    
    // Add animation class to icon based on weather
    let iconClass = '';
    if (weatherMain.toLowerCase() === 'clear' && new Date().getHours() >= 6 && new Date().getHours() < 18) {
      iconClass = 'sunny-icon';
    }

    // Display results with beautiful formatting
    resultDiv.innerHTML = `
      <div class="weather-icon ${iconClass}">${emoji}</div>
      <div class="row">
        <strong>${data.city}</strong>
      </div>
      <div class="row">Temperature: <strong>${Math.round(data.temperature)}°C</strong></div>
      <div class="row">Weather: <strong>${capitalize(data.description)}</strong></div>
      <div class="row">Humidity: <strong>${data.humidity}%</strong></div>
    `;
    
    resultDiv.classList.remove('loading');
    
    // Add a subtle success message
    setTimeout(() => {
      const rows = resultDiv.querySelectorAll('.row');
      rows.forEach((row, index) => {
        row.style.animationDelay = `${index * 0.1}s`;
      });
    }, 50);
    
  } catch (err) {
    resultDiv.innerHTML = `<div style="color: #e53e3e; font-weight: 600;">❌ Network error: ${err.message}</div>`;
    resultDiv.classList.remove('loading');
    
    // Reset to time-based background on error
    setTimeout(() => {
      setTimeBasedBackground();
    }, 3000);
  }
}

function capitalize(str) {
  if (!str) return str;
  return str.split(' ').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');
}

// Add some console styling for developers
console.log('%c🌤️ Weather Dashboard Loaded Successfully! ', 'background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; font-size: 16px; padding: 10px; border-radius: 8px; font-weight: bold;');
console.log('%cEnjoy the beautiful animated weather experience! ☀️🌙', 'color: #4299e1; font-size: 14px; font-weight: 600;');