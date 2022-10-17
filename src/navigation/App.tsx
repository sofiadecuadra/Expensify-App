import React from 'react';
import {useFonts} from 'expo-font';
import AppLoading from 'expo-app-loading';
import {NavigationContainer, DefaultTheme} from '@react-navigation/native';

import Menu from './Menu';
import {useData, ThemeProvider, TranslationProvider} from '../hooks';

import * as Linking from 'expo-linking';
import {Text} from '../components';

const prefix = Linking.createURL('/');

export default () => {
  const {isDark, theme, setTheme} = useData();

  // load custom fonts
  const [fontsLoaded] = useFonts({
    'OpenSans-Light': theme.assets.OpenSansLight,
    'OpenSans-Regular': theme.assets.OpenSansRegular,
    'OpenSans-SemiBold': theme.assets.OpenSansSemiBold,
    'OpenSans-ExtraBold': theme.assets.OpenSansExtraBold,
    'OpenSans-Bold': theme.assets.OpenSansBold,
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  const navigationTheme = {
    ...DefaultTheme,
    dark: isDark,
    colors: {
      ...DefaultTheme.colors,
      border: 'rgba(0,0,0,0)',
      text: String(theme.colors.text),
      card: String(theme.colors.card),
      primary: String(theme.colors.primary),
      notification: String(theme.colors.primary),
      background: String(theme.colors.background),
    },
  };

  const linking = {
    prefixes: [prefix],
    config: {
      screens: {
        Screens: {
          path: 'screens',
          screens: {
            Register: 'register/:inviteToken',
          },
        },
        NotFound: '*',
      },
    },
  };

  return (
    <TranslationProvider>
      <ThemeProvider theme={theme} setTheme={setTheme}>
        <NavigationContainer
          linking={linking}
          fallback={<Text>Loading...</Text>}
          theme={navigationTheme}>
          <Menu />
        </NavigationContainer>
      </ThemeProvider>
    </TranslationProvider>
  );
};
