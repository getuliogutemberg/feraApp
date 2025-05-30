import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { TextField, Button, Typography, Box, CircularProgress, Alert } from "@mui/material";
import { motion } from "framer-motion";
import axios from "axios";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      setError("Token de recuperação não encontrado ou inválido.");
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    if (!password || !confirmPassword) {
      setError("Todos os campos são obrigatórios!");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("As senhas não coincidem!");
      setLoading(false);
      return;
    }

    if (!token) {
      setError("Token inválido!");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/reset-password", {
        token,
        newPassword: password
      });
      
      setMessage(response.data.message);
      
      // Redirecionar para login após 3 segundos
      setTimeout(() => {
        navigate("/login");
      }, 3000);
      
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Erro inesperado. Tente novamente.");
      } else {
        setError("Erro inesperado. Tente novamente.");
      }
    }
    setLoading(false);
  };

  return (
    <Box sx={{
      width: "100vw",
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between-content",
      alignItems: "center",
    }}>
      <Box sx={{
          width: "100vw",
          height: "100vh",
          minWidth: "500px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}>

          <motion.div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: "0.5rem",
              padding: "40px 20px 20px 20px",
              backgroundColor: "rgba(83, 83, 83, 0.1)",
              color: "#111",
              fontWeight: "bold",
              textAlign: "center",
              backdropFilter: "blur(15px)",
              boxShadow: "0 8px 20px rgba(0, 0, 0, 0.1)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              background: "linear-gradient(145deg, rgba(255, 255, 255, 0.3), rgba(0, 0, 0, 0.2))",
            }}
            initial={{
              y: "500%",
              opacity: 1,
            }}
            animate={{
              opacity: 1,
              y: 0,
              transition: { duration: 0.5, ease: "easeInOut" },
            }}
          >

             <div style={{
                scale:2,
                display:'flex',
                justifyContent:"center",
                alignItems:'center',
                   color:"#f3811e",
                   fontWeight: 'bold',
                   fontSize: '2.5rem',
                   margin:'50px'
                }}><div style={{scale:0.8,width:'45px',height:'45px',background:"#f3811e",display:'flex',flexDirection:"column",justifyContent:"start",alignItems:"start"}}>
                    <div style={{width:'0px',height:'15px',background:"#eeeeee"}}></div>
                    <div style={{width:'32px',height:'16px',background:"#eeeeee",display:'flex',flexDirection:"column",justifyContent:"center",alignItems:"start"}}><div style={{width:'17px',height:'12px',background:"#f3811e"}}></div></div>
                    <div style={{width:'17px',height:'15px',background:"#eeeeee",display:'flex',flexDirection:"column",justifyContent:"center",alignItems:"start"}}><div style={{width:'12px',height:'13px',background:"#f3811e"}}></div></div>
                   
                    </div>FERA</div>            
            <Typography 
              variant="h5" 
              sx={{ 
                mb: 1, 
                color: "#f3811e", 
                fontWeight: "bold",
                textAlign: "center" 
              }}
            >
              Nova Senha
            </Typography>
            
            <Typography 
              variant="body1" 
              sx={{ 
                mb: 3, 
                color: "#f3811e", 
                textAlign: "center",
                opacity: 0.9
              }}
            >
              Digite sua nova senha
            </Typography>

            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                label="Nova Senha"
                type="password"
                variant="filled"
                fullWidth
                sx={{
                  backgroundColor: "white",
                  borderRadius: "5px",
                  mb: 2,
                }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading || !token}
              />

              <TextField
                label="Confirmar Nova Senha"
                type="password"
                variant="filled"
                fullWidth
                sx={{
                  backgroundColor: "white",
                  borderRadius: "5px",
                  mb: 2,
                }}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={loading || !token}
              />

              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={loading || !token || !!message}
                sx={{
                  mt: 2,
                  height: 45,
                  bgcolor: "#f27911",
                  color: "#fff",
                  textTransform: "capitalize",
                  fontWeight: "bold",
                  borderRadius: "0.5rem",
                  transition: "all 0.3s ease-in-out",
                  "&:hover": {
                    boxShadow: "0 8px 18px rgba(0, 0, 0, 0.3)",
                    transform: "translateY(-2px)",
                  },
                  "&:disabled": {
                    bgcolor: "rgba(0, 0, 0, 0.4)",
                  },
                }}
              >
                {loading ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Redefinir Senha"}
              </Button>              <Box sx={{ mt: 2, textAlign: "center" }}>
                <Button
                  variant="text"
                  onClick={() => navigate("/login")}
                  sx={{
                    color: "#f3811e",
                    textTransform: "none",
                    textDecoration: "underline",
                    fontSize: "0.9rem",
                    "&:hover": {
                      backgroundColor: "transparent",
                      textDecoration: "underline",
                    },
                  }}
                >
                  Voltar para o Login
                </Button>
              </Box>
            </Box>
          </motion.div>          
          {error && (
            <Alert
              severity="error"
              sx={{
                position: "fixed",
                top: "20px",
                left: "50%",
                transform: "translateX(-50%)",
                backgroundColor: "#ffcccb",
                borderRadius: "5px",
                color: "#000",
                transition: "all 0.5s ease-out",
                zIndex: 9999,
                minWidth: "300px",
                maxWidth: "500px",
              }}
            >
              {error}
            </Alert>
          )}

          {message && (
            <Alert
              severity="success"
              sx={{
                position: "fixed",
                top: "20px",
                left: "50%",
                transform: "translateX(-50%)",
                backgroundColor: "#d4edda",
                borderRadius: "5px",
                color: "#000",
                transition: "all 0.5s ease-out",
                zIndex: 9999,
                minWidth: "300px",
                maxWidth: "500px",
              }}
            >
              {message}
              <br />
              <Typography variant="caption">
                Redirecionando para o login...
              </Typography>
            </Alert>
          )}
        </Box>
    </Box>
  );
}
