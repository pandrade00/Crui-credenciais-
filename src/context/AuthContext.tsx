import { createContext, useState, useContext } from 'react';
import type  {AuthContextI}  from '../interfaces/AuthContextInnterface';

const localStorageKey = '@App:token';

export const AuthContext = createContext<AuthContextI | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem(localStorageKey) || null;
  });

  const login = (newToken: string) => {
    setToken(newToken);
    localStorage.setItem(localStorageKey, newToken);
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem(localStorageKey);
  };

  return (
    <AuthContext.Provider value={{ 
      token, 
      isAuthenticated: !!token, 
      login, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextI => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  
  return context;
};