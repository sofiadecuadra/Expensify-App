import 'react-native-gesture-handler';
import React from 'react';

import {DataProvider} from './src/hooks';
import AppNavigation from './src/navigation/App';
import {QueryClient, QueryClientProvider} from 'react-query';
import {AuthProvider} from './src/context/AuthContext';
import {AlertProvider} from './src/context/AlertContext';
import {SafeAreaProvider} from 'react-native-safe-area-context';

const queryClient = new QueryClient();

export const invalidateQueries = (keys: any) => {
  queryClient.invalidateQueries(keys);
};

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <DataProvider>
        <AuthProvider>
          <AlertProvider>
            <SafeAreaProvider>
              <AppNavigation />
            </SafeAreaProvider>
          </AlertProvider>
        </AuthProvider>
      </DataProvider>
    </QueryClientProvider>
  );
}
