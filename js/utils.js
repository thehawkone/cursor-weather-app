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
        const dayKey = item.dt_txt.slice(0, 10);  // "2026-06-24 15:00:00" → "2026-06-24"
        if (!grouped[dayKey]) {
            grouped[dayKey] = [];
        }
        grouped[dayKey].push(item);
    }
    return grouped;
}