function loadRecentCities() {
    const recentCities = localStorage.getItem('weather-recent-cities');
    if (recentCities) {
        return JSON.parse(recentCities);
    }
    return [];
}

function saveRecentCities(cities) {
    try {
        localStorage.setItem('weather-recent-cities', JSON.stringify(cities));
    } catch (error) {
        console.error('Ошибка сохранения городов: ', error);
    }
}

export { loadRecentCities, saveRecentCities };