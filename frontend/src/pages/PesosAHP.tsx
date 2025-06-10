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
  Pagination,

  Backdrop,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from "@mui/material";
import { motion } from "framer-motion";

// Interface para o tipo de dado
interface PesoAHPItem {
  id: number;
  parametro1: string;
  parametro2: string;
  nivel: string;
  pesoDefault: number;
  pesoUsuario: number;
}

// Dados de exemplo para a tabela de Pesos AHP
// const dadosAHP = [
//   {
//     id: 1,
//     parametro1: "Benefício Econômico",
//     parametro2: "Custo de Troca",
//     nivel: "Critérios",
//     pesoDefault: 1.5,
//     pesoUsuario: 1.5,
//   },
//   {
//     id: 2,
//     parametro1: "DEC/FEC",
//     parametro2: "Obsolescência",
//     nivel: "Critérios",
//     pesoDefault: 2.95,
//     pesoUsuario: 2.95,
//   },
//   {
//     id: 3,
//     parametro1: "Depreciação",
//     parametro2: "Benefício Econômico",
//     nivel: "Critérios",
//     pesoDefault: 3.43,
//     pesoUsuario: 3.43,
//   },
//   {
//     id: 4,
//     parametro1: "Depreciação",
//     parametro2: "Custo de Troca",
//     nivel: "Critérios",
//     pesoDefault: 1.92,
//     pesoUsuario: 1.92,
//   },
//   {
//     id: 5,
//     parametro1: "Impacto do Desligamento",
//     parametro2: "DEC/FEC",
//     nivel: "Critérios",
//     pesoDefault: 3.12,
//     pesoUsuario: 3.12,
//   },
// ];

