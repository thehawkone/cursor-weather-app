import { getState, searchCity } from './store.js';

const weatherForm = document.getElementById('search-form');
const cityInput = document.getElementById('city-input');
const loading = document.getElementById('loading');
const error = document.getElementById('error');
const currentWeather = document.getElementById('current-weather');
const forecast = document.getElementById('forecast');
const forecastList = document.getElementById('forecast-list');
const cityName = document.getElementById('city-name');
const temperature = document.getElementById('temperature');
const description = document.getElementById('description');
const wind = document.getElementById('wind');
const humidity = document.getElementById('humidity');
const recentCitiesList = document.getElementById('recent-cities-list');

function render() {
    const state = getState();

    if (state.loading) {
        loading.hidden = false;
        error.hidden = true;
        currentWeather.hidden = true;
    } else if (state.error) {
        loading.hidden = true;
        error.hidden = false;
        error.textContent = state.error;
        currentWeather.hidden = true;
    } else if (state.current) {
        loading.hidden = true;
        error.hidden = true;
        currentWeather.hidden = false;
        cityName.textContent = state.current.name;
        temperature.textContent = `Температура: ${Math.round(state.current.main.temp)}°C`;
        description.textContent = state.current.weather[0].description.charAt(0).toUpperCase() + state.current.weather[0].description.slice(1);
        wind.textContent = `Ветер: ${Math.round(state.current.wind.speed)} м/с`;
        humidity.textContent = `Влажность: ${state.current.main.humidity}%`;

        if (state.forecast) {
            forecast.hidden = false;
            forecastList.innerHTML = '';
            state.forecast.list.slice(0, 8).forEach((item) => {
                const li = document.createElement('li');
                li.textContent = `${item.dt_txt} — ${Math.round(item.main.temp)}°C — ${item.weather[0].description}`;
                forecastList.appendChild(li);
            });
        }
        else {
            forecast.hidden = true;
        }
    }
    else {
        loading.hidden = true;
        error.hidden = true;
        currentWeather.hidden = true;
    }
    if (state.recentCities && state.recentCities.length > 0) {
        recentCitiesList.innerHTML = '';

        state.recentCities.forEach((city) => {
            const button = document.createElement('button');
            button.type = 'button';
            button.textContent = city;

            button.addEventListener('click', async () => {
                const promise = searchCity(city);
                render();
                await promise;
                render();
            });

            recentCitiesList.appendChild(button);
        });
    }
}

export function initUI() {
    weatherForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const city = cityInput.value.trim();
        if (!city) return;

        const searchPromise = searchCity(city);
        render();
        await searchPromise;
        render();
    })

    render();
}