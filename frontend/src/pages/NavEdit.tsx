import { useEffect, useState } from 'react';
import { Box, Button, Card, CardContent, TextField, Typography } from '@mui/material';
import axios from 'axios';
import { Add, Delete} from "@mui/icons-material";
import { Dialog, DialogTitle, DialogContent, List, ListItem, ListItemText, DialogActions } from '@mui/material';
import { Select, MenuItem, Chip, InputLabel } from '@mui/material';
import { DragEndEvent } from '@dnd-kit/core';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import SortableItem from '../components/SortableItem';
import { motion } from 'framer-motion';
import {
  FaTachometerAlt, FaBars, FaFileAlt, FaCog,
  FaUsers, FaUserTie, FaDollarSign, FaCar
} from "react-icons/fa";
import { ChartLine, ChartColumn, ListFilter } from "lucide-react";
const iconOptions = [
  { value: "dashboard", label: "Dashboard", icon: <FaTachometerAlt /> },
  { value: "menu", label: "Menu", icon: <FaBars /> },
  { value: "file", label: "File", icon: <FaFileAlt /> },
  { value: "settings", label: "Settings", icon: <FaCog /> },
  { value: "users", label: "Users", icon: <FaUsers /> },
  { value: "employees", label: "Employees", icon: <FaUserTie /> },
  { value: "finance", label: "Finance", icon: <FaDollarSign /> },
  { value: "parking", label: "Parking", icon: <FaCar /> },
  { value: "chartLine", label: "Chart Line", icon: <ChartLine /> },
  { value: "chartColumn", label: "Chart Column", icon: <ChartColumn /> },
  { value: "listFilter", label: "List Filter", icon: <ListFilter /> },
];

const categorias = ["OWNER", "ADMIN", "CLIENT"];


interface AddModuleDialogProps {
  open: boolean;
  onClose: () => void;
  availableRoutes: SubRoute[];
  onSelect: (route: SubRoute) => void;
}

export interface SubRoute {
  id: string;
  name: string;
  path: string;
  icon?: string;
  component: string;
  requiredRole: string[];
  pageId?: string;
  reportId?: string;
  workspaceId?: string;
}

export interface MenuGroup {
  id: string;
  name: string;
  icon?: string;
  component: string;
  path: string;
  requiredRole: string[];
  subRoutes: SubRoute[];
  isDirectModule?: boolean;
  pageId?: string;
  reportId?: string;
  workspaceId?: string;
}

interface MenuTypeDialogProps {
  open: boolean;
  onClose: () => void;
  onSelectType: (type: 'module' | 'menu') => void;
}

const MenuTypeDialog = ({ open, onClose, onSelectType }: MenuTypeDialogProps) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Selecione o Tipo de Menu</DialogTitle>
      <DialogContent>
        <List>
          <ListItem 
            sx={{ cursor: 'pointer' }}
            onClick={() => {
              onSelectType('menu');
              onClose();
            }}
          >
            <ListItemText 
              primary="Novo Menu" 
              secondary="Criar um novo grupo de menu que pode conter outros módulos"
            />
          </ListItem>
          <ListItem 
            sx={{ cursor: 'pointer' }}
            onClick={() => {
              onSelectType('module');
              onClose();
            }}
          >
            <ListItemText 
              primary="Módulo Direto" 
              secondary="Adicionar um módulo diretamente como menu"
            />
          </ListItem>
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
      </DialogActions>
    </Dialog>
  );
};

