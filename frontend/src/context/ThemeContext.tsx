import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

interface ThemeContextType {
  fontFamily: string;
  themeMode: 'light' | 'dark';
  primaryColor: number;
  secondaryColor: number;
  backgroundColor: number;
  textColor: number;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<ThemeContextType>({
    fontFamily: 'Arial',
    themeMode: 'light',
    primaryColor: 56,
    secondaryColor: 180,
    backgroundColor: 0,
    textColor: 0,
  });

  useEffect(() => {
    fetchThemeSettings();
  }, []);

  const fetchThemeSettings = async () => {
    try {
      const response = await axios.get('/api/configurations');
      const config = response.data[0];
      setTheme({
        fontFamily: config.fontFamily,
        themeMode: config.themeMode,
        primaryColor: config.primaryColor,
        secondaryColor: config.secondaryColor,
        backgroundColor: config.backgroundColor,
        textColor: config.textColor,
      });
    } catch (error) {
      console.error('Error fetching theme settings:', error);
    }
  };

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
} 