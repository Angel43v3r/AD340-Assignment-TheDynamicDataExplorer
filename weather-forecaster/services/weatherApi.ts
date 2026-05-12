export interface WeatherData {
    id: string;
    label?: string; // Optional label (?)
    city: string;
    state?: string; // Optional state for US locations
    temperature: number;
    description: string;
    type: 'Clear' | 'Clouds' |'Drizzle' | 'Rain' | 'Thunderstorm' | 'Snow' | 'Special';
    icon: string;
    forecast?: ForecastDay[]; // Optional forecast data for the location
}

export interface GeoLocation {
    name: string;
    lat: number;
    lon: number;
    country: string;
    state?: string;
}

export interface ForecastDay {
    day: string;
    temperature: number;
    description: string;
    type: 'Clear' | 'Clouds' |'Drizzle' | 'Rain' | 'Thunderstorm' | 'Snow' | 'Special';
    icon: string;
}

const API_KEY = 'MY_API_KEY'; // My OpenWeather API key Make sure this is HIDDEN in .env file!
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';
const GEO_URL = 'https://api.openweathermap.org/geo/1.0/direct';
const FORECAST_URL = 'https://api.openweathermap.org/data/2.5/forecast';

/**
 * Fetches geolocation data for a given city name.
 * @param city - Name of the city to search for
 * @return A promise that resolves to an array of GeoLocation objects   
 */
export async function fetchGeoLocation(city: string): Promise<GeoLocation[]> {
    try {
        const response = await fetch(`${GEO_URL}?q=${encodeURIComponent(city)}&limit=5&appid=${API_KEY}`);
        if (!response.ok) {
            throw new Error(`Geolocation API request failed with status ${response.status}`);
        }
        const data = await response.json();

        // ERROR STATE: If No Result Found
        if (!data || data.length === 0) {
            throw new Error('No location found for the specified city name.');
        }
        return data.map((item: any) => ({
            name: item.name,
            lat: item.lat,
            lon: item.lon,
            country: item.country,
            state: item.state,
        }));
    } catch (error) {
        console.error('Error fetching geolocation data:', error);
        throw error;
    }
}



/**
 * Fetches weather data for a given latitude and longitude.
 * @param lat - Latitude of the location
 * @param lon - Longitude of the location
 * @return A promise that resolves to the weather data
 */
export async function fetchWeatherData(lat: number, lon: number, city: string, state?: string, label?: string): Promise<WeatherData> {
    try {
        //Current weather request
        const response = await fetch(`${BASE_URL}?lat=${lat}&lon=${lon}&units=imperial&appid=${API_KEY}`);
        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
        }
        const data = await response.json();

        // ERROR STATE: If No Result Found
        if (!data || !data.weather || data.weather.length === 0) {
            throw new Error('No weather data found for the specified location.');
        }

        // Forecast request
        const forecastResponse = await fetch(
            `${FORECAST_URL}?lat=${lat}&lon=${lon}&units=imperial&appid=${API_KEY}`
        );

        if (!forecastResponse.ok) {
            throw new Error(`Forecast API request failed with status ${forecastResponse.status}`);
        }

        const forecastData = await forecastResponse.json();

        //Every 8th item in the forecast list corresponds to a new day (24 hours)
        const dailyForecast: ForecastDay[] = forecastData.list
            .filter((_: any, index: number) => index % 8 === 0)
            .slice(0, 7)
            .map((item: any) => ({
                day: new Date(item.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' }),
                temperature: Math.round(item.main.temp),
                description: item.weather[0].description,
                type: item.weather[0].main as ForecastDay['type'],
                icon: `https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`,
            }));


        // Map the API response to our WeatherData interface 
        const weatherData: WeatherData = {
            id: `${lat}-${lon}-${data.dt}`, 
            label: label,
            city: city,
            state: data.sys.country === 'US' ? state : undefined, 
            temperature: Math.round(data.main.temp),
            description: data.weather[0].description,
            type: data.weather[0].main as WeatherData['type'], // Cast to the defined types
            icon: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
            forecast: dailyForecast, // Add the forecast data to the weather data
        };

        return weatherData;
    } catch (error) {
        console.error('Error fetching weather data:', error);
        throw error;
    }
};