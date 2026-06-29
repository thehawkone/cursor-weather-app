import { getWeather, getForecast } from './api.js';

const state = {
    city: null,
    current: null,
    loading: false,
    error: null,
    forecast: null,
};

function initStore() {
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

    try {
        let result = await getWeather(city);
        let forecast = await getForecast(city);
        state.current = result;
        state.city = result.name;
        state.forecast = forecast;
    } catch (error) {
        state.current = null;
        state.city = null;
        state.error = "Не удалось загрузить погоду для города " + city;
        state.forecast = null;
    }
    finally {
        state.loading = false;
    }

    return state;
}

export { initStore, getState, searchCity }
