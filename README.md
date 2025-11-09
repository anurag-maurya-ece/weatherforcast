# Weather Dashboard

A simple Weather Dashboard mini-project with a Python Flask backend and a static HTML/CSS/JavaScript frontend.

## Features
- Flask backend with endpoints:
  - `GET /weather?city=CityName` — returns JSON with current temperature (°C), description, and humidity.
  - `GET /ping` — health check returning `{ "status": "ok" }`.
- Frontend uses `fetch()` to call the backend and display results.

## Files
- `app.py` — Flask backend and API.
- `index.html` — Frontend UI.
- `style.css` — Frontend styling.
- `script.js` — Frontend JS to call backend and render results.

## Setup
1. Install dependencies (Windows PowerShell):

```powershell
python -m pip install --upgrade pip
python -m pip install flask requests flask-cors python-dotenv
```

2. Set your OpenWeatherMap API key:
- Option A (recommended): set environment variable `OWM_API_KEY` to your API key.
  ```powershell
  setx OWM_API_KEY "YOUR_API_KEY"
  # After running setx, close and re-open your terminal for the environment variable to take effect.
  ```

- Option B: edit `app.py` and replace the fallback key string in the `api_key` variable (not recommended for security reasons).

3. Start the backend (from project root):

```powershell
cd 'd:\cp mini project clg'
python app.py
```

This starts Flask on `http://127.0.0.1:5000`.

4. Serve the frontend (in a separate terminal) and open in browser:

```powershell
cd 'd:\cp mini project clg'
python -m http.server 8000
# then open http://127.0.0.1:8000/index.html in your browser
```

Or open the frontend directly via the Flask root URL (the app serves `index.html` if present):
```
http://127.0.0.1:5000/
```

## API examples
- Health check:
  - `GET http://127.0.0.1:5000/ping` → `{ "status": "ok" }`
- Weather JSON:
  - `GET http://127.0.0.1:5000/weather?city=Delhi`

## Notes
- The backend uses OpenWeatherMap geocoding to translate city name to latitude/longitude and then calls the current weather endpoint.
- Replace `YOUR_API_KEY` with a valid OpenWeatherMap API key.

## License
This project is provided as-is for learning and demonstration purposes.
