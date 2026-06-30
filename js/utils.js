export function formatDayLabel(dateStr) {
    const date = new Date(`${dateStr}T12:00:00`);
    const day = date.getDate();
    const month = date.toLocaleDateString('ru-RU', { month: 'short' });
    const weekday = date.toLocaleDateString('ru-RU', { weekday: 'short' });
    return `${day} ${month}, ${weekday}`;
}

export function formatTemperature(temperature) {
    return `${Math.round(temperature)}°C`;
}

export function formatHour(dt_txt) {
    const timePart = dt_txt.split(' ')[1];
    const [hours, minutes] = timePart.split(':');
    return `${hours}:${minutes}`;
}

export function groupForecastByDay(list) {
    const grouped = {};
    for (const item of list) {
        const dayKey = item.dt_txt.slice(0, 10);
        if (!grouped[dayKey]) {
            grouped[dayKey] = [];
        }
        grouped[dayKey].push(item);
    }
    return grouped;
}

export function formatDescription(text) {
    if (!text) return '';
    return text.charAt(0).toUpperCase() + text.slice(1);
}

export function formatCurrentDate(dt, timezone = 0) {
    // dt — UTC, timezone — смещение города в секундах.
    // Смещение уже «вшито» в timestamp, поэтому форматируем как UTC,
    // иначе браузер применит локальный пояс повторно.
    const date = new Date((dt + timezone) * 1000);
    const datePart = date.toLocaleDateString('ru-RU', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        timeZone: 'UTC',
    });
    const timePart = date.toLocaleTimeString('ru-RU', {
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'UTC',
    });
    return `${datePart}. ${timePart}`;
}

export function getWeatherIconUrl(icon) {
    return `https://openweathermap.org/img/wn/${icon}@2x.png`;
}

export function getWeatherTheme(weather) {
    const id = weather.id;

    if (id === 800) return 'clear';
    if (id === 801 || id === 802) return 'partly-cloudy';
    if (id === 803) return 'cloudy';
    if (id === 804) return 'overcast';

    if (id >= 200 && id < 300) return 'rain';
    if (id >= 300 && id < 400) return 'rain';
    if (id >= 500 && id < 600) return 'rain';
    if (id >= 600 && id < 700) return 'snow';
    if (id >= 700 && id < 800) return 'fog';

    if (weather.main === 'Clear') return 'clear';
    if (weather.main === 'Clouds') return 'cloudy';
    if (weather.main === 'Rain') return 'rain';
    if (weather.main === 'Snow') return 'snow';
    if (weather.main === 'Fog') return 'fog';

    return 'default';
}

export function getHourlyValue(item, tab) {
    switch (tab) {
        case 'wind':
            return `${Math.round(item.wind.speed)} м/с`;
        case 'humidity':
            return `${item.main.humidity}%`;
        case 'pop':
            return item.pop != null ? `${Math.round(item.pop * 100)}%` : '—';
        default:
            return formatTemperature(item.main.temp);
    }
}

function getWeatherEmoji(icon) {
    switch (icon) {
        case '01d': return '☀️'; case '01n': return '🌙';
        case '02d': return '⛅️'; case '02n': return '🌙';
        case '03d': case '03n': return '☁️';
        case '04d': case '04n': return '☁️';
        case '09': case '10': return '🌧️';
        case '11': return '⛈️';
        case '13': return '❄️';
        case '50': return '🌫️';
        default: return '❓';
    }
}