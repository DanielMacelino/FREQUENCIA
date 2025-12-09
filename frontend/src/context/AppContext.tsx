import React, { createContext, useContext, useState, useEffect } from 'react';
import { AppContextType } from '../types';

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('selectedUser');
    if (stored) {
      setSelectedUser(stored);
    }
  }, []);

  const handleSetSelectedUser = (user: string) => {
    setSelectedUser(user);
    localStorage.setItem('selectedUser', user);
  };

  return (
    <AppContext.Provider value={{ selectedUser, setSelectedUser: handleSetSelectedUser }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext deve ser usado dentro de AppProvider');
  }
  return context;
};
