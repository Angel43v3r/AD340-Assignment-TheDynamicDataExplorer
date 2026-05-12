import React from 'react';
import { useRouter } from 'expo-router';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useFavorites } from '../../context/favoritesContext';
import { CloudSun } from 'lucide-react-native';

export default function HomeScreen() {
  const { favorites } = useFavorites();
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.heading}>
        <Image
          source={require('../../assets/images/weatherIcon.png')}
          style={styles.icon}
        />
        <Text style={styles.title}> Weather Forecaster</Text>
      </View>
      {favorites.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No saved weather yet <CloudSun size={24} color="#fff8f2" /></Text>
          <Text style={styles.emptySubtext}>
            Search for a city and tap the heart icon.
          </Text>
          <TouchableOpacity
            onPress={() => router.push("/search")}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Go to Search</Text>
          </TouchableOpacity>

        </View>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item) => item.city + (item.state ?? '')}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={styles.weatherCard}>
              {/* TOP SECTION: City & Date */}
              <View style={styles.headerSection}>
                <Text style={styles.cityText}>
                  {item.city}{item.state ? `, ${item.state}` : ''}
                </Text>
                <Text style={styles.dateText}>Today, May 11</Text>
              </View>

              {/* MIDDLE SECTION: Icon & Main Temp */}
              <View style={styles.mainWeatherSection}>
                <Image source={{ uri: item.icon }} style={styles.mainIcon} />
                <Text style={styles.mainTemp}>{item.temperature}°C</Text>
                <Text style={styles.mainDescription}>{item.description}</Text>
              </View>

              {/* BOTTOM SECTION: 5 day Forecast */}
              {item.forecast && (
                <View style={styles.forecastContainer}>
                  <FlatList
                    horizontal
                    data={item.forecast}
                    keyExtractor={(f) => f.day}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.forecastList}
                    renderItem={({ item: forecastItem }) => (
                      <View style={styles.forecastColumn}>
                        <Text style={styles.forecastDay}>{forecastItem.day}</Text>
                        <Image
                          source={{ uri: forecastItem.icon }}
                          style={styles.forecastIcon}

                        />
                        <Text style={styles.forecastTemp}>{forecastItem.temperature}°C</Text>
                        <Text style={styles.forecastStatus}>{forecastItem.description || '(Sunny)'}</Text>
                      </View>
                    )}
                  />
                </View>
              )}
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#88cbe5', // The light blue from your image
    paddingTop: 80,
  },
  button: {
    marginTop: 20,
    backgroundColor: '#f8f29a',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#413f3d',
  },
  buttonText: {
    color: '#413f3d',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  cityText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a1b',
  },
  dateText: {
    fontSize: 18,
    color: '#413f3d',
    marginTop: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  emptyText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff'
  },
  emptySubtext: {
    marginTop: 10,
    fontSize: 16,
    color: '#413f3d',
    textAlign: 'center'
  },
  forecastContainer: {
    width: '96%',
    marginTop: 20,
  },
  forecastList: {
    paddingHorizontal: 8,
  },
  forecastColumn: {
    alignItems: 'center',
    marginHorizontal: 4,
  },
  forecastDay: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a1a1b',
    marginBottom: 8,
  },
  forecastIcon: {
    width: 45,
    height: 45,
    marginBottom: 8,
  },
  forecastTemp: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1b',
  },
  forecastStatus: {
    fontSize: 12,
    color: '#413f3d',
    width: 60,
    textAlign: 'center',
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 8,
  },
  heading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    backgroundColor: '#d8cfd0',
    width: 60,
    height: 60,
  },
  mainDescription: {
    fontSize: 22,
    color: '#1a1a1b',
    fontWeight: '500',
  },
  mainIcon: {
    width: 150,
    height: 120,
    resizeMode: 'contain',
  },
  mainTemp: {
    fontSize: 80,
    fontWeight: 'condensedBold',
    color: '#fff8f2',
    marginVertical: 10,
  },
  mainWeatherSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    color: '#fff8f2',
    fontSize: 36,
    fontWeight: 'semibold',
    alignSelf: 'center',
  },
  weatherCard: {
    borderRadius: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingVertical: 40,
    margin: 12,
  },
});