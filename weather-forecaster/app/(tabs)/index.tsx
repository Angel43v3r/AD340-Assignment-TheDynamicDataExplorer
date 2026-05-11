import { router } from "expo-router";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Index() {
  
  return (
    <View style={styles.container}>
      <Image
      source={require('../assets/images/weatherIcon.png')}
      style={styles.icon}
      />
      <Text style={styles.title}>Weather Forecaster</Text>
      <Text style={styles.text}>Real-time weather, anywhere you go!</Text>
      <TouchableOpacity
        onPress={() => router.push("/search")}
        style={styles.button}
      >
        <Text style={styles.buttonText}>Go to Search</Text>
      </TouchableOpacity>

    </View>
    
  );
}

const styles = StyleSheet.create({
  button: {
    marginTop: 20,
    backgroundColor: '#7bebee',
    padding: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: '#413f3d',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#d8cfd0',
  },
  icon: {
    backgroundColor: '#d8cfd0',
    width: 160,
    height: 160,
    borderRadius: 30,
    marginBottom: 8,
    borderWidth: 4,
    borderColor: '#413f3d',
  },
  text: {
    fontSize: 16
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    alignItems: 'center',
    marginBottom: 16,
    textTransform: 'uppercase',
  },
})
