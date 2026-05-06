import { createContext, useState, useEffect } from 'react';
import { setLoadingHandler } from '../api/axios';

export const LoadingContext = createContext();

export const LoadingProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoadingHandler(setLoading);
  }, []);

  return (
    <LoadingContext.Provider value={{ loading, setLoading }}>
      {children}
    </LoadingContext.Provider>
  );
};
