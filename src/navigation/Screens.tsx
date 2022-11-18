import React, { useContext } from 'react';

import {
  Articles,
  Components,
  Home,
  Profile,
  Register,
  CategoryForm,
  Categories,
  SignIn,
  CategoryDetails,
  ExpenseDetails,
} from '../screens';
import { useScreenOptions, useTranslation } from '../hooks';
import { AuthContext } from '../context/AuthContext';

import Configuration from '../screens/Configuration';

const Stack = createStackNavigator();
import { createStackNavigator } from '@react-navigation/stack';
import { Text } from '../components';

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
            name="ExpenseDetails"
            component={ExpenseDetails}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Register"
            component={Home}
            options={{ title: t('navigation.home') }}
          />
          <Stack.Screen
            name="CategoryForm"
            component={CategoryForm}
            options={{
              ...screenOptions.components,
              headerTitle: () => (
                <Text p white>
                  {t('navigation.add_category')}
                </Text>
              ),
            }}
          />
          <Stack.Screen
            name="CategoryDetails"
            component={CategoryDetails}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Categories"
            component={Categories}
            options={{
              ...screenOptions.components,
              headerTitle: () => (
                <Text p white>
                  {t('navigation.categories')}
                </Text>
              ),
            }}
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
            options={{
              ...screenOptions.components,
              headerTitle: () => (
                <Text p white>
                  {t('navigation.configuration')}
                </Text>
              ),
            }}
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
