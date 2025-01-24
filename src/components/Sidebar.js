import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const Sidebar = ({ onNavigate, onFilterChange }) => {
  return (
    <View style={styles.sidebar}>
      <TouchableOpacity onPress={() => onNavigate('Home')} style={styles.menuItem}>
        <Text style={styles.menuText}>🏠 Home</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => onNavigate('Favorites')} style={styles.menuItem}>
        <Text style={styles.menuText}>⭐ Favoritos</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => onNavigate('Genres')} style={styles.menuItem}>
        <Text style={styles.menuText}>🎭 Generos</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => onNavigate('Settings')} style={styles.menuItem}>
        <Text style={styles.menuText}>⚙ Configurações</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  sidebar: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#333',
    paddingVertical: 20,
  },
  menuItem: {
    marginVertical: 15,
  },
  menuText: {
    fontSize: 16,
    color: '#fff',
  },
});

export default Sidebar;