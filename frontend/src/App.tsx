import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

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
import axios from 'axios';
import { Key, useEffect, useState } from 'react';
import DashPBI from './pages/DashPBI.tsx';
import RequireRegister from './pages/RequireRegister.tsx';
import { PaletteMode } from '@mui/material';
import Teste from './pages/Teste.tsx';

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
  _id: string;
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
    const fetchRoutes = async () => {
      try {
        const response = await axios.get("http://localhost:5000/routes");
        // setRoutes(response.data); // Atualiza o estado com os dados recebidos
        return response.data
      } catch (error) {
        console.error("Erro ao buscar as rotas:", error);
      }
    };

    
    // Carregar os grupos de menu do backend
    const fetchMenuGroups = async () => {
      const routes = await fetchRoutes() as SubRoute[];
      try {
        const response = routes &&  [
          // {
          //   _id: "1",
          //   name: "Teste",
          //   icon: "parking",
          //   path: "/test",
          //   subRoutes: [],
          //   requiredRole: ["OWNER"],
          // },
          {
            _id: "2",
            "name": "Diagnóstico",
            "icon": "file",
            "component": 'MenuGroup',
            "path": "/diagnóstico",
            "subRoutes": [
              ...routes.map((route) => ({
                path: route.path,
                icon: route.icon,
                name: route.name,
                component: route.component,
                requiredRole: route.requiredRole, // <- antes tava errado aqui
                pageId: route.pageId,
                reportId: route.reportId,
                workspaceId: route.workspaceId,
              })),
             
             
            ].filter((router) => router.component === "Dashboard Power BI" ),
            "requiredRole": ["OWNER","ADMIN","CLIENT"],
            workspaceId: null,
            reportId: null,
            pageId: null
          },
          {
            _id: "3",
            "name": "Análise de Criticidade",
            "icon": "file",
            "component": 'MenuGroup',
            "path": "/criticidade",
            "subRoutes": [
              ...routes.map((route) => ({
                path: route.path,
                icon: route.icon,
                name: route.name,
                component: route.component,
                requiredRole: route.requiredRole, // <- antes tava errado aqui
                pageId: route.pageId,
                reportId: route.reportId,
                workspaceId: route.workspaceId,
              })),
             
             
            ].filter((router) => router.component === "Dashboard Power BI" ),
            "requiredRole": ["OWNER","ADMIN","CLIENT"],
            workspaceId: null,
            reportId: null,
            pageId: null
          },
          ...routes
          .filter((route) => route.name === "Ganho Agregado")
          .map((route) => ({
            _id: "4",
            path: route.path,
            icon: route.icon,
            name: route.name,
            component: route.component,
            requiredRole: route.requiredRole,
            pageId: route.pageId ,
            reportId: route.reportId,
            workspaceId: route.workspaceId,
            subRoutes: [],
            // Add any other required MenuGroup fields here
          })),
          
          {
            _id: "5",
            "name": "Projeções",
            "icon": "file",
            "component": 'MenuGroup',
            "path": "/projeções",
            "subRoutes": [
              ...routes.map((route) => ({
                path: route.path,
                icon: route.icon,
                name: route.name,
                component: route.component,
                requiredRole: route.requiredRole, // <- antes tava errado aqui
                pageId: route.pageId,
                reportId: route.reportId,
                workspaceId: route.workspaceId,
              })),
             
             
            ].filter((router) => router.component === "Dashboard Power BI" ),
            "requiredRole": ["OWNER","ADMIN","CLIENT"],
            workspaceId: null,
            reportId: null,
            pageId: null
          },
          {
            _id: "6",
            "name": "Priorizações",
            "icon": "file",
            "component": 'MenuGroup',
            "path": "/priorizações",
            "subRoutes": [
              ...routes.map((route) => ({
                path: route.path,
                icon: route.icon,
                name: route.name,
                component: route.component,
                requiredRole: route.requiredRole, // <- antes tava errado aqui
                pageId: route.pageId,
                reportId: route.reportId,
                workspaceId: route.workspaceId,
              })),
              
             
             
            ].filter((router) => router.component === "Dashboard Power BI" ),
            "requiredRole": ["OWNER","ADMIN","CLIENT"],
            workspaceId: null,
            reportId: null,
            pageId: null
          },

         
         
        ];
        console.log(response)
        setMenuGroups(response);
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
    <Router>
      
      <Navbar  />
      <Sidebar />
    
     <Routes>

     {menuGroups.map((group) =>
      group.subRoutes.map((sub) => (
    <Route
      key={group._id + sub.path}
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


{menuGroups.filter((menu) => menu.component === "Dashboard Power BI").map((group) =>
      
        <Route
        key={group._id}
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
      
   




        {/* <Route path="/" element={<Home />} /> */}
        <Route path="/" element={<Navigate to={"/login"} />} />
        
        <Route path="/login" element={<Login />} />
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
            <Route path="/módulos" element={ <ProtectedRoute requiredRole={["OWNER"]}  >
              <RoutesEdit />
            </ProtectedRoute>} /> 
        <Route path="/administrador" element={ <ProtectedRoute requiredRole={["ADMIN","OWNER"]} >
              <Settings />
    
        </ProtectedRoute>} /> 

        
       

        <Route path="/rota-restrita" element={ <Unauthorized/> } /> 
        <Route path="*" element={<NotFound />} />
        
      </Routes>
      
    </Router>
    
  );
}

export default App;

