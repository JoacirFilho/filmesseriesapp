import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { useSettings } from '../context/SettingsContext';

const SearchBar = ({ onSearch, onFilterChange }) => {
  const { language, isDarkMode } = useSettings(); // Garantir que a linguagem e o modo escuro estejam disponíveis
  const [selectedFilter, setSelectedFilter] = useState('movie'); // 'movie' como filtro padrão

  // Garantindo que 'language' tenha um valor padrão se não estiver disponível
  const currentLanguage = language || 'en-US'; // Usa inglês por padrão, se language não estiver disponível.

  const placeholderText = currentLanguage === 'pt-BR'
    ? 'Pesquisar filmes, séries ou animes'
    : currentLanguage === 'en-US'
    ? 'Search movies, series or anime'
    : 'Buscar películas, series o anime';

  const filters = [
    { label: currentLanguage === 'pt-BR' ? 'Filmes' : currentLanguage === 'en-US' ? 'Movies' : 'Películas', value: 'movie' },
    { label: currentLanguage === 'pt-BR' ? 'Séries' : currentLanguage === 'en-US' ? 'Series' : 'Series', value: 'tv' },
    { label: currentLanguage === 'pt-BR' ? 'Animes' : currentLanguage === 'en-US' ? 'Anime' : 'Anime', value: 'anime' },
  ];

  const handleFilterChange = (filter) => {
    setSelectedFilter(filter);
    onFilterChange(filter); // Passando a mudança de filtro para a App.js
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={[styles.input, { color: isDarkMode ? '#fff' : '#000' }]} // Muda a cor do texto dependendo do modo
        placeholder={placeholderText}
        onChangeText={(query) => onSearch(query, selectedFilter)} // Chamando a busca quando a query mudar
        placeholderTextColor={isDarkMode ? '#ccc' : '#888'} // A cor do placeholder também muda conforme o modo
        textAlign="left"
      />
      <View style={styles.filterContainer}>
        {filters.map((filter) => (
          <TouchableOpacity
            key={filter.value}
            style={[styles.filterButton, selectedFilter === filter.value && styles.activeFilter]}
            onPress={() => handleFilterChange(filter.value)}
          >
            <Text
              style={[
                styles.filterText,
                selectedFilter === filter.value && styles.activeFilterText,
                { color: '#000' } // Cor fixa para preto
              ]}
            >
              {filter.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  filterButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    marginHorizontal: 5,
    borderRadius: 5,
    backgroundColor: '#f0f0f0',
  },
  activeFilter: {
    backgroundColor: '#007BFF',
  },
  filterText: {
    fontWeight: '500',
  },
  activeFilterText: {
    fontWeight: '700',
  },
});

export default SearchBar;