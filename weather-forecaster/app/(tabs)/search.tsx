import { useRouter } from "expo-router";
import React, { useState } from "react";
import { FlatList, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { ChevronRight, Heart, History, Search } from "lucide-react-native";
import { fetchGeoLocation, GeoLocation, fetchWeatherData, WeatherData } from "../../services/weatherApi";
import { useFavorites } from "../../context/favoritesContext";

type SearchHistoryItem = {
  id: string;
  name: string;
};

export default function SearchScreen() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState("");
    const [history, setHistory] = useState<SearchHistoryItem[]>([]);
    const [results, setResults] = useState<GeoLocation[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedWeather, setSelectedWeather] = useState<WeatherData | null>(null);
    const { addFavorite, removeFavorite, isFavorite } = useFavorites();

    const handleSearch = async () => {
        if (!searchQuery.trim()) return; // Ignore empty searches
        setLoading(true);
        try {
            const geoResults = await fetchGeoLocation(searchQuery);
            setResults(geoResults);
            setHistory((prev) => [{ id: Date.now().toString(), name: searchQuery }, ...prev]);
        } catch (error) {
            console.error("Search error:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSelectCity = async (location: GeoLocation) => {
        setLoading(true);
        try {
            const weatherData = await fetchWeatherData(location.lat, location.lon, location.name, location.state);
            console.log("Selected city weather data:", weatherData);
            setSelectedWeather(weatherData);
            setResults([]); // Clear search results
            setSearchQuery("");

        } catch (error) {
            console.error("Error fetching weather data for selected city:", error);
        } finally {
            setLoading(false);
        }
    };

    const RenderEmptyHistory = () => (
        <View style={styles.emptyHistoryContainer}>
            <Image
                source={require('../../assets/images/weatherHistoryIcon2.png')}
                style={styles.icon}
            />
            <Text style={styles.emptyHistoryText}>Your search history is empty</Text>
            <Text style={styles.emptyHistorySubtext}>
                Type a city or zip code above to get the latest forecast.
            </Text>
        </View>
    );

    const handleFavoriteToggle = () => {
        if (!selectedWeather) return;

        const fav = isFavorite(selectedWeather.city, selectedWeather.state);

        if (fav) {
            removeFavorite(selectedWeather.city, selectedWeather.state);
        } else {
            addFavorite(selectedWeather);
        }
    };



    return (

        <View style={styles.container}>
            {/* Search Bar */}
            <View style={styles.searchSection}>
                <Search size={20} color="#413f3d" style={styles.searchIcon} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search by city or zip code"
                    placeholderTextColor="#75726f"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    onSubmitEditing={handleSearch}
                    returnKeyType="search"
                />
            </View>

            {/* SHOW WEATHER CARD HERE */}
            {selectedWeather && (
                <View style={styles.weatherCard}>
                    <View style={styles.weatherInfo}>
                        <Text style={styles.cityName}>{selectedWeather.city}
                            {selectedWeather.state && selectedWeather.state !== selectedWeather.city
                                ? `, ${selectedWeather.state}`
                                : ''}</Text>
                        <Image
                            source={{ uri: selectedWeather.icon }}
                            style={{ width: 60, height: 60, marginRight: 4, transform: [{ scale: 1.6 }] }}
                        />
                    </View>
                    <View style={styles.weatherInfoMiddle}>
                        {/*<Text style={styles.weatherType}>{selectedWeather.type}</Text>*/}
                        <Text style={styles.tempText}>{selectedWeather.temperature}°</Text>
                        <Text style={styles.weatherDesc}>{selectedWeather.description}</Text>
                    </View>
                    {/* close button to clear it */}
                    <TouchableOpacity onPress={() => setSelectedWeather(null)}>
                        <Text style={styles.closeText}>X</Text>
                    </TouchableOpacity>
                    {/* Favorite button */}
                    <TouchableOpacity
                        onPress={handleFavoriteToggle}
                        style={{ position: 'absolute', bottom: 10, right: 10 }}
                    >
                        <Heart
                            size={20}
                            color={
                                selectedWeather &&
                                    isFavorite(selectedWeather.city, selectedWeather.state)
                                    ? '#f44336'
                                    : '#413f3d'
                            }
                            fill={
                                selectedWeather &&
                                    isFavorite(selectedWeather.city, selectedWeather.state)
                                    ? '#f44336'
                                    : 'transparent'
                            }
                        />
                    </TouchableOpacity>
                </View>
            )}



            {/* Show Search History Result or Empty History */}
            {loading ? (
                <Text style={{ textAlign: 'center', marginTop: 20, color: '#413f3d' }}>Searching...</Text>
            ) : results.length > 0 ? (
                <FlatList
                    data={results}
                    keyExtractor={(item) => `${item.lat}-${item.lon}`}
                    renderItem={({ item }) => (
                        <TouchableOpacity style={styles.historyItem} onPress={() => handleSelectCity(item)}>
                            <View style={styles.historyLeft}>
                                <Search size={18} color="#413f3d" style={styles.historyIcon} />
                                <Text style={styles.historyText}>{item.name}, {item.state ? item.state + ', ' : ''}{item.country}</Text>
                            </View>
                            <ChevronRight size={18} color="#413f3d" />
                        </TouchableOpacity>
                    )}
                />

            ) : history.length > 0 ? (
                <FlatList
                    data={history}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <TouchableOpacity style={styles.historyItem}>
                            <View style={styles.historyLeft}>
                                <History size={18} color="#413f3d" style={styles.historyIcon} />
                                <Text style={styles.historyText}>{item.name}</Text>
                            </View>
                            <ChevronRight size={18} color="#413f3d" />
                        </TouchableOpacity>
                    )}
                />
            ) : (
                <RenderEmptyHistory />
            )}
        </View>

    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 80,
        backgroundColor: '#88cbe5',
    },
    cityName: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1a1a1b',
        marginBottom: 4,
    },
    closeText: {
        color: '#413f3d',
        fontWeight: 'bold',
        fontSize: 18,
        marginLeft: 16,
    },
    emptyHistoryContainer: {
        flex: 0.8, // Centers it in the available space below the search bar
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyHistoryText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff8f2',
        textAlign: 'center',
        marginTop: 20,
        marginBottom: 8,
    },
    emptyHistorySubtext: {
        fontSize: 16,
        color: '#413f3d',
        textAlign: 'center',
        paddingHorizontal: 40,
        lineHeight: 20,
    },
    historyItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(65, 63, 61, 0.5)',
    },
    historyLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    historyIcon: {
        marginRight: 12,
        color: '#787878',
    },
    historyText: {
        fontSize: 16,
        color: '#787878',
    },
    icon: {
        backgroundColor: '#82cee7',
        width: 240,
        height: 240,
        borderRadius: 30,
        marginBottom: 8,
    },
    searchSection: {
        flexDirection: 'row', // Horizontal layout for icon + input
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 25,
        paddingHorizontal: 15,
        height: 50,
        marginBottom: 20,
        // Optional: subtle shadow to make it "pop"
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
    },
    searchIcon: {
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: '#413f3d',
    },
    tempText: {
        fontSize: 48,
        fontWeight: 'condensedBold',
        color: '#fff8f2',
        marginTop: 16,
    },
    weatherCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.25)',
        borderRadius: 20,
        padding: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    weatherDesc: {
        fontSize: 12,
        color: '#413f3d',
        textTransform: 'capitalize',
        opacity: 0.8,
    },
    weatherInfo: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        paddingLeft: 4,
    },
    weatherInfoMiddle: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    weatherType: {
        fontSize: 32,
        color: '#fff8f2',
        fontWeight: 'bold',
        marginBottom: 20,
    },
});