import { useState } from "react";
import {
    Card, CardContent, Typography, Button, Box, Chip, Fade, Select, MenuItem, FormControl, InputLabel, Dialog, DialogTitle, DialogContent, TextField, DialogActions
} from "@mui/material";
import { green, orange, red } from "@mui/material/colors";
import { motion } from "framer-motion";


const generateTickets = () => [
  { id: 1, title: "Falha no motor da linha de produção", date: "10/02/2025", status: "Em andamento", color: red[500] },
  { id: 2, title: "Manutenção preventiva do gerador", date: "12/02/2025", status: "Pendente", color: orange[500] },
  { id: 3, title: "Troca de peças no sistema hidráulico", date: "15/02/2025", status: "Concluído", color: green[500] },
  { id: 4, title: "Ajuste no sistema de controle de temperatura", date: "17/02/2025", status: "Em andamento", color: red[500] },
  { id: 5, title: "Substituição de válvulas de segurança", date: "18/02/2025", status: "Pendente", color: orange[500] },
  { id: 6, title: "Reparo no transportador de correia", date: "20/02/2025", status: "Concluído", color: green[500] },
  { id: 7, title: "Calibração de sensores de pressão", date: "22/02/2025", status: "Em andamento", color: red[500] },
  { id: 8, title: "Substituição de filtro de ar comprimido", date: "24/02/2025", status: "Pendente", color: orange[500] },
  { id: 9, title: "Troca de correia do motor principal", date: "25/02/2025", status: "Concluído", color: green[500] },
  { id: 10, title: "Verificação de vazamento de óleo na linha de produção", date: "26/02/2025", status: "Em andamento", color: red[500] },
];


export default function HelpDesk() {
  const [tickets, setTickets] = useState(generateTickets());
  const [filter, setFilter] = useState("Todos");
  const [open, setOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");

  // 🔹 Filtra os chamados com base na categoria selecionada
  const filteredTickets = filter === "Todos" ? tickets : tickets.filter(ticket => ticket.status === filter);

  // 🔹 Função para adicionar um novo chamado
  const handleAddTicket = () => {
    if (newTitle.trim() === "") return;
    const newTicket = {
      id: tickets.length + 1,
      title: newTitle,
      date: new Date().toLocaleDateString(),
      status: "Aberto",
      color: red[500]
    };
    setTickets([newTicket, ...tickets]);
    setNewTitle("");
    setOpen(false);
  };

  return (
    <Box sx={{ background:"rgba(16, 28, 68, 1)",width:'calc(100vw - 120px)',height:"calc(100vh - 40px)",pl:"100px",pt:"130px",pr:"20px",display:"flex",flexDirection:"column",justifyContent:"start",alignItems:"center"}}>
     
      <motion.div initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
      <Typography variant="h3" sx={{ fontWeight: "bold", color: "white", mb: 2, fontSize: { xs: "1.5rem", sm: "2rem", md: "2.5rem" } }}>
      Central de Chamados
        </Typography>
        <Typography variant="h6" sx={{ color: "#666", mb: 4, fontSize: { xs: "1rem", sm: "1rem", md: "1rem" } }}>
          Aqui você pode acompanhar e gerenciar os chamados de suporte ao cliente
        </Typography>
        </motion.div>
      {/* 🔎 Filtros e botão para novo chamado */}
      <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mb: 4 }}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Filtrar por Status</InputLabel>
          <Select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <MenuItem value="Todos">Todos</MenuItem>
            <MenuItem value="Aberto">Aberto</MenuItem>
            <MenuItem value="Em andamento">Em andamento</MenuItem>
            <MenuItem value="Resolvido">Resolvido</MenuItem>
          </Select>
        </FormControl>

        <Button variant="contained" color="primary" onClick={() => setOpen(true)}>
          Novo Chamado +
        </Button>
      </Box>

      <Box sx={{
        display: "flex",
        justifyContent: "start",
        flexWrap: "wrap",
        overflow: "auto",
        height: "calc(100vh - 235px)",
        gap: 2
      }}>
        {filteredTickets.map((ticket) => (
          <Fade in key={ticket.id} timeout={500}>
            <Box sx={{
               width: 400,
               minWidth: 300,
               height: "fit-content",
               // flexGrow: 1,
               boxShadow: 1,
               transition: "transform 0.3s, box-shadow 0.3s",
               "&:hover": {
                 transform: "scale(1.02)",
                 boxShadow: 6,
               }
            }} >
              <Card
                sx={{
                  minHeight: 180,
                  boxShadow: 3,
                  transition: "transform 0.3s, box-shadow 0.3s",
                  "&:hover": {
                    transform: "scale(1.05)",
                    boxShadow: 6,
                  }
                }}
              >
                <CardContent>
                  {/* Informações do Chamado */}
                  <Typography variant="h6" fontWeight="bold">{ticket.title}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    📅 {ticket.date}
                  </Typography>

                  {/* Status do Chamado */}
                  <Chip
                    label={ticket.status}
                    sx={{
                      mt: 2,
                      bgcolor: ticket.color,
                      color: "white",
                      fontWeight: "bold",
                    }}
                  />

                  {/* Botões de Ação */}
                  <Box sx={{ mt: 2 }}>
                    <Button variant="contained" size="small" sx={{ mr: 1 }}>
                      Ver Detalhes
                    </Button>
                    {ticket.status !== "Resolvido" && (
                      <Button variant="outlined" size="small">
                        Atualizar Status
                      </Button>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Box>
          </Fade>
        ))}
      </Box>

      {/* 🔹 Botão para retornar ao Dashboard */}
      {/* <Button variant="contained" href="/" sx={{position:'fixed',bottom:0,left:'50%',zIndex:1000}}>Voltar</Button> */}

      {/* 🔹 Modal para Criar Novo Chamado */}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Novo Chamado</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            label="Descreva o problema"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            multiline
            rows={3}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="secondary">
            Cancelar
          </Button>
          <Button onClick={handleAddTicket} variant="contained">
            Abrir Chamado
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
