import React, { useContext } from 'react';


import {
  Articles,
  Components,
  Home,
  Profile,
  Register,
  AddCategory,
  SignIn
} from '../screens';
import {useScreenOptions, useTranslation} from '../hooks';
import {AuthContext} from '../context/AuthContext';

import Configuration from '../screens/Configuration';

const Stack = createStackNavigator();
import { createStackNavigator } from '@react-navigation/stack';

export default () => {
  const { signedIn } = useContext(AuthContext);
  const { t } = useTranslation();
  const screenOptions = useScreenOptions();

  return (
    <Stack.Navigator screenOptions={screenOptions.stack}>
      {signedIn ? (
        <>
          <Stack.Screen
            name="Home"
            component={Home}
            options={{ title: t('navigation.home') }}
          />
          <Stack.Screen
            name="AddCategories"
            component={AddCategory}
            options={screenOptions.components}
          />
          <Stack.Screen
            name="Components"
            component={Components}
            options={screenOptions.components}
          />
          <Stack.Screen
            name="Articles"
            component={Articles}
            options={{ title: t('navigation.articles') }}
          />
          <Stack.Screen
            name="Profile"
            component={Profile}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Configuration"
            component={Configuration}
            options={screenOptions.components}
          />
        </>
      ) : (
        <>
          <Stack.Screen
            name="Register"
            component={Register}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="SignIn"
            component={SignIn}
            options={{ headerShown: false }}
          />
        </>
      )}
    </Stack.Navigator>
  );
};
