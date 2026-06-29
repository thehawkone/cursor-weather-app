import { getState, searchCity, selectDay } from './store.js';
import { formatDayLabel, formatTemperature, formatHour } from './utils.js';

const weatherForm = document.getElementById('search-form');
const cityInput = document.getElementById('city-input');
const loading = document.getElementById('loading');
const error = document.getElementById('error');
const currentWeather = document.getElementById('current-weather');
const cityName = document.getElementById('city-name');
const temperature = document.getElementById('temperature');
const description = document.getElementById('description');
const wind = document.getElementById('wind');
const humidity = document.getElementById('humidity');
const recentCitiesList = document.getElementById('recent-cities-list');
const dailyForecast = document.getElementById('daily-forecast');
const dailyButtons = document.getElementById('daily-buttons');
const hourlyForecast = document.getElementById('hourly-forecast');
const hourlyRow = document.getElementById('hourly-row');

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
        temperature.textContent = `Температура: ${formatTemperature(state.current.main.temp)}`;
        description.textContent = state.current.weather[0].description.charAt(0).toUpperCase() + state.current.weather[0].description.slice(1);
        wind.textContent = `Ветер: ${Math.round(state.current.wind.speed)} м/с`;
        humidity.textContent = `Влажность: ${state.current.main.humidity}%`;

        if (state.forecastByDay && state.selectedDay) {
            dailyForecast.hidden = false;
            hourlyForecast.hidden = false;

            dailyButtons.innerHTML = '';

            Object.keys(state.forecastByDay).forEach((dayKey) => {
                const button = document.createElement('button');
                button.type = 'button';
                button.textContent = formatDayLabel(dayKey);

                if (dayKey === state.selectedDay) {
                    button.classList.add('active');
                }

                button.addEventListener('click', () => {
                    selectDay(dayKey);
                    render();
                });

                dailyButtons.appendChild(button);
            });

            hourlyRow.innerHTML = '';

            state.forecastByDay[state.selectedDay].forEach((item) => {
                const slot = document.createElement('div');
                slot.className = 'hourly-item';
                slot.innerHTML = `
                    <p>${formatHour(item.dt_txt)}</p>
                    <p>${formatTemperature(item.main.temp)}</p>
                    <p>${item.weather[0].description}</p>
                `;
                hourlyRow.appendChild(slot);
            });
        } else {
            dailyForecast.hidden = true;
            hourlyForecast.hidden = true;
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