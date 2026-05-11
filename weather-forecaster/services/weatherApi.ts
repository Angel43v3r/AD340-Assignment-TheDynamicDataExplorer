export interface WeatherData {
    id: string;
    label?: string; // Optional label (?)
    city: string;
    temperature: number;
    description: string;
    type: 'Clear' | 'Clouds' |'Drizzle' | 'Rain' | 'Thunderstorm' | 'Snow' | 'Special';
    icon: string;
}

export interface GeoLocation {
    name: string;
    lat: number;
    lon: number;
    country: string;
    state?: string;
}

const API_KEY = '974241e8c14f617edff96995261d31bd'; // My OpenWeather API key
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';
const GEO_URL = 'https://api.openweathermap.org/geo/1.0/direct';

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
export async function fetchWeatherData(lat: number, lon: number, city: string, label?: string): Promise<WeatherData> {
    try {
        const response = await fetch(`${BASE_URL}?lat=${lat}&lon=${lon}&units=imperial&appid=${API_KEY}`);
        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
        }
        const data = await response.json();

        // Map the API response to our WeatherData interface 
        const weatherData: WeatherData = {
            id: `${lat}-${lon}-${data.dt}`, 
            label: label,
            city: city,
            temperature: Math.round(data.main.temp),
            description: data.weather[0].description,
            type: data.weather[0].main as WeatherData['type'], // Cast to the defined types
            icon: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
        };

        return weatherData;
    } catch (error) {
        console.error('Error fetching weather data:', error);
        throw error;
    }
};