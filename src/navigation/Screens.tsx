import React, {useContext} from 'react';

import {
  Analysis,
  Home,
  Register,
  CategoryForm,
  ExpenseForm,
  Categories,
  SignIn,
  CategoryDetails,
  ExpenseDetails,
} from '../screens';
import {useScreenOptions, useTranslation} from '../hooks';
import {AuthContext} from '../context/AuthContext';

import Configuration from '../screens/Configuration';

const Stack = createStackNavigator();
import {createStackNavigator} from '@react-navigation/stack';
import {Text} from '../components';
import {StatusBar} from 'expo-status-bar';

export default () => {
  const {signedIn, isAdmin} = useContext(AuthContext);
  const {t} = useTranslation();
  const screenOptions = useScreenOptions();

  return (
    <Stack.Navigator screenOptions={screenOptions.stack}>
      {signedIn ? (
        <>
          <Stack.Screen
            name="Home"
            component={Home}
            options={{
              ...screenOptions.components,
              headerTitle: () => (
                <Text p white>
                  {t('navigation.home')}
                </Text>
              ),
            }}
          />
          <Stack.Screen
            name="ExpenseDetails"
            component={ExpenseDetails}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Register"
            component={Home}
            options={{title: t('navigation.home')}}
          />
          {isAdmin && (
            <>
              <Stack.Screen
                name="CategoryForm"
                component={CategoryForm}
                options={{headerShown: false}}
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
                name="CategoryDetails"
                component={CategoryDetails}
                options={{headerShown: false}}
              />
            </>
          )}
          <Stack.Screen
            name="ExpenseForm"
            component={ExpenseForm}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Analytics"
            component={Analysis}
            options={{
              ...screenOptions.components,
              headerTitle: () => (
                <Text p white>
                  {t('navigation.analytics')}
                </Text>
              ),
            }}
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
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="SignIn"
            component={SignIn}
            options={{headerShown: false}}
          />
        </>
      )}
    </Stack.Navigator>
  );
};
