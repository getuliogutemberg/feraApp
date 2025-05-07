import { useState, useContext, useEffect } from "react";
import { 
  Typography, TextField, Button, Box, Avatar, IconButton, Paper, Fade, 
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle
} from "@mui/material";
import { Edit, Save, UploadFile } from "@mui/icons-material";

import { motion } from "framer-motion";
import { AuthContext } from "../context/AuthContext"; // Importe o AuthContext

import axios from "axios";

export default function Profile() {
  const { user, setUser } = useContext(AuthContext); // Adicione setUser do contexto
  const [name, setName] = useState(user?.name || ""); // Definindo o nome inicial do usuário
  const [email, setEmail] = useState(user?.email || ""); // Definindo o e-mail inicial do usuário
  const [bio, setBio] = useState(user?.bio || ""); // Definindo a bio inicial do usuário
  const [profilePic, setProfilePic] = useState(user?.customIcon || "https://via.placeholder.com/150"); // Definindo a foto de perfil
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false); // Novo estado para loading
  const [error, setError] = useState<string | null>(null); // Novo estado para erros
  // Simulação de upload de imagem
  const [openPasswordModal, setOpenPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordLoading, setPasswordLoading] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfilePic(imageUrl);
    }
  };

  // Atualizar as informações do perfil quando o usuário logado mudar
  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setBio(user?.bio);
      setProfilePic(user.customIcon);
    }
  }, [user]);
  
// Nova função para salvar alterações
const handleSaveChanges = async () => {
  if (!user?._id) return;
  
  setLoading(true);
  setError(null);
  
  try {
    const response = await axios.put(`http://localhost:5000/users/${user._id}`, {
      name,
      email,
      bio,
      customIcon: profilePic
    });

    // Atualiza o usuário no contexto
    setUser(response.data);
    setEditing(false);
  } catch (err) {
    setError("Erro ao salvar alterações. Tente novamente.");
    console.error("Erro ao atualizar perfil:", err);
  } finally {
    setLoading(false);
  }

  
};

