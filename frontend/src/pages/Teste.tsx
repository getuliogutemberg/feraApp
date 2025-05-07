import { useState } from "react";
import { 
    Card, 
    Typography, 
    Box, 
    TextField, 
    Select, 
    MenuItem, 
    Table, 
    TableHead, 
    TableBody, 
    TableRow, 
    TableCell,
    Grid,
    Chip,
    Button
} from "@mui/material";
import { motion } from "framer-motion";

// Dados de exemplo para teste
const dadosTeste = [
  { id: 1, nome: "Item 1", categoria: "A", status: "Ativo" },
  { id: 2, nome: "Item 2", categoria: "B", status: "Inativo" },
  { id: 3, nome: "Item 3", categoria: "A", status: "Ativo" },
  { id: 4, nome: "Item 4", categoria: "C", status: "Pendente" },
];

const categorias = ["A", "B", "C"];

export default function Teste() {
    const [categoriaSelecionada, setCategoriaSelecionada] = useState("");
    const [novoItem, setNovoItem] = useState({ nome: "", categoria: "", status: "" });
    const [dados, setDados] = useState(dadosTeste);
  
    // Filtrar itens pela categoria selecionada
    const itensFiltrados = categoriaSelecionada 
      ? dados.filter((item) => item.categoria === categoriaSelecionada)
      : dados;

    // Função para adicionar novo item
    const adicionarItem = () => {
      if (novoItem.nome && novoItem.categoria && novoItem.status) {
        setDados([...dados, { ...novoItem, id: dados.length + 1 }]);
        setNovoItem({ nome: "", categoria: "", status: "" });
      }
    };
  
    return (
        <Box sx={{ 
            display: 'flex',
            flexDirection: 'column',
            px: 2, 
            ml: "80px", 
            background: "rgba(16, 28, 68, 1)", 
            width: "calc(100vw - 110px)", 
            height: "calc(100vh - 70px)", 
            mt: "60px", 
            pt: 3,
            gap: 2
        }}>
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <Typography 
                    variant="h3" 
                    sx={{ 
                        fontWeight: "bold", 
                        color: "white",
                        fontSize: { xs: "1.5rem", sm: "2rem", md: "2.5rem" }
                    }}
                >
                    Página de Teste
                </Typography>
                <Typography 
                    variant="h6" 
                    sx={{ 
                        color: "#fff", 
                        mb: 4,
                        fontSize: { xs: "1rem", sm: "1rem", md: "1rem" },
                        opacity: 0.7
                    }}
                >
                    Exemplo de implementação com dados de teste
                </Typography>
            </motion.div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
            >
                <Card sx={{ 
                    p: 2, 
                    mb: 2, 
                    backgroundColor: 'rgba(31, 42, 76, 0.7)',
                    backdropFilter: 'blur(10px)'
                }}>
                    <Typography variant="h6" sx={{ color: '#fff', mb: 2 }}>
                        Adicionar Novo Item
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={4}>
                            <TextField
                                fullWidth
                                label="Nome"
                                value={novoItem.nome}
                                onChange={(e) => setNovoItem({ ...novoItem, nome: e.target.value })}
                                variant="filled"
                                sx={{ 
                                    background: "#fff",
                                    borderRadius: 1
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <Select
                                fullWidth
                                value={novoItem.categoria}
                                onChange={(e) => setNovoItem({ ...novoItem, categoria: e.target.value })}
                                displayEmpty
                                variant="filled"
                                sx={{ 
                                    background: "#fff",
                                    borderRadius: 1
                                }}
                            >
                                <MenuItem value="">Selecione uma categoria</MenuItem>
                                {categorias.map((cat) => (
                                    <MenuItem key={cat} value={cat}>Categoria {cat}</MenuItem>
                                ))}
                            </Select>
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <Select
                                fullWidth
                                value={novoItem.status}
                                onChange={(e) => setNovoItem({ ...novoItem, status: e.target.value })}
                                displayEmpty
                                variant="filled"
                                sx={{ 
                                    background: "#fff",
                                    borderRadius: 1
                                }}
                            >
                                <MenuItem value="">Selecione um status</MenuItem>
                                <MenuItem value="Ativo">Ativo</MenuItem>
                                <MenuItem value="Inativo">Inativo</MenuItem>
                                <MenuItem value="Pendente">Pendente</MenuItem>
                            </Select>
                        </Grid>
                        <Grid item xs={12} md={2}>
                            <Button 
                                fullWidth 
                                variant="contained" 
                                onClick={adicionarItem}
                                sx={{ 
                                    height: '100%',
                                    backgroundColor: 'rgba(12, 114, 249, 1)',
                                    '&:hover': {
                                        backgroundColor: 'rgba(12, 114, 249, 0.8)'
                                    }
                                }}
                            >
                                Adicionar
                            </Button>
                        </Grid>
                    </Grid>
                </Card>

                <Card sx={{ 
                    p: 2, 
                    mb: 2, 
                    backgroundColor: 'rgba(31, 42, 76, 0.7)',
                    backdropFilter: 'blur(10px)'
                }}>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} md={3}>
                            <Typography variant="subtitle1" sx={{ color: '#fff' }}>
                                Filtrar por Categoria:
                            </Typography>
                        </Grid>
                        <Grid item xs={12} md={9}>
                            <Select
                                fullWidth
                                value={categoriaSelecionada}
                                onChange={(e) => setCategoriaSelecionada(e.target.value)}
                                variant="filled"
                                sx={{ 
                                    background: "#fff",
                                    borderRadius: 1
                                }}
                            >
                                <MenuItem value="">Todas as Categorias</MenuItem>
                                {categorias.map((cat) => (
                                    <MenuItem key={cat} value={cat}>Categoria {cat}</MenuItem>
                                ))}
                            </Select>
                        </Grid>
                    </Grid>
                </Card>

                <Card sx={{ 
                    p: 2, 
                    backgroundColor: 'rgba(31, 42, 76, 0.7)',
                    backdropFilter: 'blur(10px)'
                }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ color: '#fff' }}>ID</TableCell>
                                <TableCell sx={{ color: '#fff' }}>Nome</TableCell>
                                <TableCell sx={{ color: '#fff' }}>Categoria</TableCell>
                                <TableCell sx={{ color: '#fff' }}>Status</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {itensFiltrados.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell sx={{ color: '#fff' }}>{item.id}</TableCell>
                                    <TableCell sx={{ color: '#fff' }}>{item.nome}</TableCell>
                                    <TableCell>
                                        <Chip 
                                            label={`Categoria ${item.categoria}`}
                                            sx={{
                                                backgroundColor: 'rgba(12, 114, 249, 0.2)',
                                                color: '#fff',
                                                borderColor: 'rgba(12, 114, 249, 1)'
                                            }}
                                            variant="outlined"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Chip 
                                            label={item.status}
                                            sx={{
                                                backgroundColor: 
                                                    item.status === "Ativo" ? 'rgba(46, 204, 113, 0.2)' :
                                                    item.status === "Inativo" ? 'rgba(231, 76, 60, 0.2)' :
                                                    'rgba(241, 196, 15, 0.2)',
                                                color: 
                                                    item.status === "Ativo" ? '#2ecc71' :
                                                    item.status === "Inativo" ? '#e74c3c' :
                                                    '#f1c40f',
                                                borderColor: 
                                                    item.status === "Ativo" ? '#2ecc71' :
                                                    item.status === "Inativo" ? '#e74c3c' :
                                                    '#f1c40f'
                                            }}
                                            variant="outlined"
                                        />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Card>
            </motion.div>
        </Box>
    );
}