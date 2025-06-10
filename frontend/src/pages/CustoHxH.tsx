import { useState, useEffect } from "react";
import {
  Card,
  Typography,
  Box,
  TextField,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Grid,
  Button,
  MenuItem,
  Select,
  Pagination,
  DialogTitle,
  Dialog,
  DialogActions,
  DialogContent
} from "@mui/material";
import { motion } from "framer-motion";


// Interface para o tipo de dado
interface CustoHxHItem {
  ano: number | null;
  tuc: number | null;
  custo: number | null;
  id?: string; // Add optional id for frontend usage (composite key string)
}

// Dados de exemplo para a tabela de Custo HxH (mantido para fallback em caso de erro, mas comentado)
// const dadosCusto: CustoHxHItem[] = [
//   { id: 1, ano: 2016, tuc: 220, custo: 100 },
//   { id: 2, ano: 2016, tuc: 205, custo: 100 },
//   { id: 3, ano: 2016, tuc: 270, custo: 100 },
//   { id: 4, ano: 2016, tuc: 445, custo: 100 },
//   { id: 5, ano: 2016, tuc: 405, custo: 100 },
// ];

const anos = [2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025]; // Manter anos para o Select de filtro

export default function CustoHxH() {
  // State variables
  const [filtros, setFiltros] = useState({ ano: '', tuc: '' });
  const [dadosOriginais, setDadosOriginais] = useState<CustoHxHItem[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [dadosFiltrados, setDadosFiltrados] = useState<CustoHxHItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCustoItem, setCurrentCustoItem] = useState<CustoHxHItem | null>(null);

  // Helper functions
  const applyLocalFilter = (dataToFilter: CustoHxHItem[], currentFilters: { ano: string, tuc: string }) => {
    const filtered = dataToFilter.filter(item =>
        (currentFilters.ano === '' || String(item.ano) === String(currentFilters.ano)) &&
        (currentFilters.tuc === '' || String(item.tuc).includes(currentFilters.tuc))
    );
    setDadosFiltrados(filtered);
  };

  const fetchData = async (page: number, limit: number, currentFilters: { ano: string, tuc: string }) => {
    const offset = (page - 1) * limit;
    const url = `http://localhost:5000/equipamentos-manut/custohxh?limit=${limit}&offset=${offset}`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();

      const dataWithIds = result.items.map((item: CustoHxHItem) => ({
        ...item,
        id: `${item.tuc ?? 0}-${item.ano ?? 0}` // Generate a unique ID for frontend display, ensuring numbers
      }));

      setDadosOriginais(dataWithIds);
      setTotalItems(result.totalItems);
      applyLocalFilter(dataWithIds, currentFilters);

    } catch (error) {
      console.error("Erro ao buscar dados de Custo HxH:", error);
      setDadosOriginais([]);
      setDadosFiltrados([]);
      setTotalItems(0);
    }
  };

  const handleOpenModal = (item: CustoHxHItem | null = null) => {
    setCurrentCustoItem(item || { ano: null, tuc: null, custo: null }); // Initialize with null for number fields to allow empty input
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentCustoItem(null); // Clear the current item when closing the modal
  };

  const handleCreateUpdateCusto = async () => {
    if (!currentCustoItem) return;

    // Ensure ano, tuc, and custo are numbers, default to 0 if null
    const dataToSend = {
      ano: currentCustoItem.ano ?? 0,
      tuc: currentCustoItem.tuc ?? 0,
      custo: currentCustoItem.custo ?? 0,
    };

    const method = (currentCustoItem.id) ? 'PUT' : 'POST'; // Check for frontend-generated ID for update
    const url = `http://localhost:5000/equipamentos-manut/custohxh`; // Base URL for both POST and PUT

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      handleCloseModal();
      fetchData(currentPage, itemsPerPage, filtros); 
    } catch (error) {
      console.error(`Erro ao ${method === 'POST' ? 'criar' : 'atualizar'} Custo HxH:`, error);
    }
  };

  const handleDeleteCusto = async (tuc: number, ano: number) => {
    try {
      const response = await fetch(`http://localhost:5000/equipamentos-manut/custohxh`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tuc, ano }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      fetchData(currentPage, itemsPerPage, filtros);
    } catch (error) {
      console.error("Erro ao deletar Custo HxH:", error);
    }
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
  };

  // useEffect hooks
  useEffect(() => {
    fetchData(currentPage, itemsPerPage, filtros);
  }, [currentPage, itemsPerPage, filtros]);

  useEffect(() => {
    applyLocalFilter(dadosOriginais, filtros);
  }, [filtros, dadosOriginais]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        px: 2,
        ml: "80px",
        // background: "rgba(16, 28, 68, 1)",
        width: "calc(100vw - 110px)",
        height: "calc(100vh - 70px)",
        mt: "60px",
        pt: 3,
        gap: 2,
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'end', alignItems: 'center', mb: 1,position: 'absolute',right: '40px', top: '100px' }}>
        {/* <Box>
          <Typography variant="h5" sx={{ fontWeight: "bold", color: "#222" }}>
            Administração <span style={{ color: "#888", fontWeight: 400 }}>/ Custo HxH</span>
          </Typography>
        </Box> */}
        <Button
          variant="contained"
          sx={{ background: "#FF8C2A", color: "#fff", fontWeight: 600, borderRadius: 2, px: 3 }}
          onClick={() => handleOpenModal()} // Abre o modal para adicionar novo item
        >
          ● Adicionar Custo HxH
        </Button>
      </Box>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
        <Card sx={{ p: 2, mb: 2, backgroundColor: "#fff" }}>
          <Typography variant="subtitle1" sx={{ color: "#222", mb: 2, fontWeight: 600 }}>
            <span role="img" aria-label="lamp"></span> Listagem de Custo HxH
          </Typography>
          <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
            <Grid item xs={12} md={3}>
              <Select
                fullWidth
                value={filtros.ano}
                onChange={(e) => setFiltros({ ...filtros, ano: e.target.value })}
                displayEmpty
                variant="outlined"
                size="small"
              >
                <MenuItem value="">Ano</MenuItem>
                {anos.map((ano) => (
                  <MenuItem key={ano} value={ano}>{ano}</MenuItem>
                ))}
              </Select>
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="TUC"
                value={filtros.tuc}
                onChange={(e) => setFiltros({ ...filtros, tuc: e.target.value })}
                variant="outlined"
                size="small"
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <Button
                variant="contained"
                sx={{ background: "#FF8C2A", color: "#fff", height: "40px" }}
                // Ao clicar em procurar, re-busca os dados da primeira página com os filtros atuais
                onClick={() => setCurrentPage(1)} 
              >
                Procurar
              </Button>
            </Grid>
          </Grid>

          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>Ano</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>TUC</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Custo</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {dadosFiltrados.map((item: CustoHxHItem) => (
                <TableRow key={item.id}>
                  <TableCell>{item.ano ?? ''}</TableCell>
                  <TableCell>{item.tuc ?? ''}</TableCell>
                  <TableCell>{item.custo ?? ''}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      size="small"
                      sx={{ background: "#888", color: "#fff", fontWeight: 600, mr: 1 }}
                      onClick={() => handleOpenModal(item)} // Abre o modal para editar
                    >
                      Editar
                    </Button>
                    <Button
                      variant="contained"
                      size="small"
                      sx={{ background: "#FF8C2A", color: "#fff", fontWeight: 600 }}
                      onClick={() => handleDeleteCusto(item.tuc ?? 0, item.ano ?? 0)} // Chama a função para excluir com tuc e ano
                    >
                      Excluir
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Componente de Paginação */}
          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
             <Pagination
                count={Math.ceil(totalItems / itemsPerPage)} // Total de páginas
                page={currentPage}
                onChange={handlePageChange}
                color="primary" // Altere a cor conforme necessário
                 sx={{ '.MuiPaginationItem-root': { color: '#fff', bgcolor: '#444' }, '.MuiPaginationItem-root.Mui-selected': { backgroundColor: '#FF8C2A', color: '#fff' } }} // Estilo básico
             />
          </Box>
        </Card>
      </motion.div>

      {/* Modal para Adicionar/Editar Custo HxH */}
      <Dialog
        open={isModalOpen}
        onClose={handleCloseModal}
        
      >
      
      <DialogTitle>
            {currentCustoItem && currentCustoItem.id ? 'Editar Custo HxH' : 'Adicionar Novo Custo HxH'}
            </DialogTitle>
            <DialogContent>

            
          
          <TextField 
           fullWidth
           label={currentCustoItem && currentCustoItem.id ? "Ano (Não Editável)" : "Ano"}
            type="number"
            margin="normal"
            InputProps={{ readOnly:  currentCustoItem && currentCustoItem.id ? true : false }}
            name="ano"
            value={currentCustoItem?.ano ?? ''}
            onChange={e => setCurrentCustoItem({ ...currentCustoItem!, ano: parseInt(e.target.value) || null })}
            sx={{ mb: 2, background: "#fff" }}
          />

 
          <TextField 
            fullWidth
            label={currentCustoItem && currentCustoItem.id ? "TUC (Não Editável)" : "TUC"}
            type="number"
            margin="normal"
            name="tuc"
            InputProps={{ readOnly:  currentCustoItem && currentCustoItem.id ? true : false }}
            value={currentCustoItem?.tuc ?? ''}
            onChange={e => setCurrentCustoItem({ ...currentCustoItem!, tuc: parseInt(e.target.value) || null })}
            sx={{ mb: 2, background: "#fff" }}
          />
          

          <TextField
            fullWidth
            label="Custo"
            type="number"
            margin="normal"
            name="custo"
            value={currentCustoItem?.custo ?? ''}
            onChange={e => setCurrentCustoItem({ ...currentCustoItem!, custo: parseInt(e.target.value) || null })}
            sx={{ mb: 2, background: "#fff" }}
          />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseModal} sx={{ mr: 2 }}>Cancelar</Button>
            <Button variant="contained" onClick={handleCreateUpdateCusto} sx={{
           backgroundColor: '#f7801c',
           '&:hover': {
             backgroundColor: '#f7801c',
             color: '#141414'
           }
        }}>Salvar</Button>
            </DialogActions>
        
      </Dialog>
    </Box>
  );
} 