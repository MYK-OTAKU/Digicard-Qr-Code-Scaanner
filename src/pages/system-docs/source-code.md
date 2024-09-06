---
id: source-code
title: Source Code Documentation
---

# Documentation du Code Source

## Structure du Code

- **`App.tsx` :** Fichier principal de l'application, gère la navigation et l'authentification.
- **`src/screens/ScanScreen.tsx` :** Écran de scan de QR code.
- **`src/screens/HistoryScreen.tsx` :** Écran de l'historique des scans.
- **`src/screens/FavoritesScreen.tsx` :** Écran des favoris.
- **`src/screens/ResultScreen.tsx` :** Écran des résultats de scan.
- **`src/components/UserScreen.tsx` :** Écran utilisateur.
- **`src/components/SettingsScreen.tsx` :** Écran des paramètres.
- **`src/components/FingerprintAuthScreen.tsx` :** Écran d'authentification biométrique.
- **`src/components/CustomDrawerContent.tsx` :** Contenu personnalisé du tiroir de navigation.
- **`src/Context/AuthContext.tsx` :** Contexte d'authentification.
- **`src/components/AuthGuard.tsx` :** Gardien d'authentification.
- **`src/screens/LoadingScreen.tsx` :** Écran de chargement pendant la vérification de l'authentification.

## Exemples de Code

### `App.tsx`

```typescript
import React, { useEffect, useState, useContext } from 'react';
import { NavigationContainer, NavigationContainerRef } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { View, StyleSheet, TouchableOpacity, BackHandler, Alert, AppState, AppStateStatus, Text } from 'react-native';
import ScanScreen from './src/screens/ScanScreen';
import HistoryScreen from './src/screens/HistoryScreen';
import FavoritesScreen from './src/screens/FavoritesScreen';
import ResultScreen from './src/screens/ResultScreen';
import UserScreen from './src/components/UserScreen';
import SettingsScreen from './src/components/SettingsScreen';
import FingerprintAuthScreen from './src/components/FingerprintAuthScreen';
import CustomDrawerContent from './src/components/CustomDrawerContent';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { MenuProvider, Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
import { AuthProvider, AuthContext } from './src/Context/AuthContext';
import AuthGuard from './src/components/AuthGuard';
import LoadingScreen from './src/screens/LoadingScreen';

const navigationRef = React.createRef<NavigationContainerRef<any>>();
const Drawer = createDrawerNavigator();

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { checkAuthStatus } = useContext(AuthContext);

  useEffect(() => {
    const checkAuthStatusOnStart = async () => {
      await checkAuthStatus();
      setIsLoading(false);
    };

    checkAuthStatusOnStart();
  }, []);

  useEffect(() => {
    const handleBackPress = () => {
      if (!navigationRef.current) {
        return false;
      }

      const currentRoute = navigationRef.current.getCurrentRoute();
      if (currentRoute?.name === 'Scan') {
        Alert.alert(
          'Exit App',
          'Are you sure you want to exit the app?',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Yes', onPress: () => BackHandler.exitApp() },
          ]
        );
        return true;
      } else {
        navigationRef.current.navigate('Scan');
        return true;
      }
    };

    const backHandlerSubscription = BackHandler.addEventListener('hardwareBackPress', handleBackPress);
    return () => backHandlerSubscription.remove();
  }, []);

  useEffect(() => {
    const handleAppStateChange = async (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active') {
        await checkAuthStatus();
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => subscription.remove();
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <AuthProvider>
      <MenuProvider>
        <NavigationContainer ref={navigationRef}>
          <AuthGuard>
            <Drawer.Navigator
              initialRouteName="Scan"
              drawerContent={(props) => <CustomDrawerContent {...props} />}
            >
              <Drawer.Screen
                name="Scan"
                component={ScanScreen}
                options={({ navigation }) => ({
                  drawerIcon: ({ color, size }) => (
                    <MaterialIcons name="camera-alt" size={size} color={color} />
                  ),
                  headerTransparent: true,
                  headerTitle: '',
                  headerLeft: () => (
                    <TouchableOpacity onPress={() => navigation.openDrawer()} style={styles.iconButton}>
                      <MaterialIcons name="menu" size={24} color="white" />
                    </TouchableOpacity>
                  ),
                  headerRight: () => (
                    <View style={styles.headerRight}>
                      <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('Scan', { action: 'toggleTorch' })}>
                        <MaterialIcons name="flash-on" size={24} color="white" />
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('Scan', { action: 'switchCamera' })}>
                        <MaterialIcons name="rotate-right" size={24} color="white" />
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('Scan', { action: 'zoomIn' })}>
                        <MaterialIcons name="zoom-in" size={24} color="white" />
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('Scan', { action: 'zoomOut' })}>
                        <MaterialIcons name="zoom-out" size={24} color="white" />
                      </TouchableOpacity>
                    </View>
                  ),
                })}
              />
              <Drawer.Screen
                name="History"
               