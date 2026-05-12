import { router } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, Image, StyleSheet, Text, View } from "react-native";

export default function Index() {

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/(tabs)");
    }, 1000); // 1 seconds

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/images/weatherIcon.png')}
        style={styles.icon}
      />

      <Text style={styles.title}>
        Weather Forecaster
      </Text>

      <Text style={styles.text}>
        Real-time weather, anywhere you go!
      </Text>

      <ActivityIndicator
        size="large"
        color="#413f3d"
        style={styles.loader}
      />
    </View>
  );
}

const styles = StyleSheet.create({
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

  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff8f2',
    marginBottom: 12,
    textTransform: 'uppercase',
  },

  text: {
    fontSize: 16,
    color: '#413f3d',
  },

  loader: {
    marginTop: 30,
  },
});