import { API_KEY, API_BASE_URL, GEO_API_URL, UNITS, LANG } from './config.js';

export const getWeather = async (city) => {
    const response = await fetch(`${API_BASE_URL}/weather?q=${city}&units=${UNITS}&lang=${LANG}&appid=${API_KEY}`);
    if (!response.ok) {
        throw new Error('Не удалось загрузить погоду для города ' + city);
    }
    const data = await response.json();
    return data;
}

export const getForecast = async (city) => {
    const response = await fetch(`${API_BASE_URL}/forecast?q=${city}&units=${UNITS}&lang=${LANG}&appid=${API_KEY}`);
    if (!response.ok || response.status !== 200) {
        throw new Error('Не удалось загрузить прогноз погоды для города ' + city);
    }
    const data = await response.json();
    return data;
}