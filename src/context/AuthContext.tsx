import React, {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = React.createContext({
  signedIn: false,
  sessionData: {role: undefined},
  signIn: async (data: any) => {
    data;
  },
  signOut: async () => {},
  isAdmin: false,
});

const tryGetSessionData = async () => {
  try {
    const sessionData = await AsyncStorage.getItem('sessionData');
    if (sessionData) {
      return JSON.parse(sessionData);
    }
    return null;
  } catch (e) {
    return null;
  }
};

export const AuthProvider = ({children}: any) => {
  const [sessionData, setSessionData] = useState({role: undefined});
  const signedIn = sessionData.role !== undefined;

  useEffect(() => {
    tryGetSessionData().then((data) => {
      if (data) {
        setSessionData(data);
      }
    });
  }, []);

  const signOut = async () => {
    AsyncStorage.removeItem('sessionData');
    setSessionData({role: undefined});
  };

  const signIn = async (data: any) => {
    AsyncStorage.setItem('sessionData', JSON.stringify(data));
    setSessionData(data);
  };

  const isAdmin = sessionData?.role === 1;

  return (
    <AuthContext.Provider
      value={{signedIn, sessionData, signIn, signOut, isAdmin}}>
      {children}
    </AuthContext.Provider>
  );
};
