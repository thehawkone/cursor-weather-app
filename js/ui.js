import { getState, searchCity, selectDay } from './store.js';
import {
    formatDayLabel,
    formatTemperature,
    formatHour,
    formatDescription,
    formatCurrentDate,
    getWeatherIconUrl,
    getWeatherTheme,
    getHourlyValue,
} from './utils.js';

const weatherForm = document.getElementById('search-form');
const cityInput = document.getElementById('city-input');
const searchWrapper = document.getElementById('search-wrapper');
const searchDropdown = document.getElementById('search-dropdown');
const loading = document.getElementById('loading');
const error = document.getElementById('error');
const currentWeather = document.getElementById('current-weather');
const currentDate = document.getElementById('current-date');
const cityName = document.getElementById('city-name');
const temperature = document.getElementById('temperature');
const feelsLike = document.getElementById('feels-like');
const weatherIcon = document.getElementById('weather-icon');
const description = document.getElementById('description');
const wind = document.getElementById('wind');
const humidity = document.getElementById('humidity');
const precipitation = document.getElementById('precipitation');
const recentCitiesList = document.getElementById('recent-cities-list');
const dailyForecast = document.getElementById('daily-forecast');
const dailyButtons = document.getElementById('daily-buttons');
const hourlyForecast = document.getElementById('hourly-forecast');
const hourlyTabs = document.getElementById('hourly-tabs');
const hourlyRow = document.getElementById('hourly-row');

let activeHourlyTab = 'temp';

function showDropdown() {
    const state = getState();
    if (state.recentCities?.length > 0) {
        searchDropdown.hidden = false;
    }
}

function hideDropdown() {
    searchDropdown.hidden = true;
}

function applyWeatherTheme(current) {
    const theme = getWeatherTheme(current.weather[0]);
    document.body.className = 'theme-' + theme
}

function renderRecentCities() {
    const state = getState();
    recentCitiesList.innerHTML = '';

    if (!state.recentCities?.length) {
        hideDropdown();
        return;
    }

    state.recentCities.forEach((city) => {
        const li = document.createElement('li');
        const button = document.createElement('button');
        button.type = 'button';
        button.textContent = city;

        button.addEventListener('click', async () => {
            cityInput.value = city;
            hideDropdown();
            const promise = searchCity(city);
            render();
            await promise;
            render();
        });

        li.appendChild(button);
        recentCitiesList.appendChild(li);
    });
}

function renderHourlyRow(state) {
    hourlyRow.innerHTML = '';

    state.forecastByDay[state.selectedDay].forEach((item) => {
        const iconCode = item.weather[0].icon;
        const slot = document.createElement('div');
        slot.className = 'hourly-item';
        slot.innerHTML = `
            <p>${formatHour(item.dt_txt)}</p>
            <img src="${getWeatherIconUrl(iconCode)}" alt="" width="40" height="40">
            <p>${getHourlyValue(item, activeHourlyTab)}</p>
        `;
        hourlyRow.appendChild(slot);
    });
}

function hideForecastPanels() {
    dailyForecast.hidden = true;
    hourlyForecast.hidden = true;
}

function render() {
    const state = getState();

    if (state.loading) {
        loading.hidden = false;
        error.hidden = true;
        currentWeather.hidden = true;
        hideForecastPanels();
    } else if (state.error) {
        loading.hidden = true;
        error.hidden = false;
        error.textContent = state.error;
        currentWeather.hidden = true;
        hideForecastPanels();
        document.body.className = 'theme-default';
    } else if (state.current) {
        loading.hidden = true;
        error.hidden = true;
        currentWeather.hidden = false;

        const weather = state.current.weather[0];
        applyWeatherTheme(state.current);

        currentDate.textContent = formatCurrentDate(
            state.current.dt,
            state.current.timezone
        );
        cityName.textContent = state.current.name;
        temperature.textContent = formatTemperature(state.current.main.temp);
        feelsLike.textContent = `Ощущается как ${formatTemperature(state.current.main.feels_like)}`;
        description.textContent = formatDescription(weather.description);

        weatherIcon.src = getWeatherIconUrl(weather.icon);
        weatherIcon.alt = weather.description;
        weatherIcon.hidden = false;

        wind.textContent = `${Math.round(state.current.wind.speed)} м/с`;
        humidity.textContent = `${state.current.main.humidity}%`;

        const nearestForecast = state.forecast?.list?.[0];
        if (nearestForecast?.pop != null) {
            precipitation.textContent = `${Math.round(nearestForecast.pop * 100)}%`;
        } else {
            precipitation.textContent = '—';
        }

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

            renderHourlyRow(state);
        } else {
            hideForecastPanels();
        }
    } else {
        loading.hidden = true;
        error.hidden = true;
        currentWeather.hidden = true;
        hideForecastPanels();
        document.body.className = 'theme-default';
    }

    renderRecentCities();
}

export function initUI() {
    weatherForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const city = cityInput.value.trim();
        if (!city) return;

        hideDropdown();
        const searchPromise = searchCity(city);
        render();
        await searchPromise;
        render();
    });

    cityInput.addEventListener('focus', () => {
        showDropdown();
    });

    document.addEventListener('click', (event) => {
        if (!searchWrapper.contains(event.target)) {
            hideDropdown();
        }
    });

    hourlyTabs.addEventListener('click', (event) => {
        const button = event.target.closest('[data-tab]');
        if (!button) return;

        activeHourlyTab = button.dataset.tab;

        hourlyTabs.querySelectorAll('.hourly-tabs__btn').forEach((btn) => {
            btn.classList.remove('hourly-tabs__btn--active');
        });
        button.classList.add('hourly-tabs__btn--active');

        const state = getState();
        if (state.forecastByDay && state.selectedDay) {
            renderHourlyRow(state);
        }
    });

    render();
}
