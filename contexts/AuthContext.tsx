import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, UserRole, Wedding } from '@/lib/types';
import { router } from 'expo-router';

type AuthContextType = {
  user: User | null;
  wedding: Wedding | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, userData: Omit<User, 'id'>) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<void>;
  updateWedding: (weddingData: Partial<Wedding>) => Promise<void>;
  hasRole: (roles: UserRole[]) => boolean;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [wedding, setWedding] = useState<Wedding | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const isAuthenticated = !!user;

  // Cargar datos del usuario y la boda al iniciar
  const loadData = useCallback(async () => {
    try {
      const [userData, weddingData] = await Promise.all([
        AsyncStorage.getItem('user'),
        AsyncStorage.getItem('wedding'),
      ]);

      if (userData) {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        
        // Si hay datos de boda, cargarlos
        if (weddingData) {
          const parsedWedding = JSON.parse(weddingData);
          // Convertir fechas de string a objetos Date
          if (parsedWedding.date) {
            parsedWedding.date = new Date(parsedWedding.date);
          }
          setWedding(parsedWedding);
        }
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Verificar si el usuario tiene alguno de los roles especificados
  const hasRole = useCallback((roles: UserRole[]): boolean => {
    if (!user) return false;
    return roles.includes(user.role);
  }, [user]);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      // Simular llamada a la API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Crear usuario mock con la estructura correcta
      const userData: User = {
        id: '1',
        email,
        firstName: email.split('@')[0],
        lastName: 'Usuario',
        role: 'spouse',
      };
      
      await AsyncStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);

      const weddingData = await AsyncStorage.getItem('wedding');
      if (weddingData) {
        router.replace('/(tabs)');
      } else {
        router.replace('/onboarding');
      }
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, userData: Omit<User, 'id'>) => {
    try {
      setIsLoading(true);
      // Aquí iría la lógica de registro real
      // Por ahora usamos un mock
      const newUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        ...userData,
      };
      
      // Guardar usuario en AsyncStorage
      await AsyncStorage.setItem('user', JSON.stringify(newUser));
      setUser(newUser);
      
      const weddingData = await AsyncStorage.getItem('wedding');
      if (weddingData) {
        router.replace('/(tabs)');
      } else {
        router.replace('/onboarding');
      }
    } catch (error) {
      console.error('Registration error:', error);
      throw new Error('Error al registrar el usuario');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      // Limpiar datos de autenticación
      await AsyncStorage.multiRemove(['user', 'wedding']);
      setUser(null);
      setWedding(null);
      
      // Redirigir a la pantalla de inicio de sesión
      router.replace('/(auth)/login');
    } catch (error) {
      console.error('Logout error:', error);
      throw new Error('Error al cerrar sesión');
    } finally {
      setIsLoading(false);
    }
  };
  
  const updateUser = async (userData: Partial<User>) => {
    if (!user) return;
    
    try {
      const updatedUser = { ...user, ...userData };
      await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
    } catch (error) {
      console.error('Error updating user:', error);
      throw new Error('Error al actualizar el perfil');
    }
  };
  
  const updateWedding = async (weddingData: Partial<Wedding>) => {
    try {
      const updatedWedding = { ...(wedding ?? {}), ...weddingData } as Wedding;
      await AsyncStorage.setItem('wedding', JSON.stringify(updatedWedding));
      setWedding(updatedWedding);
    } catch (error) {
      console.error('Error updating wedding:', error);
      throw new Error('Error al actualizar los datos de la boda');
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      wedding,
      isLoading,
      isAuthenticated,
      login,
      register,
      logout,
      updateUser,
      updateWedding,
      hasRole,
    }}>
      {children}
    </AuthContext.Provider>
  );
};
