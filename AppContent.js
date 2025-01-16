import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Animated, Text } from 'react-native';
import { searchMoviesAndSeries, getMoviesByGenre } from './src/api/tmdb'; // Importando as funções do tmdb.js
import SearchBar from './src/components/SearchBar';
import MovieList from './src/screens/MovieList';
import GenresScreen from './src/screens/GenresScreen';
import FavoritesScreen from './src/screens/FavoritesScreen';
import MovieModal from './src/components/MovieModal'
import MovieDetailsModal from './src/components/MovieDetailsModal';  // Importando o modal
import SettingsScreen from './src/components/SettingsScreen';
import { useSettings } from './src/context/SettingsContext';
import Sidebar from './src/components/Sidebar';  // Verifique o caminho de acordo com a estrutura do seu projeto

const AppContent = () => {
  const [currentScreen, setCurrentScreen] = useState('Home');
  const [movies, setMovies] = useState([]);
  const [favorites, setFavorites] = useState([]); // Lista de favoritos
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Controla se o Sidebar está aberto
  const [selectedMovie, setSelectedMovie] = useState(null); // Estado para o filme selecionado para o modal
  const [showModal, setShowModal] = useState(false); // Controla a exibição do modal
  const { isDarkMode, language } = useSettings();

  // Função para buscar filmes mais recentes automaticamente
  const fetchMovies = async () => {
    const results = await searchMoviesAndSeries('', 'movie'); // Buscando filmes automaticamente
    setMovies(results);
  };

  useEffect(() => {
    fetchMovies(); // Executa a busca de filmes ao carregar
  }, []);

  const handleSearch = async (query, filterType = 'multi') => {
    const results = await searchMoviesAndSeries(query, filterType);
    setMovies(results);
  };

  const handleGenreSelect = async (genreId) => {
    const results = await getMoviesByGenre(genreId);
    setMovies(results);
    setCurrentScreen('Home');
  };

  // Função de favoritar
  const handleFavorite = (movie) => {
    setFavorites((prevFavorites) => {
      if (prevFavorites.some((fav) => fav.id === movie.id)) {
        // Remove o filme dos favoritos
        return prevFavorites.filter((fav) => fav.id !== movie.id);
      }
      // Adiciona o filme aos favoritos
      return [...prevFavorites, movie];
    });
  };

  const handleFilterChange = (filter) => {
    handleSearch('', filter);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const openMovieDetailsModal = (movie) => {
    setSelectedMovie(movie);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedMovie(null);
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'Home':
        return (
          <View style={[styles.mainContent, { backgroundColor: isDarkMode ? '#333' : '#fff' }]}>
            <SearchBar onSearch={handleSearch} onFilterChange={handleFilterChange} />
            <MovieList 
              movies={movies} 
              onFavorite={handleFavorite} 
              isDarkMode={isDarkMode} 
              language={language} 
              favorites={favorites} 
              onMoviePress={openMovieDetailsModal} 
            />
          </View>
        );
      case 'Genres':
        return <GenresScreen onSelectGenre={handleGenreSelect} isDarkMode={isDarkMode} language={language} />;
      case 'Favorites':
        return <FavoritesScreen favorites={favorites} isDarkMode={isDarkMode} language={language} />;
      case 'Settings': // Adicionando a tela de configurações
        return <SettingsScreen />;
      default:
        return <View />;
    }
  };
  // Função para abrir o MovieModal
const openMovieModal = (movie) => {
  setSelectedMovie(movie);
  setShowModal(true); // Exibe o MovieModal
};

// No retorno do seu JSX, verifique se o modal está sendo exibido corretamente:
{showModal && selectedMovie && (
  <MovieModal
    selectedMovie={selectedMovie}
    isDarkMode={isDarkMode}
    onClose={closeModal}
    language={language}
  />
)}


  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? '#333' : '#fff' }]}>
      {/* Fundo para fechar o Sidebar quando clicar fora */}
      {isSidebarOpen && (
        <TouchableOpacity style={styles.backdrop} onPress={closeSidebar} />
      )}

      {/* Sidebar sobreposto */}
      <Animated.View
        style={[styles.sidebarContainer, {
          transform: [{ translateX: isSidebarOpen ? 0 : -150 }], // Sidebar desliza para dentro e fora
        }]}>
        <Sidebar onNavigate={(screen) => { setCurrentScreen(screen); closeSidebar(); }} />
      </Animated.View>

      {/* Botão de Toggle Sidebar */}
      <TouchableOpacity
        onPress={toggleSidebar}
        style={[styles.toggleButton, { backgroundColor: isDarkMode ? '#444' : '#fff' }]}>
        <Text style={[styles.arrowIcon, { color: isDarkMode ? '#fff' : '#333' }]}>
          {isSidebarOpen ? '⇽' : '⇾'}
        </Text>
      </TouchableOpacity>

      {/* Conteúdo principal */}
      <View style={styles.content}>{renderScreen()}</View>

      {/* Exibindo o modal de detalhes do filme, se necessário */}
      {showModal && selectedMovie && (
        <MovieDetailsModal
          movieDetails={selectedMovie}
          selectedMovie={selectedMovie}
          showCast={false}  // Controlando exibição do elenco (por exemplo, sempre mostrar 5 primeiros)
          isDarkMode={isDarkMode}
          language={language}
          closeModal={closeModal}
          handleTrailerPress={(trailerKey) => console.log(`Assistindo trailer: ${trailerKey}`)} // Função de trailer
          setShowCast={() => {}}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fundo semitransparente
    zIndex: 1, // Certifique-se de que está acima do conteúdo principal
  },
  sidebarContainer: {
    position: 'absolute', // Sidebar flutua sobre o conteúdo
    top: 0,
    left: 0,
    width: 150,
    height: '100%',
    backgroundColor: '#333',
    zIndex: 2, // Certifique-se de que está acima do fundo
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  toggleButton: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    zIndex: 3, // Certifique-se de que está acima do Sidebar
    padding: 10,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowIcon: {
    bottom: 4,
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 10,
  },
  mainContent: {
    flex: 1,
  },
});

export default AppContent;