const AddModuleDialog = ({ open, onClose, availableRoutes, onSelect }: AddModuleDialogProps) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Selecione um Módulo</DialogTitle>
      <DialogContent>
        <List>
          {availableRoutes.map((route) => (
            <ListItem 
            sx={{ cursor: 'pointer' }} 
              key={route.id} 
              onClick={() => {
                onSelect(route);
                onClose();
              }}
            >
              <ListItemText primary={route.name} />
            </ListItem>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
      </DialogActions>
    </Dialog>
  );
};

const MenuGroupManager = () => {
  const [menuGroups, setMenuGroups] = useState<MenuGroup[]>([]);
  const [allRoutes, setAllRoutes] = useState<SubRoute[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [menuTypeDialogOpen, setMenuTypeDialogOpen] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
 
  useEffect(() => {
    const fetchRoutes = async (): Promise<SubRoute[]> => {
      try {
        const response = await axios.get<SubRoute[]>("http://localhost:5000/routes");
        return response.data;
      } catch (error) {
        console.error("Erro ao buscar as rotas:", error);
        return [];
      }
    };
    
    const fetchMenuGroups = async () => {
      const routes = await fetchRoutes();
      setAllRoutes(routes);
      console.log(routes)
      try {
        const response = await axios.get<MenuGroup[]>("http://localhost:5000/menu-groups")
  
        
        setMenuGroups(response.data);
      } catch (error) {
        console.error('Erro ao carregar grupos de menu:', error);
      }
    };
  
    fetchMenuGroups();
  }, []);

  const handleAddGroup = () => {
    setMenuTypeDialogOpen(true);
  };

  const handleMenuTypeSelect = (type: 'module' | 'menu') => {
    if (type === 'menu') {
      // Create a new menu group
      const newGroup: MenuGroup = {
        id: crypto.randomUUID(),
        name: "Novo Grupo",
        icon: "menu",
        component: "MenuGroup",
        path: "/novo-grupo",
        requiredRole: ["OWNER", "ADMIN", "CLIENT"],
        subRoutes: [],
        isDirectModule: false,
        pageId: "",  // Adicionar campos vazios
        reportId: "",
        workspaceId: ""
      };
      setMenuGroups((prev) => [...prev, newGroup]);
    } else {
      // Open the module selection dialog
      setSelectedGroupId(crypto.randomUUID());
      setDialogOpen(true);
    }
  };

  const handleRemoveGroup = (groupId: string) => {
    setMenuGroups((prev) => prev.filter((g) => g.id !== groupId));
  };

  const handleEditGroup = (groupId: string, key: keyof MenuGroup, value: string | string[]) => {
    setMenuGroups((prev) =>
      prev.map((group) =>
        group.id === groupId ? { ...group, [key]: value } : group
      )
    );
  };

  
  const handleAddRouteToGroup = (groupId: string) => {
    setSelectedGroupId(groupId);
    setDialogOpen(true);
  };

  const handleRouteSelect = (route: SubRoute) => {
    if (!selectedGroupId) return;
    
    // Check if this is a new direct module or adding to existing group
    const isNewDirectModule = !menuGroups.find(g => g.id === selectedGroupId);
    
    if (isNewDirectModule) {
      // Create a new menu group with the selected module
      const newGroup: MenuGroup = {
        id: selectedGroupId,
        name: route.name,
        icon: route.icon || "menu",
        component: route.component,
        path: route.path,
        requiredRole: route.requiredRole,
        subRoutes: [],
        isDirectModule: true ,
        pageId: route.pageId || "",
        reportId: route.reportId || "",
        workspaceId: route.workspaceId || ""
      };
      setMenuGroups((prev) => [...prev, newGroup]);
    } else {
      // Add to existing group
      setMenuGroups((prev) =>
        prev.map((group) =>
          group.id === selectedGroupId
            ? { ...group, subRoutes: [...group.subRoutes, route] }
            : group
        )
      );
    }
  };

  const getAvailableRoutes = (groupId: string) => {
    const group = menuGroups.find(g => g.id === groupId);
    if (!group) return allRoutes;
    
    return allRoutes.filter(
      (r) => !group.subRoutes.find(s => s.id === r.id)
    );
  };

  const handleRemoveRouteFromGroup = (groupId: string, routeId: string) => {
    setMenuGroups((prev) =>
      prev.map((group) =>
        group.id === groupId
          ? { ...group, subRoutes: group.subRoutes.filter((r) => r.id !== routeId) }
          : group
      )
    );
  };

  const sensors = useSensors(
    useSensor(PointerSensor)
  );

  const handleDragStart = (event: DragEndEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    
    if (!over) return;

    // Se o ID não contém ':', significa que é um grupo
    if (!active.id.toString().includes(':')) {
      const oldIndex = menuGroups.findIndex((g) => g.id === active.id);
      const newIndex = menuGroups.findIndex((g) => g.id === over.id);
      
      if (oldIndex !== -1 && newIndex !== -1) {
        const newMenuGroups = arrayMove(menuGroups, oldIndex, newIndex);
        setMenuGroups(newMenuGroups);
      }
      return;
    }

    // Se contém ':', é um módulo dentro de um grupo
    const [activeGroupId, activeItemId] = active.id.toString().split(':');
    const [overGroupId, overItemId] = over.id.toString().split(':');

    setMenuGroups(prevGroups => {
      // Encontrar os grupos de origem e destino
      const sourceGroup = prevGroups.find(g => g.id === activeGroupId);
      const targetGroup = prevGroups.find(g => g.id === overGroupId);

      if (!sourceGroup || !targetGroup) return prevGroups;

      // Encontrar o item que está sendo movido
      const itemToMove = sourceGroup.subRoutes.find(i => i.id === activeItemId);
      if (!itemToMove) return prevGroups;

      // Criar uma nova cópia do array de grupos
      const newGroups = prevGroups.map(group => {
        if (group.id === activeGroupId) {
          // Remover o item do grupo de origem
          const newSubRoutes = group.subRoutes.filter(i => i.id !== activeItemId);
          return { ...group, subRoutes: newSubRoutes };
        }
        if (group.id === overGroupId) {
          // Adicionar o item ao grupo de destino
          const overIndex = group.subRoutes.findIndex(i => i.id === overItemId);
          const insertIndex = overIndex >= 0 ? overIndex : group.subRoutes.length;
          
          const newSubRoutes = [
            ...group.subRoutes.slice(0, insertIndex),
            itemToMove,
            ...group.subRoutes.slice(insertIndex)
          ];
          return { ...group, subRoutes: newSubRoutes };
        }
        return group;
      });

      return newGroups;
    });
  };

  const renderDragOverlay = () => {
    if (!activeId) return null;

    if (!activeId.includes(':')) {
      const group = menuGroups.find(g => g.id === activeId);
      if (!group) return null;

      return (
        <Card sx={{ 
          width: 300,
          height: 'fit-content',
          boxShadow: 3,
          opacity: 0.8,
          backgroundColor: 'white',
          border: '2px solid #f7801c'
        }}>
          <CardContent>
            <Typography variant="h6">{group.name}</Typography>
          </CardContent>
        </Card>
      );
    }

    const [groupId, itemId] = activeId.split(':');
    const group = menuGroups.find(g => g.id === groupId);
    if (!group) return null;
    const item = group.subRoutes.find(r => r.id === itemId);
    if (!item) return null;

    return (
      <Box sx={{ 
        width: '100%',
        padding: 1,
        backgroundColor: 'white',
        boxShadow: 3,
        borderRadius: 1,
        opacity: 0.8,
        border: '2px solid #f7801c'
      }}>
        <Typography>{item.name}</Typography>
      </Box>
    );
  };

  const handleSave = async () => {

     // Garantir que todos os campos necessários estejam presentes
  const menuGroupsToSave = menuGroups.map(group => {
    // Se for um módulo direto do tipo Dashboard Power BI, garantir que os campos estejam presentes
    if (group.isDirectModule && group.component === "Dashboard Power BI") {
      return {
        ...group,
        pageId: group.pageId || "",
        reportId: group.reportId || "",
        workspaceId: group.workspaceId || ""
      };
    }
    return group;
  });

    console.log("Dados a serem salvos:", menuGroupsToSave); 
    try {
      await axios.post('http://localhost:5000/menu-groups', { menuGroups: menuGroupsToSave });
      alert('Menu salvo com sucesso!');
    } catch (err) {
      console.error(err);
      alert('Erro ao salvar menu');
    }
  };

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      px: 2,
      ml: "80px",
      // background: "#fff",
      width: "calc(100vw - 110px)",
      height: "calc(100vh - 110px)",
      mt: "60px",
      pt: 3,
      gap: 2
    }}>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        onDragStart={handleDragStart}
      >
    <Box sx={{
      // height: "calc(100vh - 160px)",
      
      
      
    }} >
      <motion.div initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
        <Typography variant="h3" sx={{ 
          fontWeight: "bold", 
          color: "#141414", 
          
          fontSize:{ xs: "1.5rem", sm: "2rem", md: "2.5rem" } 
        }}>Menu</Typography>
        
      </motion.div>
      
        <Box sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'start',
          alignContent:'start',
          width: "100%",
          height: "calc(100vh - 230px)",
          flexWrap: 'wrap',
          overflow: "auto",
          gap: 2
        }}>
           <SortableContext
            items={menuGroups.map(group => group.id)}
            strategy={verticalListSortingStrategy}
          >
          {menuGroups.length > 0 && menuGroups.map((group) => (
            <Card key={group.id} sx={{ 
              width: 300,
              height: 'fit-content',
            }}>
              <CardContent sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 0
              }}>
                <SortableItem id={group.id}>
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    mb:2,
                    cursor: 'grab',
                    '&:active': {
                      cursor: 'grabbing'
                    }
                  }}>
                    <Typography variant="h6">{group.name}</Typography>
                  </Box>
                </SortableItem>

                <Box sx={{ display: 'flex', flexDirection: 'column', mb:2}}>
                <InputLabel>Título</InputLabel>
                <TextField
                    // label="Nome do grupo"
                    size="small"
                    value={group.name}
                    onChange={(e) => handleEditGroup(group.id, "name", e.target.value)}
                    sx={{ mb: 1, background: "#fff" }}
                  />
                  <InputLabel>Caminho</InputLabel>
                  <TextField
                    // label="Caminho do grupo"
                    size="small"
                    value={group.path}
                    onChange={(e) => handleEditGroup(group.id, "path", e.target.value)}
                    sx={{ mb: 1, background: "#fff" }}
                  />

                  <InputLabel>Ícone</InputLabel>
                  <Select
                  // label="Ícone"
                    size="small"
                    value={group.icon || ""}
                    onChange={(e) => handleEditGroup(group.id, "icon", e.target.value)}
                    sx={{ mb: 1, background: "#fff" }}
                  >
                    {iconOptions.map(opt => (
                      <MenuItem key={opt.value} value={opt.value}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          {opt.icon} {opt.label}
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>

                  <InputLabel>Permissão</InputLabel>
                  <Select
                    size="small"
                    multiple
                    sx={{ mb:1, background: "#fff" }}
                    value={group.requiredRole || []}
                    onChange={(e) => handleEditGroup(group.id, "requiredRole", e.target.value as string[])}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', gap: 2 }}>
                        {(selected as string[]).map(value => (
                          <Chip key={value} label={value} size="small" />
                        ))}
                      </Box>
                    )}
                  >
                    {categorias.map(cat => (
                      <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                    ))}
                  </Select>
                </Box>

                {group.subRoutes.length === 0 && (
                  <Button
                    color="error"
                    size="small"
                    onClick={() => handleRemoveGroup(group.id)}
                    sx={{ display: 'flex', justifyContent: 'space-between' }}
                  >
                    Remover Menu <Delete fontSize="small" />
                  </Button>
                )}

                <SortableContext
                  items={group.subRoutes.map((item) => `${group.id}:${item.id}`)}
                  strategy={verticalListSortingStrategy}
                >
                  {group.subRoutes.map((item) => (
                    <Box
                      key={`${group.id}:${item.id}`}
                      sx={{ 
                        display: "flex", 
                        alignItems: "center", 
                        justifyContent: 'space-between',
                        mt: 0,
                        width: '100%'
                      }}
                    >
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        width: '100%',
                        
                        backgroundColor: 'transparent',
                        '&:hover': {
                          backgroundColor: 'rgba(247, 128, 28, 0.05)'
                        }
                      }}>
                        <SortableItem 
                          id={`${group.id}:${item.id}`} 
                          isModule={true}
                        >
                          <Box sx={{ 
                            display: 'flex',
                            alignItems: 'center',
                            width: '100%',
                            padding: '8px',
                            borderRadius: '4px',
                            cursor: 'grab',
                            '&:active': {
                              cursor: 'grabbing'
                            }
                          }}>
                            <Typography sx={{ flex: 1 }}>
                              {item.name}
                            </Typography>
                          </Box>
                        </SortableItem>
                        
                        <Button
                          size="small"
                          color="error"
                          sx={{ 
                            minWidth: 'auto',
                            padding: '4px',
                            '&:hover': {
                              backgroundColor: 'rgba(211, 47, 47, 0.1)'
                            }
                          }}
                          onClick={() => handleRemoveRouteFromGroup(group.id, item.id)}
                          title={`Remover ${item.name} de ${group.name}`}
                        >
                          <Delete fontSize="small" />
                        </Button>
                      </Box>
                    </Box>
                  ))}
                </SortableContext>

                {!group.isDirectModule && (
                  <Button
                    size="small"
                    onClick={() => handleAddRouteToGroup(group.id)}
                    title={`Adicionar módulo a ${group.name}`}
                  >
                    Adicionar Módulo
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
          </SortableContext>
            <Button variant="contained"  sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          width: 300,
          gap:2,
          backgroundColor: '#f7801c',
          '&:hover': {
            backgroundColor: '#f7801c',
            color: '#141414'
          }
          
        }}
      
        title='Adicionar menu'
               onClick={handleAddGroup}
               >
              
        <Add />
      
      
           </Button>
        </Box>
        <MenuTypeDialog
        open={menuTypeDialogOpen}
        onClose={() => setMenuTypeDialogOpen(false)}
        onSelectType={handleMenuTypeSelect}
      />
        <AddModuleDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        availableRoutes={selectedGroupId ? getAvailableRoutes(selectedGroupId) : []}
        onSelect={handleRouteSelect}
      />
      
    
      </Box>
      <Button variant="contained" sx={{ 
                      mt: 2,
                      backgroundColor: '#f7801c',
                      '&:hover': {
                        backgroundColor: '#f7801c',
                        color: '#141414'
                      }
                    }} onClick={handleSave}>
        Salvar
      </Button>
      </DndContext>
      <DragOverlay>
        {renderDragOverlay()}
      </DragOverlay>
    </Box>
  );
};

export default MenuGroupManager;