export default function PesosAHP() {
  const [filtros, setFiltros] = useState({ parametro1: "", parametro2: "", nivel: "" });
  const [dadosOriginais, setDadosOriginais] = useState<PesoAHPItem[]>([]); // Dados da API (apenas a página atual)
  const [totalItems, setTotalItems] = useState(0); // Total de itens no backend
  const [currentPage, setCurrentPage] = useState(1); // Página atual
  const [itemsPerPage] = useState(10); // Quantidade de itens por página (fixo por enquanto)
  const [dadosFiltrados, setDadosFiltrados] = useState<PesoAHPItem[]>([]); // Dados filtrados localmente (da página atual)
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado para controlar a abertura/fechamento do modal
  const [currentAHPItem, setCurrentAHPItem] = useState<PesoAHPItem | null>(null); // Armazena o item sendo editado

  // Função para buscar dados com paginação e filtros (os filtros serão aplicados no backend futuramente)
  

  // Função para aplicar filtro localmente na página atual
  const applyLocalFilter = (dataToFilter: PesoAHPItem[], currentFilters: { parametro1: string, parametro2: string, nivel: string }) => {
    const filtered = dataToFilter.filter(item =>
      (currentFilters.parametro1 === "" || item.parametro1.toLowerCase().includes(currentFilters.parametro1.toLowerCase())) &&
      (currentFilters.parametro2 === "" || item.parametro2.toLowerCase().includes(currentFilters.parametro2.toLowerCase())) &&
      (currentFilters.nivel === "" || item.nivel.toLowerCase().includes(currentFilters.nivel.toLowerCase()))
    );
    setDadosFiltrados(filtered);
  };

  // useEffect para buscar dados ao montar o componente ou mudar a página/limite
  useEffect(() => {
    const fetchData = async (page: number, limit: number, currentFilters: { parametro1: string, parametro2: string, nivel: string }) => {
      const offset = (page - 1) * limit;
      // Note: Atualmente os filtros não são enviados para o backend. A filtragem ocorre no frontend sobre a página atual.
      // Para otimizar, os filtros deveriam ser enviados na URL do fetch.
      const url = `http://localhost:5000/equipamentos-manut/pesosahp?limit=${limit}&offset=${offset}`;
      
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        
        // Adicionar IDs aos dados se necessário (a API atual não retorna ID)
        const dataWithIds = result.items.map((item: PesoAHPItem, index: number) => ({ ...item, id: item.id || offset + index + 1 }));
        
        setDadosOriginais(dataWithIds);
        setTotalItems(result.totalItems);
        // Aplicar filtro local inicialmente
        applyLocalFilter(dataWithIds, currentFilters);
  
      } catch (error) {
        console.error("Erro ao buscar dados de Pesos AHP:", error);
        // Em caso de erro, limpar dados ou exibir mensagem apropriada
        setDadosOriginais([]);
        setDadosFiltrados([]);
        setTotalItems(0);
      }
    };
    fetchData(currentPage, itemsPerPage, filtros);
  }, [currentPage, filtros, itemsPerPage]); // Dependências: busca novamente ao mudar a página ou limite

  // useEffect para aplicar filtro localmente quando os filtros mudam ou os dados da página chegam
  useEffect(() => {
    applyLocalFilter(dadosOriginais, filtros);
  }, [filtros, dadosOriginais]); // Dependências: aplica filtro ao mudar filtros ou dados da página

  // Função para lidar com a mudança de página
  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
  };

  // Função para abrir o modal
  const handleOpenModal = (item: PesoAHPItem | null = null) => {
    setCurrentAHPItem(item);
    setIsModalOpen(true);
  };

  // Função para fechar o modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentAHPItem(null);
  };

  // Função para atualizar o peso
  const handleUpdatePeso = async () => {
    if (!currentAHPItem) return;

    const dataToSend = {
      parametro1: currentAHPItem.parametro1,
      parametro2: currentAHPItem.parametro2,
      nivel: currentAHPItem.nivel,
      pesoDefault: currentAHPItem.pesoDefault ?? 0,
      pesoUsuario: currentAHPItem.pesoUsuario ?? 0,
    };

    try {
      const response = await fetch(`http://localhost:5000/equipamentos-manut/pesosahp`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      handleCloseModal();
      const fetchData = async (page: number, limit: number, currentFilters: { parametro1: string, parametro2: string, nivel: string }) => {
        const offset = (page - 1) * limit;
        // Note: Atualmente os filtros não são enviados para o backend. A filtragem ocorre no frontend sobre a página atual.
        // Para otimizar, os filtros deveriam ser enviados na URL do fetch.
        const url = `http://localhost:5000/equipamentos-manut/pesosahp?limit=${limit}&offset=${offset}`;
        
        try {
          const response = await fetch(url);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const result = await response.json();
          
          // Adicionar IDs aos dados se necessário (a API atual não retorna ID)
          const dataWithIds = result.items.map((item: PesoAHPItem, index: number) => ({ ...item, id: item.id || offset + index + 1 }));
          
          setDadosOriginais(dataWithIds);
          setTotalItems(result.totalItems);
          // Aplicar filtro local inicialmente
          applyLocalFilter(dataWithIds, currentFilters);
    
        } catch (error) {
          console.error("Erro ao buscar dados de Pesos AHP:", error);
          // Em caso de erro, limpar dados ou exibir mensagem apropriada
          setDadosOriginais([]);
          setDadosFiltrados([]);
          setTotalItems(0);
        }
      };
      fetchData(currentPage, itemsPerPage, filtros); // Re-fetch data to update table
    } catch (error) {
      console.error("Erro ao atualizar Peso AHP:", error);
      // Optionally, display an error message to the user
    }
  };

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
      {/* <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography
          variant="h5"
          sx={{ fontWeight: "bold", color: "#222" }}
        >
          Administração <span style={{ color: "#888", fontWeight: 400 }}>/ Pesos AHP</span>
        </Typography>
        <Typography
          variant="h6"
          sx={{ color: "#222", mb: 2, fontSize: "1.1rem", opacity: 0.7 }}
        >
          Listagem de Pesos AHP
        </Typography>
      </motion.div> */}
{/* <Box sx={{ mb: 1 }}>
        <Typography variant="h5" sx={{ fontWeight: "bold", color: "#222" }}>
          Administração <span style={{ color: "#888", fontWeight: 400 }}>/ Pesos AHP</span>
        </Typography>
      </Box> */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
        <Card sx={{ p: 2, mb: 2, backgroundColor: "#fff" }}>
          <Typography variant="subtitle1" sx={{ color: "#222", mb: 2, fontWeight: 600 }}>
            <span role="img" aria-label="lamp"></span> Listagem de Pesos AHP
          </Typography>
          <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Parâmetro 1"
                value={filtros.parametro1}
                onChange={(e) => setFiltros({ ...filtros, parametro1: e.target.value })}
                variant="outlined"
                size="small"
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Parâmetro 2"
                value={filtros.parametro2}
                onChange={(e) => setFiltros({ ...filtros, parametro2: e.target.value })}
                variant="outlined"
                size="small"
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Nível"
                value={filtros.nivel}
                onChange={(e) => setFiltros({ ...filtros, nivel: e.target.value })}
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
                <TableCell sx={{ fontWeight: 700 }}>Parâmetro 1</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Parâmetro 2</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Nível</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Peso Default</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Peso Usuário</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {dadosFiltrados.map((item: PesoAHPItem) => (
                <TableRow key={item.id}>
                  <TableCell>{item.parametro1}</TableCell>
                  <TableCell>{item.parametro2}</TableCell>
                  <TableCell>{item.nivel}</TableCell>
                  <TableCell>{item.pesoDefault}</TableCell>
                  <TableCell>{item.pesoUsuario}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      size="small"
                      sx={{ background: "#888", color: "#fff", fontWeight: 600 }}
                      onClick={() => handleOpenModal(item)} // Abre o modal para editar
                    >
                      Editar
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

      {/* Modal para Edição de Pesos AHP */}
      <Dialog
        open={isModalOpen}
        onClose={handleCloseModal}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        
          <DialogTitle variant="h6" component="h2" mb={2}>
            Editar Peso AHP
          </DialogTitle>
          <DialogContent>
          <TextField
            fullWidth
            label="Parâmetro 1 (Não Editável)"
            
            value={currentAHPItem?.parametro1 || ''}
            InputProps={{ readOnly: true }}
            sx={{ mb: 2 ,mt:2,background:"#fff"}}
          />
          <TextField
            fullWidth
            label="Parâmetro 2 (Não Editável)"
            
            value={currentAHPItem?.parametro2 || ''}
            InputProps={{ readOnly: true }}
            sx={{ mb: 2 ,mt:2,background:"#fff"}}
          />
          <TextField
            fullWidth
            label="Nível (Não Editável)"
            
            value={currentAHPItem?.nivel || ''}
            InputProps={{ readOnly: true }}
            sx={{ mb: 2 ,mt:2,background:"#fff"}}
          />
          <TextField
            fullWidth
            label="Peso Default"
            type="number"
            
            value={currentAHPItem?.pesoDefault ?? ''}
            onChange={e => setCurrentAHPItem({ ...currentAHPItem!, pesoDefault: parseFloat(e.target.value) || 0 })}
            sx={{ mb: 2 ,mt:2,background:"#fff"}}
          />
          <TextField
            fullWidth
            label="Peso Usuário"
            type="number"
            
            value={currentAHPItem?.pesoUsuario ?? ''}
            onChange={e => setCurrentAHPItem({ ...currentAHPItem!, pesoUsuario: parseFloat(e.target.value) || 0 })}
            sx={{ mb: 2 ,mt:2,background:"#fff"}}
          />
          <DialogActions>
            <Button onClick={handleCloseModal} >Cancelar</Button>
            <Button variant="contained" onClick={handleUpdatePeso} sx={{
           backgroundColor: '#f7801c',
           '&:hover': {
             backgroundColor: '#f7801c',
             color: '#141414'
           }
        }}>Salvar</Button>
          </DialogActions>
          </DialogContent>
        
      </Dialog>
    </Box>
  );
}