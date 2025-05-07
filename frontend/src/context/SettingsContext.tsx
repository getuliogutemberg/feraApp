import { createContext, useState,  ReactNode, } from "react";

import { PaletteMode } from "@mui/material";

// Tipagem para o settings
interface Configuration {
    notifications: boolean;
    allowRegister: boolean;
    allowRequireRegister: boolean;
    allowNewCategory: boolean;
    allowNewClassName: boolean;
    addSecretKey: boolean;
    addCategory: boolean;
    fontFamily: string;
    pageTitle: string;
    themeMode: PaletteMode;
    primaryColor: number;
    secondaryColor: number;
    backgroundColor: number;
    textColor: number;
    pbiKeys: {
      clientId: string;
      clientSecret: string;
      authority: string;
    };
  }

// Tipagem para o contexto
interface SettingsContextType {
  configuration: Configuration | null;
  setConfiguration: (configuration: Configuration | null) => void;
  
}

// Criando contexto com valores iniciais
export const SettingsContext = createContext<SettingsContextType>({
  configuration: null,
  setConfiguration: () => {},
});

// Tipagem para o Provider
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [configuration, setConfiguration] = useState<Configuration | null>(null);
  

  return (
    <SettingsContext.Provider value={{ configuration, setConfiguration }}>
      {children}
    </SettingsContext.Provider>
  );
};
