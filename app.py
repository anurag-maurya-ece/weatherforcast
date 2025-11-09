import datetime
import requests
import string
from flask import Flask, render_template, request, redirect, url_for, jsonify, send_from_directory, make_response
from flask_cors import CORS
import os
from dotenv import load_dotenv
load_dotenv()

OWM_ENDPOINT = "https://api.openweathermap.org/data/2.5/weather"
OWM_FORECAST_ENDPOINT = "https://api.openweathermap.org/data/2.5/forecast"
GEOCODING_API_ENDPOINT = "http://api.openweathermap.org/geo/1.0/direct"
# Prefer an environment variable named OWM_API_KEY, but fall back to the provided key if not set
api_key = os.getenv("OWM_API_KEY", "56c4cf2271eb9ffd010035e24d2fb11d")

app = Flask(__name__)
CORS(app)  # enable CORS for all routes (allows frontend served from another port to call API)


# Display home page and get city name entered into search form
@app.route("/", methods=["GET", "POST"])
def home():
    if request.method == "POST":
        city = request.form.get("search")
        return redirect(url_for("get_weather", city=city))
    # If a static index.html exists in the project root, serve it. Otherwise fall back to template.
    static_index = os.path.join(os.getcwd(), 'index.html')
    if os.path.exists(static_index):
        return send_from_directory(os.getcwd(), 'index.html')
    return render_template("index.html")


@app.route('/script.js')
def serve_script():
    return send_from_directory(os.getcwd(), 'script.js')


@app.route('/style.css')
def serve_style():
    return send_from_directory(os.getcwd(), 'style.css')


@app.route('/index.html')
def serve_index_html():
    return send_from_directory(os.getcwd(), 'index.html')


# Display weather forecast for specific city using data from OpenWeather API
@app.route("/<city>", methods=["GET", "POST"])
def get_weather(city):
    # Format city name and get current date to display on page
    city_name = string.capwords(city)
    today = datetime.datetime.now()
    current_date = today.strftime("%A, %B %d")

    # Get latitude and longitude for city
    location_params = {
        "q": city_name,
        "appid": api_key,
        "limit": 3,
    }

    location_response = requests.get(GEOCODING_API_ENDPOINT, params=location_params)
    location_data = location_response.json()

    # Prevent IndexError if user entered a city name with no coordinates by redirecting to error page
    if not location_data:
        return redirect(url_for("error"))
    else:
        lat = location_data[0]['lat']
        lon = location_data[0]['lon']

    # Get OpenWeather API data
    weather_params = {
        "lat": lat,
        "lon": lon,
        "appid": api_key,
        "units": "metric",
    }
    # current weather
    weather_response = requests.get(OWM_ENDPOINT, params=weather_params)
    weather_response.raise_for_status()
    weather_data = weather_response.json()

    # Get current weather data
    current_temp = round(weather_data['main']['temp'])
    current_weather = weather_data['weather'][0]['main']
    min_temp = round(weather_data['main']['temp_min'])
    max_temp = round(weather_data['main']['temp_max'])
    wind_speed = weather_data['wind']['speed']

    # Get five-day weather forecast data
    forecast_response = requests.get(OWM_FORECAST_ENDPOINT, params=weather_params)
    forecast_data = forecast_response.json()

    # Make lists of temperature and weather description data to show user
    five_day_temp_list = [round(item['main']['temp']) for item in forecast_data['list'] if '12:00:00' in item['dt_txt']]
    five_day_weather_list = [item['weather'][0]['main'] for item in forecast_data['list'] if '12:00:00' in item['dt_txt']]

    # Get next four weekdays to show user alongside weather data
    five_day_unformatted = [today + datetime.timedelta(days=i) for i in range(5)]
    five_day_dates_list = [date.strftime("%a") for date in five_day_unformatted]

    return render_template("city.html", city_name=city_name, current_date=current_date, current_temp=current_temp,
                           current_weather=current_weather, min_temp=min_temp, max_temp=max_temp, wind_speed=wind_speed,
                           five_day_temp_list=five_day_temp_list, five_day_weather_list=five_day_weather_list,
                           five_day_dates_list=five_day_dates_list)


@app.route('/weather', methods=['GET'])
def weather_api():
    """API endpoint: GET /weather?city=CityName  -> returns JSON with temperature, description, humidity"""
    city = request.args.get('city')
    if not city:
        return jsonify({'error': 'Missing required query parameter: city'}), 400

    # Use geocoding to get lat/lon
    geo_params = {'q': city, 'limit': 1, 'appid': api_key}
    try:
        gresp = requests.get(GEOCODING_API_ENDPOINT, params=geo_params, timeout=5)
        gresp.raise_for_status()
    except requests.RequestException as e:
        return jsonify({'error': 'Failed to contact geocoding service', 'details': str(e)}), 502

    gdata = gresp.json()
    if not gdata:
        return jsonify({'error': 'City not found'}), 404

    lat = gdata[0].get('lat')
    lon = gdata[0].get('lon')

    # Call current weather endpoint
    params = {'lat': lat, 'lon': lon, 'appid': api_key, 'units': 'metric'}
    try:
        wresp = requests.get(OWM_ENDPOINT, params=params, timeout=5)
        wresp.raise_for_status()
    except requests.RequestException as e:
        return jsonify({'error': 'Failed to contact weather service', 'details': str(e)}), 502

    wdata = wresp.json()
    try:
        temp = wdata['main']['temp']
        desc = wdata['weather'][0]['description']
        humidity = wdata['main']['humidity']
        display_city = f"{gdata[0].get('name')}, {gdata[0].get('country')}"
        return jsonify({'city': display_city, 'temperature': temp, 'description': desc, 'humidity': humidity})
    except Exception as e:
        return jsonify({'error': 'Unexpected response structure', 'details': str(e)}), 500


@app.route('/ping')
def ping():
    return jsonify({'status': 'ok'})


# Display error page for invalid input
@app.route("/error")
def error():
    return render_template("error.html")


if __name__ == "__main__":
    app.run(debug=True)