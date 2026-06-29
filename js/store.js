import { getWeather, getForecast } from './api.js';
import { saveRecentCities, loadRecentCities } from './model.js';
import { groupForecastByDay } from './utils.js';


const state = {
    city: null,
    current: null,
    loading: false,
    error: null,
    forecast: null,
    recentCities: null,
    forecastByDay: null,
    selectedDay: null,
};

function initStore() {
    state.recentCities = loadRecentCities();
    return state;
}

function getState() {
    return state;
}

async function searchCity(city) {
    state.loading = true;
    state.error = null;
    state.current = null;
    state.forecast = null;
    state.forecastByDay = null;
    state.selectedDay = null;

    try {
        let result = await getWeather(city);
        let forecast = await getForecast(city);
        
        state.current = result;
        state.city = result.name;
        state.forecast = forecast;

        state.forecastByDay = groupForecastByDay(forecast.list);
        const days = Object.keys(state.forecastByDay);
        state.selectedDay = days[0];

        const cityName = result.name;
        const withoutDuplicate = state.recentCities.filter(
            (name) => name !== cityName
        );
        const updatedCities = [cityName, ...withoutDuplicate].slice(0, 5);

        saveRecentCities(updatedCities);
        state.recentCities = updatedCities;

    } catch (error) {
        state.current = null;
        state.city = null;
        state.error = "Не удалось загрузить погоду для города " + city;
        state.forecast = null;
        state.forecastByDay = null;
        state.selectedDay = null;
    }
    finally {
        state.loading = false;
    }

    return state;
}

function selectDay(dayKey) {
    state.selectedDay = dayKey;
}

export { initStore, getState, searchCity, selectDay }
