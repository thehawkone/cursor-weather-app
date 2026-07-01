# Weather App by Nitka

Погодное приложение на чистом JavaScript: поиск города, текущая погода, почасовой и недельный прогноз. Данные - [OpenWeatherMap API](https://openweathermap.org/api).

## Возможности

- Поиск города по названию
- Текущая погода: температура, ощущается как, описание, ветер, влажность, осадки
- Динамический фон в зависимости от погоды
- Почасовой прогноз на выбранный день (температура, ветер, осадки, влажность)
- Недельный прогноз — вертикальные карточки с min/max, иконкой и статистикой
- Недавние города в выпадающем списке (localStorage)

## Стек

- HTML, SCSS, CSS
- Vanilla JavaScript (ES modules)
- OpenWeatherMap API

## Быстрый старт

### 1. Клонировать репозиторий

```bash
git clone <url-репозитория>
cd cursor-weather-app
```

### 2. Получить API-ключ

1. Зарегистрируйся на [openweathermap.org](https://openweathermap.org/)
2. Создай API key в личном кабинете

### 3. Настроить конфиг

```bash
cp js/config.example.js js/config.js
```

Открой `js/config.js` и вставь свой ключ:

```javascript
export const API_KEY = 'твой_ключ';
```

### 4. Запустить локальный сервер

ES modules не работают через `file://`, нужен локальный сервер:

```bash
npx serve .
```

Или с Live Server в VS Code / Cursor — открой `index.html`.

Приложение будет доступно по адресу вроде `http://localhost:3000`.

### 5. (Опционально) Скомпилировать SCSS

Если меняешь стили в `styles/main.scss`:

```bash
npx sass styles/main.scss styles/main.css
```

## Структура проекта

```
cursor-weather-app/
├── index.html          # разметка
├── js/
│   ├── app.js          # точка входа
│   ├── api.js          # запросы к OpenWeatherMap
│   ├── store.js        # состояние приложения
│   ├── ui.js           # рендер и обработчики
│   ├── utils.js        # форматирование, группировка прогноза
│   ├── model.js        # localStorage (недавние города)
│   ├── config.js       # API-ключ (не в git)
│   └── config.example.js
├── styles/
│   ├── main.scss       # исходные стили
│   └── main.css        # скомпилированные стили
└── assets/
    ├── backgrounds/    # фоны по типу погоды
    └── logotype/       # логотип
```

## Архитектура

```
app.js → initStore(), initUI()
store.js → state, searchCity(), selectDay()
api.js → getWeather(), getForecast()
ui.js → render(), события
utils.js → форматирование, getDaySummary(), getWeatherTheme()
model.js → recent cities в localStorage
```

**Состояние:** `city`, `current`, `forecast`, `forecastByDay`, `selectedDay`, `recentCities`, `loading`, `error`

## VPN

OpenWeatherMap может быть недоступен из некоторых регионов без VPN. Если запросы падают с `ERR_CONNECTION_TIMED_OUT` — включи VPN.

## Лицензия

Учебный проект. API-ключ храни только локально в `js/config.js`.
