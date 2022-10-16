import React, {useState, createContext} from 'react';

export const AlertContext = createContext({
  errorMessage: '',
  successMessage: '',
  setErrorMessage: (message: string) => {
    message;
  },
  setSuccessMessage: (message: string) => {
    message;
  },
});

export const AlertProvider = ({children}: any) => {
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  return (
    <AlertContext.Provider
      value={{
        errorMessage,
        successMessage,
        setErrorMessage,
        setSuccessMessage,
      }}>
      {children}
    </AlertContext.Provider>
  );
};
