import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { SnackbarProvider } from 'notistack';

import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import ProtectedRoute from "./components/ProtectedRoute"; // Importa a proteção de rotas

import Admin from './pages/Admin.tsx';
import Alerts from './pages/Alerts.tsx';
import Contact from './pages/Contact.tsx';
// import DashPBI from './pages/DashPBI.tsx';
import Faq from './pages/Faq.tsx';
import HelpDesk from './pages/HelpDesk.tsx';
import Login from './pages/Login';
import NotFound from './pages/NotFound.tsx';
import Profile from './pages/Profile.tsx';
import Register from './pages/Register.tsx'; 
import Settings from './pages/Settings';
import Unauthorized from './pages/Unauthorized.tsx';
import Estrategica from './pages/Estrategica.tsx';
import socket from  'socket.io-client';
import Users from './pages/Users.tsx';
import RoutesEdit from './pages/RoutesEdit.tsx';
import NavEdit from './pages/NavEdit.tsx';
import axios from 'axios';
import { Key, useEffect, useState } from 'react';
import DashPBI from './pages/DashPBI.tsx';
import RequireRegister from './pages/RequireRegister.tsx';
import { PaletteMode } from '@mui/material';
import Teste from './pages/Teste.tsx';
import ThemeCustomization from './pages/ThemeCustomization.tsx';
import ForgotPassword from './pages/ForgotPassword.tsx';
import ResetPassword from './pages/ResetPassword.tsx';

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

interface Route { 
  _id: Key | null | undefined; 
  path: string | undefined; 
  requiredRole: string[] | undefined; 
  component: string; 
  pageId: string,
  reportId: string,
  workspaceId: string,
}

// Criar uma conexão com o socket.io
socket('http://localhost:5000');

interface SubRoute {

  path: string;
  icon: string;
  component: string;
  name: string;
  requiredRole: string[];
  pageId?: string | null;
  reportId?: string | null,
  workspaceId?: string | null,
}

interface MenuGroup {
  pageId?: string | null;
  reportId?: string | null,
  workspaceId?: string | null,
  id: string;
  name: string;
  component: string;
  icon: string;
  path: string;
  subRoutes: SubRoute[];
  requiredRole?: string[];
}

function App() {
  // const [routes, setRoutes] = useState<SubRoute[]>([]); // Estado para armazenar as rotas dinâmicas
  const [menuGroups, setMenuGroups] = useState<MenuGroup[]>([]);
  const [settings, setSettings] = useState<Configuration | null>(null);

  useEffect(() => {
    
    // Carregar os grupos de menu do backend
    const fetchMenuGroups = async () => {
      
      try {
        const response = await axios.get<MenuGroup[]>("http://localhost:5000/menu-groups")
         
        
        setMenuGroups(response.data);
      } catch (error) {
        console.error('Erro ao carregar grupos de menu:', error);
      }
    };
    
    fetchMenuGroups();
  }, []);
  
  useEffect(() => {
    // Fetch settings from backend
    const fetchSettings = async () => {
      try {
        const response = await axios.get('http://localhost:5000/configuration');
        setSettings(response.data);
        
       
        
      } catch (error) {
        console.error('Erro ao buscar configurações:', error);
      }
    };

    fetchSettings();
  }, []);

 

  
  

  
  
  return (
    <SnackbarProvider maxSnack={3}>
      <ThemeProvider>
        <Router>
          <Navbar  />
          <Sidebar />
        
         <Routes>

         {menuGroups.map((group) =>
          group.subRoutes.map((sub) => (
        <Route
          key={group.id + sub.path}
          path={group.path + sub.path}
          element=
            {sub.component === "Dashboard Power BI" ? 
                <ProtectedRoute requiredRole={sub.requiredRole}>
                <DashPBI pageId={sub.pageId || null } reportId={sub.reportId || null } workspaceId={sub.workspaceId || null } />
                </ProtectedRoute>
               : sub.component === "Gestão de Grupos e Materiais" ? 
                <ProtectedRoute requiredRole={sub.requiredRole}>
                <Estrategica />
                </ProtectedRoute>
               : sub.component === "Teste" ? 
                <ProtectedRoute requiredRole={sub.requiredRole}>
                <Teste />
                </ProtectedRoute>
               : 
                <div>Componente não encontrado</div>

              }
          
        />
      ))
    )}


  {menuGroups.map((group) =>
          
          <Route
          key={group.id}
          path={group.path}
          element={
            <ProtectedRoute requiredRole={group.requiredRole}  >
              {group.component === "Dashboard Power BI" ? <DashPBI pageId={group.pageId || null} reportId={group.reportId  || null } workspaceId={group.workspaceId  || null} />:
              group.component === "Gestão de Grupos e Materiais" ? <Estrategica /> :
              group.component === "Teste" ? <Teste /> :
               <></>
              }
            </ProtectedRoute>
          }
        />
    )}
          
       




        {/* <Route path="/" element={<Home />} /> */}        <Route path="/" element={<Navigate to={"/login"} />} />
        
        <Route path="/login" element={<Login />} />
        <Route path="/esqueci-senha" element={<ForgotPassword />} />
        <Route path="/redefinir-senha/:token" element={<ResetPassword />} />
        {settings?.allowRegister && <Route path="/registro" element={<Register />} />}
           <Route path="/solicitar-registro" element={
            settings?.allowRequireRegister ? <RequireRegister /> :<ProtectedRoute  >
              <RequireRegister />
           </ProtectedRoute>  
          } />
        <Route path="/faq" element={<Faq />} />
        <Route path="/contact" element={<Contact />} />
        

            <Route path="/cadastro" element={ <ProtectedRoute >
              <Profile />
    
        </ProtectedRoute>} /> 

            
        <Route path="/ajuda" element={ <ProtectedRoute >
              <HelpDesk />
            </ProtectedRoute>} /> 
           
            <Route path="/alertas" element={ <ProtectedRoute >
              <Alerts />
            </ProtectedRoute>} /> 

            <Route path="/opções" element={ <ProtectedRoute requiredRole={["ADMIN","OWNER"]}  >
              <Admin />
            </ProtectedRoute>} /> 


            <Route path="/usuários" element={ <ProtectedRoute requiredRole={["ADMIN","OWNER"]}  >
              <Users />
            </ProtectedRoute>} /> 
            <Route path="/módulos" element={ <ProtectedRoute requiredRole={["OWNER","ADMIN"]}  >
              <RoutesEdit />
            </ProtectedRoute>} /> 
            <Route path="/navegação" element={ <ProtectedRoute requiredRole={["OWNER","ADMIN"]}  >
              <NavEdit />
            </ProtectedRoute>} /> 
        <Route path="/administrador" element={ <ProtectedRoute requiredRole={["ADMIN","OWNER"]} >
              <Settings />
    
        </ProtectedRoute>} /> 

        <Route path="/customização" element={
          <ProtectedRoute requiredRole={["ADMIN", "OWNER"]}>
            <ThemeCustomization />
          </ProtectedRoute>
        } />

        <Route path="/rota-restrita" element={ <Unauthorized/> } /> 
        <Route path="*" element={<NotFound />} />
        
      </Routes>
      
    </Router>
  </ThemeProvider>
</SnackbarProvider>
);
}

export default App;

