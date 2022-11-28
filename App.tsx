import { useCallback } from 'react';

import { SafeAreaProvider } from 'react-native-safe-area-context';

import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import Routes from './navigation/routes';
import { AuthProvider } from './src/context/authContext';

SplashScreen.preventAutoHideAsync();

export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  const [fontsLoaded] = useFonts({
    'nunito-medium': require('./assets/fonts/Nunito-Medium.ttf'),
    'nunito-bold': require('./assets/fonts/Nunito-Bold.ttf'),
    'nunito-regular': require('./assets/fonts/Nunito-Regular.ttf'),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  if (!isLoadingComplete)
    return null;


  return (
    <SafeAreaProvider>
      <StatusBar style={colorScheme == 'light' ? 'dark' : 'light'} />

      <AuthProvider>

        <Routes />
        
      </AuthProvider>
    </SafeAreaProvider>
  );

}
