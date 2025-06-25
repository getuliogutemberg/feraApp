import { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Sidebar.css";
import { ChartLine,ChartColumn ,ListFilter,CircleEllipsis,Wallpaper   } from 'lucide-react';
import { 
    FaTachometerAlt, 
    FaCog, FaBars, 
  // FaUser,
  // FaGavel,
  // FaFileAlt,
  FaChevronDown,
  FaChevronRight,
  FaUsers,
  FaUserTie,
  FaDollarSign,
  FaCar,
  
} from "react-icons/fa"; // Ícones aprimorados

import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { Box } from "@mui/system";



interface SubRoute {
  path: string;
  icon: string;
  component: string;
  name: string;
  requiredRole: string[];
  pageId?: string;
  reportId?: string,
  workspaceId?: string,
}

interface MenuGroup {
  id: string;
  name: string;
  component: string;
  icon: string;
  path: string;
  subRoutes: SubRoute[];
  requiredRole?: string[];
}
const Sidebar = () => {
  const { user  } = useContext(AuthContext);
 
  
  const [expanded, setExpanded] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  
  const [menuGroups, setMenuGroups] = useState<MenuGroup[]>([]);

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

  // Função para alternar expansão
  
  const toggleGroup = (groupId: string) => {
    setExpandedGroups(prev => {
      const newSet = new Set(prev);
      if (newSet.has(groupId)) {
        newSet.delete(groupId);
      } else {
        newSet.add(groupId);
      }
      return newSet;
    });
  };
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'dashboard': return <FaTachometerAlt />;
      case 'menu': return <FaBars />;
      case 'chartLine': return <ChartLine />;
      case 'chartColumn': return <ChartColumn/>;
      case 'listFilter': return <ListFilter/>;
    
      case 'settings': return <FaCog />;
      case 'users': return <FaUsers />;
      case 'employees': return <FaUserTie />;
      case 'finance': return <FaDollarSign />;
      case 'parking': return <FaCar />;
      default: return <FaCog />;
    }
  };
  

  if (user ) return (
    <aside 

    style={{
      boxShadow: '0px 0px 10px rgba(0, 0, 0,0.2)'
    }}
    onMouseLeave={()=>setExpanded(false)}
      className={`sidebar ${expanded ? "expanded" : ""}`} 
      // onMouseEnter={() => setExpanded(true)} 
      onMouseEnter={()=>setExpanded(true)}
      // onMouseLeave={() => setExpanded(false)}
    >
      
      <ul className="sidebar-list" style={{width:"100%",margin:0,padding:0}} >
      <li title="Menu" style={{background:"#d3d3d3",paddingTop:5,margin:0}} ><button onClick={()=>setExpanded(true)} className="menu-button" ><FaBars   /><span>{expanded && ""}</span></button></li>
        {/* <li title="Home"><Link to="/"><FaHome /><span>Home</span></Link></li> */}
        {user && menuGroups
          // .filter(group => user.className !== 'OWNER' ? group.requiredRole?.includes(user.category) : group)
          .map((group) => (
            group.requiredRole?.includes(user.className) && group.component ===  'MenuGroup' ? <li key={group.id}  >
              
              <div 
              title={group.name}
                className="group-header"
                onClick={() => toggleGroup(group.id)}
                style={{
                  paddingLeft:'15px',
                  background: !expandedGroups.has(group.id) ? "rgba(255, 255, 255, 0.0)" : "rgba(243,129,30,0.5)",
                }}
              >
                <Box sx={{
                  fontSize: "24px"
                }} >{getIcon(group.icon)}</Box>

                {expanded && <span>{group.name}</span>}
                { (
                  expandedGroups.has(group.id) ? <FaChevronDown /> : <FaChevronRight />
                )}
              </div>

              {expandedGroups.has(group.id) && (
                <ul className="submenu" style={{
                  background: !expandedGroups.has(group.id) ? "rgba(255, 255, 255, 0.0)" : "rgba(243,129,30,0.3)",
                  
                  color: "#ffffff",
                  padding: "0px",
                  display: "flex",
                  flexDirection: "column",
                  
              
                }}>
                  {group.subRoutes.map((route) => (
                    <li key={route.path} title={route.name}>
                      <Link 
                      // onMouseLeave={()=>toggleGroup(group.id)}
                      onClick={() =>{ 
                        // setExpanded(false);
                        
                        }} to={`${group.path}${route.path}`}>
                        {getIcon(route.icon)}
                        <span>{route.name}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li> :
             <li key={group.path} title={group.name}>
             <Link 
             
             style={{margin:0}}
             // onMouseLeave={()=>toggleGroup(group.id)}
             onClick={() =>{ 
               // setExpanded(false);
               }} to={`${group.path}`}>
               {getIcon(group.icon)}
               <span >{group.name}</span>
             </Link>
           </li>
          ))}

     
<ul className="sidebar-list">

       
      </ul>
      </ul>

      <ul className="sidebar-options">
        {['ADMIN','OWNER'].includes(user.className) && <li title="Opcões"><Link to="/opções"><CircleEllipsis  /> <span>Opções</span></Link></li> }
        {['ADMIN','OWNER'].includes(user.className) && <li title="Dados"><Link to="/admin-database"><FaCog /> <span>Dados</span></Link></li>}
        {['ADMIN','OWNER'].includes(user.className) && <li title="Administrador"><Link to="/administrador"><Wallpaper  /><span>Administrador</span></Link></li>}
        

        
      </ul>
    </aside>
  );
};

export default Sidebar;
