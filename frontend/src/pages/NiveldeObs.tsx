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
  Pagination
} from "@mui/material";
import { motion } from "framer-motion";

// Interface para o tipo de dado
interface ObsolescenciaItem {
  id: number;
  codigo: string;
  peso: number;
}

// Dados de exemplo para a tabela de Nível de Obsolescencia
// const dadosObs: ObsolescenciaItem[] = [
//   { id: 1, codigo: "102-00002", peso: 73.8 },
//   { id: 2, codigo: "102-00041", peso: 99.1 },
//   { id: 3, codigo: "102-00062", peso: 209 },
//   { id: 4, codigo: "102-00076", peso: 89.8 },
//   { id: 5, codigo: "102-00086", peso: 63.5 },
// ];

export default function NiveldeObs() {
  const [filtros, setFiltros] = useState({ codigo: '', peso: '' });
  const [dadosOriginais, setDadosOriginais] = useState<ObsolescenciaItem[]>([]); // Dados da API (apenas a página atual)
  const [totalItems, setTotalItems] = useState(0); // Total de itens no backend
  const [currentPage, setCurrentPage] = useState(1); // Página atual
  const [itemsPerPage] = useState(10); // Quantidade de itens por página (fixo por enquanto)
  const [dadosFiltrados, setDadosFiltrados] = useState<ObsolescenciaItem[]>([]); // Dados filtrados localmente (da página atual)

  // Função para buscar dados com paginação e filtros (os filtros serão aplicados no backend futuramente)
  const fetchData = async (page: number, limit: number, currentFilters: { codigo: string, peso: string }) => {
    const offset = (page - 1) * limit;
    // Note: Atualmente os filtros não são enviados para o backend. A filtragem ocorre no frontend sobre a página atual.
    // Para otimizar, os filtros deveriam ser enviados na URL do fetch.
    const url = `http://localhost:5000/equipamentos-manut/obsolescencia?limit=${limit}&offset=${offset}`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();

      // Adicionar IDs aos dados se necessário (a API atual não retorna ID)
      const dataWithIds = result.items.map((item: ObsolescenciaItem, index: number) => ({ ...item, id: item.id || offset + index + 1 }));

      setDadosOriginais(dataWithIds);
      setTotalItems(result.totalItems);
      // Aplicar filtro local inicialmente
      applyLocalFilter(dataWithIds, currentFilters);

    } catch (error) {
      console.error("Erro ao buscar dados de Nível de Obsolescencia:", error);
      // Em caso de erro, limpar dados ou exibir mensagem apropriada
      setDadosOriginais([]);
      setDadosFiltrados([]);
      setTotalItems(0);
    }
  };

  // Função para aplicar filtro localmente na página atual
  const applyLocalFilter = (dataToFilter: ObsolescenciaItem[], currentFilters: { codigo: string, peso: string }) => {
    const filtered = dataToFilter.filter(item =>
      (currentFilters.codigo === '' || item.codigo.includes(currentFilters.codigo)) &&
      (currentFilters.peso === '' || String(item.peso).includes(currentFilters.peso))
    );
    setDadosFiltrados(filtered);
  };

  // useEffect para buscar dados ao montar o componente ou mudar a página/limite
  useEffect(() => {
    fetchData(currentPage, itemsPerPage, filtros);
  }, [currentPage, itemsPerPage]); // Dependências: busca novamente ao mudar a página ou limite

  // useEffect para aplicar filtro localmente quando os filtros mudam ou os dados da página chegam
  useEffect(() => {
    applyLocalFilter(dadosOriginais, filtros);
  }, [filtros, dadosOriginais]); // Dependências: aplica filtro ao mudar filtros ou dados da página

  // Função para lidar com a mudança de página
  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
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
      {/* <Box sx={{ mb: 1 }}>
        <Typography variant="h5" sx={{ fontWeight: "bold", color: "#222" }}>
          Administração <span style={{ color: "#888", fontWeight: 400 }}>/ Nível de Obsolescencia</span>
        </Typography>
      </Box> */}

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
        <Card sx={{ p: 2, mb: 2, backgroundColor: "#fff" }}>
          <Typography variant="subtitle1" sx={{ color: "#222", mb: 2, fontWeight: 600 }}>
            <span role="img" aria-label="lamp"></span> Listagem de Nível de Obsolescencia
          </Typography>
          <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Cód. Equipamento"
                value={filtros.codigo}
                onChange={(e) => setFiltros({ ...filtros, codigo: e.target.value })}
                variant="outlined"
                size="small"
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Peso"
                value={filtros.peso}
                onChange={(e) => setFiltros({ ...filtros, peso: e.target.value })}
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
                <TableCell sx={{ fontWeight: 700 }}>Codigo do Equipamento</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Peso</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {dadosFiltrados.map((item: ObsolescenciaItem) => (
                <TableRow key={item.id}>
                  <TableCell>{item.codigo}</TableCell>
                  <TableCell>{item.peso}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      size="small"
                      sx={{ background: "#888", color: "#fff", fontWeight: 600 }}
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
    </Box>
  );
} 