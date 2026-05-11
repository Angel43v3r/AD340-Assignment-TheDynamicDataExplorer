import { router } from "expo-router";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Index() {
  
  return (
    <View style={styles.container}>
      <Image
      source={require('../../assets/images/weatherIcon.png')}
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
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#99cce4',
  },
  icon: {
    backgroundColor: '#d8cfd0',
    width: 160,
    height: 160,
    borderRadius: 30,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: '#413f3d',
  },
  text: {
    fontSize: 16
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff8f2',
    alignItems: 'center',
    marginBottom: 12,
    textTransform: 'uppercase',
  },
})
