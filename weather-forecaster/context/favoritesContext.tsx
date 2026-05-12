import React, { createContext, useContext, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WeatherData } from '../services/weatherApi';

type FavoritesContextType = {
  favorites: WeatherData[];
  addFavorite: (item: WeatherData) => void;
  removeFavorite: (city: string, state?: string) => void;
  isFavorite: (city: string, state?: string) => boolean;
};

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider = ({ children }: { children: React.ReactNode }) => {
  const [favorites, setFavorites] = useState<WeatherData[]>([]);

  // Load saved favorites once
  React.useEffect(() => {
    const load = async () => {
      const data = await AsyncStorage.getItem('favorites');
      if (data) setFavorites(JSON.parse(data));
    };
    load();
  }, []);

  const saveToStorage = async (data: WeatherData[]) => {
    await AsyncStorage.setItem('favorites', JSON.stringify(data));
  };

  const addFavorite = (item: WeatherData) => {
    setFavorites((prev) => {
      const exists = prev.some(
        (f) => f.city === item.city && f.state === item.state
      );

      if (exists) return prev;

      const updated = [...prev, item];
      saveToStorage(updated);
      return updated;
    });
  };

  const removeFavorite = (city: string, state?: string) => {
    setFavorites((prev) => {
      const updated = prev.filter(
        (f) => !(f.city === city && f.state === state)
      );

      saveToStorage(updated);
      return updated;
    });
  };

  const isFavorite = (city: string, state?: string) => {
    return favorites.some(
      (f) => f.city === city && f.state === state
    );
  };

  return (
    <FavoritesContext.Provider
      value={{ favorites, addFavorite, removeFavorite, isFavorite }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used inside FavoritesProvider');
  }
  return context;
};