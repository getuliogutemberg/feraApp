import { useEffect, useState } from "react";
import {
   Button, Box, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, Dialog,
  DialogActions, DialogContent, DialogTitle, TextField,
  IconButton, Alert, InputAdornment, MenuItem, Select,
  Chip, InputLabel, CircularProgress,
  Typography
} from "@mui/material";
import { Add, Delete, Edit, Search } from "@mui/icons-material";
import { ChartLine, ChartColumn, ListFilter } from "lucide-react";
// import { motion } from "framer-motion";
import axios from "axios";
import {
  FaTachometerAlt, FaBars, FaFileAlt, FaCog,
  FaUsers, FaUserTie, FaDollarSign, FaCar
} from "react-icons/fa";
import { motion } from "framer-motion";

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

const componentes = ["Dashboard Power BI", "Pesos AHP", "Nivel de Obsolecencia", "Custo HxH"];
const categorias = ["OWNER", "ADMIN", "CLIENT"];


type Route = {
  id: string;
  path: string;
  component: string;
  name: string;
  requiredRole?: string[];
  pageId: string;
  reportId: string;
  workspaceId: string;
  icon: string;
};

const RoutesEdit = () => {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState<Partial<Route>>({
    path: "",
    component: "",
    name: "",
    requiredRole: [],
    pageId: "",
    workspaceId: "",
    reportId: "",
    icon: ""
  });

  const [selected, setSelected] = useState<Route | null>(null);
  const [openForm, setOpenForm] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    loadRoutes();
  }, []);

  const loadRoutes = async () => {
    try {
      const res = await axios.get("http://localhost:5000/routes");
      setRoutes(res.data);
    } catch {
      setError("Erro ao carregar rotas");
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      if (selected) {
        const res = await axios.put(`http://localhost:5000/routes/${selected.id}`, form);
        setRoutes(prev => prev.map(r => r.id === selected.id ? res.data : r));
      } else {
        const res = await axios.post(`http://localhost:5000/routes`, form);
        setRoutes(prev => [...prev, res.data]);
      }
      handleCloseForm();
    } catch (err) {
      setError("Erro ao salvar" + err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setLoading(true);
    try {
      await axios.delete(`http://localhost:5000/routes/${deleteId}`);
      setRoutes(prev => prev.filter(r => r.id !== deleteId));
      setDeleteId(null);
    } catch {
      setError("Erro ao deletar");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenForm = (route?: Route) => {
    if (route) {
      setSelected(route);
      setForm(route);
    } else {
      setSelected(null);
      setForm({
        path: "",
        component: "",
        name: "",
        requiredRole: [],
        pageId: "",
        workspaceId: "",
        reportId: "",
        icon: ""
      });
    }
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
    setSelected(null);
    setError(null);
  };

  const filtered = routes.filter(r =>
    r.path.toLowerCase().includes(search.toLowerCase()) ||
    r.component.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'start',
      px: 2,
      ml: "80px",
      // background: "#fff",
      width: "calc(100vw - 110px)",
      height: "calc(100vh - 110px)",
      mt: "60px",
      pt: 3,
      gap: 2
    }}>
      <motion.div initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
        <Typography variant="h3" sx={{ 
          fontWeight: "bold", 
          color: "#141414", 
          
          fontSize:{ xs: "1.5rem", sm: "2rem", md: "2.5rem" } 
        }}>Lista de Módulos</Typography>
        <Typography variant="h6" sx={{ 
          color: "#141414", 
          fontSize: { xs: "1rem", sm: "1rem", md: "1rem" },
          opacity: 0.7
        }}>Você possui {routes.length} módulo(s) cadastrados.</Typography>
      </motion.div>

      {error && <Alert severity="error">{error}</Alert>}

      <Box component={Paper} sx={{ p: 1, display: 'flex', gap: 1 }}>
        <TextField
          fullWidth
          placeholder="Buscar módulo"
          value={search}
          onChange={e => setSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
        />
        <Button variant="contained" sx={{
           backgroundColor: '#f7801c',
           '&:hover': {
             backgroundColor: '#f7801c',
             color: '#141414'
           }
        }} onClick={() => handleOpenForm()}><Add /></Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell></TableCell>
              <TableCell>Nome</TableCell>
              <TableCell>Módulo</TableCell>
              <TableCell>Classes</TableCell>
              <TableCell align="right">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.map(route => (
              <TableRow key={route.id}>
                <TableCell>{getIcon(route.icon)}</TableCell>

                <TableCell>{route.name}</TableCell>
                <TableCell>{route.component}</TableCell>
                <TableCell>{route.requiredRole?.join(", ") || "-"}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => handleOpenForm(route)}><Edit /></IconButton>
                  <IconButton color="error" onClick={() => setDeleteId(route.id)}><Delete /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Formulário */}
      <Dialog open={openForm} onClose={handleCloseForm}>
        <DialogTitle>{selected ? "Editar Módulo" : "Criar Módulo"}</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: '400px' }}>
          <InputLabel>Ícone</InputLabel>
          <Select
            value={form.icon}
            onChange={(e) => setForm({ ...form, icon: e.target.value })}
          >
            {iconOptions.map(opt => (
              <MenuItem key={opt.value} value={opt.value}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {opt.icon} {opt.label}
                </Box>
              </MenuItem>
            ))}
          </Select>

          <TextField label="Caminho" value={form.path} onChange={e => setForm({ ...form, path: e.target.value })} />
          <TextField label="Nome" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          <Select
            value={form.component}
            onChange={e => setForm({ ...form, component: e.target.value })}
          >
            {componentes.map(opt => (
              <MenuItem key={opt} value={opt}>{opt}</MenuItem>
            ))}
          </Select>
          {form.component === "Dashboard Power BI" &&  <>
          <TextField label="Workspace ID" value={form.workspaceId} onChange={e => setForm({ ...form, workspaceId: e.target.value })} />
          <TextField label="Page ID" value={form.pageId} onChange={e => setForm({ ...form, pageId: e.target.value })} />
          <TextField label="Report ID" value={form.reportId} onChange={e => setForm({ ...form, reportId: e.target.value })} />
        </>}
       
           
              <Select
            multiple
            value={form.requiredRole || []}
            onChange={(e) => setForm({ ...form, requiredRole: e.target.value as string[] })}
            renderValue={(selected) => (
              <Box sx={{ display: 'flex', gap: 0.5 }}>
                {(selected as string[]).map(value => (
                  <Chip key={value} label={value} />
                ))}
              </Box>
            )}
          >
            {categorias.map(cat => (
              <MenuItem key={cat} value={cat}>{cat}</MenuItem>
            ))}
          </Select> 
        
          </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseForm}>Cancelar</Button>
          <Button variant="contained" onClick={handleSave} sx={{
           backgroundColor: '#f7801c',
           '&:hover': {
             backgroundColor: '#f7801c',
             color: '#141414'
           }
        }} disabled={loading}>
            {loading ? <CircularProgress size={20} /> : "Salvar"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirmar Exclusão */}
      <Dialog open={!!deleteId} onClose={() => setDeleteId(null)}>
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogActions>
          <Button onClick={() => setDeleteId(null)}>Cancelar</Button>
          <Button color="error" onClick={handleDelete} disabled={loading}>
            {loading ? <CircularProgress size={20} /> : "Excluir"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RoutesEdit;