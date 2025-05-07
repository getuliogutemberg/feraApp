import { useState, useEffect, ChangeEvent } from "react";
import { Card, CardContent, Typography, Button, Box, Fade, Chip, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { Error, Warning, Info, CheckCircle, Edit, Delete } from "@mui/icons-material";
import axios from 'axios';

interface Alert {
  _id: string;
  type: string;
  title: string;
  description: string;
  color: string;
  icon: string;
}

const initialAlerts: Alert[] = [];

const iconMapping: Record<string, React.ReactNode> = {
  Error: <Error />,
  Warning: <Warning />,
  Info: <Info />,
  Success: <CheckCircle />,
};

export default function Alerts() {
  const [alerts, setAlerts] = useState<Alert[]>(initialAlerts);
  const [newAlert, setNewAlert] = useState<Alert>({
    _id: '',
    type: '',
    title: '',
    description: '',
    color: '',
    icon: "Info",
  });
  const [openEditModal, setOpenEditModal] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);

  const loadAlerts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/alerts');
      const alertsWithIcons = response.data.map((alert: Alert) => ({
        ...alert,
        icon: iconMapping[alert.icon] || <Info />,
      }));
      setAlerts(alertsWithIcons);
    } catch (error) {
      console.error("Erro ao carregar os alertas", error);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await axios.put(`http://localhost:5000/alerts/${id}`);
      loadAlerts();
    } catch (error) {
      console.error("Erro ao marcar como lido", error);
    }
  };

  const createAlert = async () => {
    if (!newAlert.type || !newAlert.title || !newAlert.description) {
      alert("Por favor, preencha todos os campos!");
      return;
    }

    try {
      await axios.post('http://localhost:5000/alerts', newAlert);
      loadAlerts();
      setNewAlert({
        _id: '',
        type: '',
        title: '',
        description: '',
        color: '',
        icon: 'Info',
      });
    } catch (error) {
      console.error("Erro ao criar o alerta", error);
    }
  };

  const deleteAlert = async (id: string) => {
    if (window.confirm(`Deseja excluir o alerta?`)) {
      try {
        await axios.delete(`http://localhost:5000/alerts/${id}`);
        loadAlerts();
      } catch (error) {
        console.error("Erro ao excluir o alerta", error);
      }
    }
  };

  const openEdit = (alert: Alert) => {
    setSelectedAlert(alert);
    setNewAlert(alert);
    setOpenEditModal(true);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNewAlert({
      ...newAlert,
      [e.target.name]: e.target.value,
    });
  };

  const handleCloseEditModal = () => {
    setOpenEditModal(false);
    setSelectedAlert(null);
  };

  const handleSaveEdit = async () => {
    if (!selectedAlert) return;
    
    // Atualizar 'deleteAt' antes de salvar (se necessário)
    const updatedAlert = {
      ...selectedAlert,
      deleteAt: new Date() // ou algum valor que você queira para 'deleteAt'
    };
  
    try {
      await axios.put(`http://localhost:5000/alerts/${updatedAlert._id}`, updatedAlert);
      loadAlerts();
      handleCloseEditModal();
    } catch (error) {
      console.error("Erro ao editar o alerta", error);
    }
  };

  useEffect(() => {
    loadAlerts();
  }, []);

  return (
    <Box sx={{ background: "rgba(16, 28, 68, 1)", width: 'calc(100vw - 120px)', height: "calc(100vh - 40px)", pl: "100px", pt: "130px", pr: "20px", display: "flex", flexDirection: "column", justifyContent: "start", alignItems: "center" }}>
      <Typography variant="h3" sx={{ fontWeight: "bold", color: "white", mb: 2 }}>
        Alertas
      </Typography>
      <Box sx={{ display: "flex", flexDirection: "column", width: "400px", mb: 2 }}>
        <TextField label="Tipo" name="type" value={newAlert.type} onChange={handleInputChange} fullWidth sx={{ mb: 1 }} />
        <TextField label="Título" name="title" value={newAlert.title} onChange={handleInputChange} fullWidth sx={{ mb: 1 }} />
        <TextField label="Descrição" name="description" value={newAlert.description} onChange={handleInputChange} fullWidth sx={{ mb: 1 }} />
        <Button variant="contained" onClick={createAlert}>Criar Alerta</Button>
      </Box>

      <Box sx={{ display: "flex", justifyContent: "start", flexWrap: "wrap", overflow: "auto", height: "calc(100vh - 235px)", gap: 2 }}>
        {alerts.length === 0 ? (
          <Typography variant="h6" color="text.secondary">Nenhum alerta pendente 🎉</Typography>
        ) : (
          alerts.map((alert) => (
            <Fade in key={alert._id} timeout={500}>
              <Box sx={{ width: 400, minWidth: 300, height: "fit-content", boxShadow: 1, transition: "transform 0.3s, box-shadow 0.3s", "&:hover": { transform: "scale(1.02)", boxShadow: 6 } }}>
                <Card sx={{ minHeight: 160, boxShadow: 3, transition: "transform 0.3s, box-shadow 0.3s", "&:hover": { transform: "scale(1.05)", boxShadow: 6 } }}>
                  <CardContent>
                    <Chip label={alert.type === "emergency" ? "Emergência" : alert.type === "maintenance" ? "Manutenção" : "Informação"} sx={{ bgcolor: alert.color, color: "white", fontWeight: "bold", mb: 2 }} />
                    <Typography variant="h6" fontWeight="bold">{alert.title}</Typography>
                    <Typography variant="body2" color="text.secondary">{alert.description}</Typography>
                    <Box sx={{ mt: 2 }}>
                      <Button variant="contained" color="success" startIcon={<CheckCircle />} onClick={() => markAsRead(alert._id)}>
                        Marcar como lido
                      </Button>
                      <Button variant="outlined" startIcon={<Edit />} onClick={() => openEdit(alert)}>
                        Editar
                      </Button>
                      <Button variant="outlined" color="error" startIcon={<Delete />} onClick={() => deleteAlert(alert._id)}>
                        Apagar
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Box>
            </Fade>
          ))
        )}
      </Box>

      {/* Modal de Edição */}
      <Dialog open={openEditModal} onClose={handleCloseEditModal}>
        <DialogTitle>Editar Alerta</DialogTitle>
        <DialogContent>
          <TextField label="Tipo" name="type" value={newAlert.type} onChange={handleInputChange} fullWidth sx={{ mb: 1 }} />
          <TextField label="Título" name="title" value={newAlert.title} onChange={handleInputChange} fullWidth sx={{ mb: 1 }} />
          <TextField label="Descrição" name="description" value={newAlert.description} onChange={handleInputChange} fullWidth sx={{ mb: 1 }} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditModal} color="secondary">Cancelar</Button>
          <Button onClick={handleSaveEdit} color="primary">Salvar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
