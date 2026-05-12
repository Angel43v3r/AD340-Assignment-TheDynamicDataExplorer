import React from 'react';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useFavorites } from '../../context/favoritesContext';
import { CloudSun } from 'lucide-react-native';

export default function FavoritesScreen() {
  const { favorites, removeFavorite } = useFavorites();



  return (
    <View style={styles.container}>
      <View style={styles.heading}>
        <Image
          source={require('../../assets/images/weatherIcon.png')}
          style={styles.icon}
        />
        <Text style={styles.title}>My Favorites</Text>
      </View>
      {favorites.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No saved weather yet <CloudSun size={24} color="#fff8f2" /></Text>
          <Text style={styles.emptySubtext}>
            Search for a city and tap the heart icon.
          </Text>

        </View>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item) => item.city + (item.state ?? '')}
          renderItem={({ item }) => (
            <View style={styles.containerCard}>
              <View style={styles.weatherInfo}>
                <Text style={styles.cityText}>
                  {item.city}, {item.state}
                </Text>
                <Image source={{ uri: item.icon }} style={{ width: 60, height: 60, transform: [{ scale: 1.6 }] }} />
              </View>
              <View style={styles.weatherInfoMiddle}>
                <Text style={styles.temperatureText}>
                  {item.temperature}°
                </Text>
                <Text>{item.description}</Text>
              </View>

              <TouchableOpacity
                onPress={() => removeFavorite(item.city, item.state)}
              >
                <Text style={styles.closeText}>
                  X
                </Text>
              </TouchableOpacity>
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
    padding: 20,
    paddingTop: 80,
    backgroundColor: '#88cbe5',
  },
  containerCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    
  },
  cityText: {
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
  temperatureText: {
    fontSize: 48,
    fontWeight: 'condensedBold',
    color: '#fff8f2',
    marginTop: 16,
  },
  title: {
    color: '#fff8f2',
    fontSize: 36,
    fontWeight: 'semibold',
    alignSelf: 'center',
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
});