import { useRouter } from "expo-router";
import React, { useState } from "react";
import { FlatList, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { ChevronRight, History, Search } from "lucide-react-native";
import { fetchGeoLocation, GeoLocation } from "../../services/weatherApi";
import { fetchWeatherData } from "../../services/weatherApi";

export default function SearchScreen() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState("");
    const [history, setHistory] = useState([]);
    const [results, setResults] = useState<GeoLocation[]>([]);
    const [loading, setLoading] = useState(false);

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
            const weatherData = await fetchWeatherData(location.lat, location.lon, location.name);
            //Navigate to the home screen and load the weather data for the selected city
            router.replace({
                pathname: "/(tabs)",
                params: {
                    weather: JSON.stringify(weatherData),
                }
            });
            console.log("Selected city weather data:", weatherData);

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



            {/* Show Search History Result or Empty History */}
            {loading ? (
                <Text style={{ textAlign: 'center', marginTop: 20, color: '#413f3d' }}>Searching...</Text>
            ): results.length > 0 ? (
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
        paddingTop: 70,
        backgroundColor: '#88cbe5',
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
});