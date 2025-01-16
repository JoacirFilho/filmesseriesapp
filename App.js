import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AppContent from './AppContent';
import SplashScreen from './src/screens/SplashScreen';
import { SettingsProvider } from './src/context/SettingsContext';

const Stack = createStackNavigator();

const App = () => (
  <SettingsProvider>
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash">
        {/* Tela de Splash */}
        <Stack.Screen
          name="Splash"
          component={SplashScreen}
          options={{ headerShown: false }} // Ocultar cabeçalho na Splash Screen
        />
        {/* Tela Principal */}
        <Stack.Screen
          name="Home"
          component={AppContent}
          options={{ headerShown: false }} // Ocultar cabeçalho na tela principal
        />
      </Stack.Navigator>
    </NavigationContainer>
  </SettingsProvider>
);

export default App;
