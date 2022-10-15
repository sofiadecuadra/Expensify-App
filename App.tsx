import 'react-native-gesture-handler';
import React from 'react';

import {DataProvider} from './src/hooks';
import AppNavigation from './src/navigation/App';
import {QueryClient, QueryClientProvider} from 'react-query';

const queryClient = new QueryClient();

export const invalidateQueries = (keys: any) => {
  queryClient.invalidateQueries(keys);
};

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <DataProvider>
        <AppNavigation />
      </DataProvider>
    </QueryClientProvider>
  );
}