const handleChangePassword = async () => {
  // Validações básicas
  if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
    setPasswordError("Todos os campos são obrigatórios");
    return;
  }

  if (passwordData.newPassword !== passwordData.confirmPassword) {
    setPasswordError("As senhas não coincidem");
    return;
  }

  if (passwordData.newPassword.length < 6) {
    setPasswordError("A nova senha deve ter pelo menos 6 caracteres");
    return;
  }

  setPasswordLoading(true);
  setPasswordError(null);

  try {
    await axios.put(`http://localhost:5000/users/${user?._id}/password`, {
      currentPassword: passwordData.currentPassword,
      newPassword: passwordData.newPassword
    });

    // Limpa o formulário e fecha o modal
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setOpenPasswordModal(false);
    // Opcional: mostrar mensagem de sucesso
  } catch (error) {
    if (axios.isAxiosError(error)) {
      setPasswordError(error.response?.data?.message || "Erro ao alterar senha");
    } else {
      setPasswordError("Erro inesperado ao alterar senha");
    }
  } finally {
    setPasswordLoading(false);
  }
};
  return (
    <Box sx={{ 
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'start',
      px: 2,
      ml: "80px",
      background: "#0A1C44",
      width: "calc(100vw - 110px)",
      height: "calc(100vh - 70px)",
      mt: "60px",
      pt: 3,
      gap: 2
    }}>
      <motion.div initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
        <Typography variant="h3" sx={{ 
          fontWeight: "bold", 
          color: "white", 
          mb: 2,
          fontSize:{ xs: "1.5rem", sm: "2rem", md: "2.5rem" } 
        }}>
          Configurações da Conta
        </Typography>
        <Typography variant="h6" sx={{ 
          color: "#fff", 
          mb: 4, 
          fontSize: { xs: "1rem", sm: "1rem", md: "1rem" },
          opacity: 0.7
        }}>
          Configure as suas informações pessoais e a foto de perfil!
        </Typography>
      </motion.div>

      {error && (
        <Alert severity="error" sx={{ mb: 2, width: "100%", maxWidth: "650px" }}>
          {error}
        </Alert>
      )}

      <Fade in timeout={1000}>
        <Paper elevation={1} sx={{ 
          p: 4,
          display: "flex",
          flexDirection: 'column',
          justifyContent: "center",
          width: "100%",
          maxWidth: "650px",
          backgroundColor: '#1F2A4C',
          borderRadius: "8px",
        }}>
          <Box sx={{ position: "relative", mb: 4 }}>
            <Avatar src={profilePic} sx={{ width: 120, height: 120, mx: "auto" }} />
            {editing && (
              <IconButton
                component="label"
                sx={{
                  position: "absolute",
                  top: "100px",
                  right: "38%",
                  bgcolor: "#0A1C44",
                  color: "white",
                  boxShadow: 3,
                  '&:hover': {
                    bgcolor: '#152347'
                  }
                }}
              >
                <UploadFile />
                <input type="file" hidden accept="image/*" onChange={handleFileChange} />
              </IconButton>
            )}
          </Box>

          <TextField
            label="Nome"
            fullWidth
            value={name}
            variant="filled"
            onChange={(e) => setName(e.target.value)}
            disabled={!editing}
            sx={{ 
              mb: 2,
              background:"#fff",
              '& .MuiOutlinedInput-root': {
                color: '#fff',
                '& fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.23)',
                },
              },
              '& .MuiInputLabel-root': {
                color: 'rgba(255, 255, 255, 0.7)',
              },
            }}
          />

          <TextField
            label="E-mail"
            fullWidth
            variant="filled"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={!editing || (user?.className !== "ADMIN" && user?.className !== "OWNER")}
            sx={{ 
              mb: 2,
              background:"#fff",
              '& .MuiOutlinedInput-root': {
                color: '#fff',
                '& fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.23)',
                },
              },
              '& .MuiInputLabel-root': {
                color: 'rgba(255, 255, 255, 0.7)',
              },
            }}
          />

          <TextField
            placeholder="Biografia"
            fullWidth
            multiline
            rows={3}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            disabled={!editing}
            sx={{ 
              mb: 2,
              background:"#fff",
              color:"#000",
              '& .MuiOutlinedInput-root': {
                
                '& fieldset': {
                  borderColor: 'rgba(0, 0, 0, 1)',
                },
              },
              '& .MuiInputLabel-root': {
                color: '#000',
              },
            }}
          />

          <Box sx={{ mt: 2, display: "flex", justifyContent: "center", flexDirection: "column", gap: 2 }}>
            {editing && (
              <Button
                variant="contained"
                onClick={() => setOpenPasswordModal(true)}
                sx={{ 
                  backgroundColor: '#0A1C44',
                  '&:hover': {
                    backgroundColor: '#152347'
                  }
                }}
              >
                Alterar Senha
              </Button>
            )}
            
            {editing ? (
              <Button 
                variant="contained" 
                color="error" 
                startIcon={<Save />}
                onClick={handleSaveChanges}
                disabled={loading}
              >
                {loading ? "Salvando..." : "Salvar Alterações"}
              </Button>
            ) : (
              <Button 
                variant="contained" 
                startIcon={<Edit />}
                onClick={() => setEditing(true)}
                sx={{ 
                  backgroundColor: '#0A1C44',
                  '&:hover': {
                    backgroundColor: '#152347'
                  }
                }}
              >
                Editar Perfil
              </Button>
            )}
          </Box>
        </Paper>
      </Fade>

      <Dialog 
        open={openPasswordModal} 
        onClose={() => setOpenPasswordModal(false)}
        PaperProps={{
          sx: {
            backgroundColor: '#1F2A4C',
            color: '#fff'
          }
        }}
      >
        <DialogTitle>Alterar Senha</DialogTitle>
        <DialogContent>
          {passwordError && (
            <Alert severity="error" sx={{ mb: 2, mt: 2 }}>
              {passwordError}
            </Alert>
          )}
          <TextField
            label="Senha Atual"
            type="password"
            fullWidth
            value={passwordData.currentPassword}
            onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
            sx={{ 
              mb: 2, 
              mt: 2,
              '& .MuiOutlinedInput-root': {
                color: '#fff',
                '& fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.23)',
                },
              },
              '& .MuiInputLabel-root': {
                color: 'rgba(255, 255, 255, 0.7)',
              },
            }}
          />
          <TextField
            label="Nova Senha"
            type="password"
            fullWidth
            value={passwordData.newPassword}
            onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
            sx={{ 
              mb: 2,
              '& .MuiOutlinedInput-root': {
                color: '#fff',
                '& fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.23)',
                },
              },
              '& .MuiInputLabel-root': {
                color: 'rgba(255, 255, 255, 0.7)',
              },
            }}
          />
          <TextField
            label="Confirmar Nova Senha"
            type="password"
            fullWidth
            value={passwordData.confirmPassword}
            onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
            sx={{ 
              mb: 2,
              '& .MuiOutlinedInput-root': {
                color: '#fff',
                '& fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.23)',
                },
              },
              '& .MuiInputLabel-root': {
                color: 'rgba(255, 255, 255, 0.7)',
              },
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenPasswordModal(false)} sx={{ color: '#fff' }}>
            Cancelar
          </Button>
          <Button 
            onClick={handleChangePassword}
            variant="contained" 
            disabled={passwordLoading}
            sx={{ 
              backgroundColor: '#0A1C44',
              '&:hover': {
                backgroundColor: '#152347'
              }
            }}
          >
            {passwordLoading ? "Alterando..." : "Alterar Senha"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
