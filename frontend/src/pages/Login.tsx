import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Typography, Box, CircularProgress, Alert, Dialog, DialogActions, DialogContent, DialogTitle, Stack, PaletteMode } from "@mui/material";  // Importe o Dialog
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { motion } from "framer-motion";


interface Configuration {
  notifications: boolean;
  allowRegister: boolean;
  allowRequireRegister: boolean;
  allowNewCategory: boolean;
  allowNewClassName: boolean;
  addSecretKey: boolean;
  addCategory: boolean;
  fontFamily: string;
  pageTitle: string;
  themeMode: PaletteMode;
  primaryColor: number;
  secondaryColor: number;
  backgroundColor: number;
  textColor: number;
  pbiKeys: {
    clientId: string;
    clientSecret: string;
    authority: string;
  };
}

interface SubRoute {
  path: string;
  icon: string;
  component: string;
  name: string;
  requiredRole: string[];
  pageId?: string;
  reportId?: string,
  workspaceId?: string,
}

interface MenuGroup {
  id: string;
  name: string;
  component: string;
  icon: string;
  path: string;
  subRoutes: SubRoute[];
  requiredRole?: string[];
}

export default function Login() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [animating, setAnimating] = useState(false);
  const [openRegisterDialog, setOpenRegisterDialog] = useState(false);  // Estado para controlar o modal de registro
 
  const [settings, setSettings] = useState<Configuration | null>(null);
  const [menuGroups, setMenuGroups] = useState<MenuGroup[]>([]);
  useEffect(() => {
    // Buscar configurações do backend
    const fetchSettings = async () => {
      try {
        const response = await axios.get('http://localhost:5000/configuration');
        setSettings(response.data); // Atualiza o estado com os dados do backend
      } catch (error) {
        console.error('Erro ao buscar configurações:', error);
      }
    };

    fetchSettings();
  }, []);

  useEffect(() => {
    
    // Carregar os grupos de menu do backend
    const fetchMenuGroups = async () => {
      
      try {
        const response = await axios.get<MenuGroup[]>("http://localhost:5000/menu-groups")
         
        
        setMenuGroups(response.data);
      } catch (error) {
        console.error('Erro ao carregar grupos de menu:', error);
      }
    };
    
    fetchMenuGroups();
  }, []);

  useEffect(() => {
    if (user && menuGroups.length > 0) {
      const primeiraSubRoute = menuGroups[0]?.path + menuGroups[0]?.subRoutes[0]?.path as string;
  
      if (primeiraSubRoute) {
        navigate(primeiraSubRoute);
      }
    }
  }, [user, menuGroups, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setAnimating(true);
    try {
      const response = await axios.post("http://localhost:5000/login", {
        email: username,
        password,
      });

      const { accessToken, refreshToken, user } = response.data;

      if (!accessToken || !refreshToken || !user) {
        setError("Dados inválidos recebidos.")
        
        throw new Error("Dados inválidos recebidos.");
      }

      if (user.isActive === false) {
        setError("Conta inativa.")
        setAnimating(false);
        setTimeout(() => setError(null), 5000);
        // throw new Error("Conta inativa.");
      } else {
         
      // Salva os dados no localStorage
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("user", JSON.stringify(user));

      // Atualiza o contexto de autenticação
      setUser(user);

      // Inicia animação ao enviar o formulário
      // Aguardar o tempo da animação antes de redirecionar
      setTimeout(() => {
      }, 100);  // Atraso para a animação
      navigate(menuGroups[0]?.path + menuGroups[0]?.subRoutes[0]?.path as string);

      }
     
      
    } catch (err: unknown) {
      
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Ocorreu um erro inesperado.");
        setAnimating(false);
      } else {
        setError("Erro desconhecido.");
        setAnimating(false);
      }
      setTimeout(() => setError(null), 5000);
      setOpenRegisterDialog((settings?.allowRegister || settings?.allowRequireRegister) ?? false);// Abre o modal de registro caso o login falhe
    } finally {
      setLoading(false);
    }
  };

  const handleCloseDialog = () => {
    setOpenRegisterDialog(false);  // Fecha o modal
  };

  const handleRegisterRedirect = () => {
    setOpenRegisterDialog(false);  // Fecha o modal
    navigate("/registro");  // Redireciona para a página de registro
  };
  const handleRequireRegisterRedirect = () => {
    setOpenRegisterDialog(false);  // Fecha o modal
    navigate("/solicitar-registro");  // Redireciona para a página de registro
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
              y: animating ? "-10000%" : 0,
              transition: { duration: 0.5, ease: "easeInOut" },
            }}
          >

            {/* <Typography variant="h3" gutterBottom sx={{ marginBottom: 4, color: "#F5f5f5",fontWeight: 'bold' }}>
            FERA
            </Typography> */}
             <div style={{
                //    textDecoration: 'none',
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

            <Box component="form" onSubmit={settings ? handleLogin : ()=> {}}>
              <TextField
                label="Email"
                type="text"
                 variant="filled"
                fullWidth
                sx={{
                  backgroundColor: "white",
                  borderRadius: "5px",
                  mb: 2,
                }}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <TextField
                label="Senha"
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
              />              <Button
                type="submit"
                variant="contained"
                fullWidth
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
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Entrar"}
              </Button>

              <Box sx={{ mt: 2, textAlign: "center" }}>
                <Button
                  variant="text"
                  onClick={() => navigate("/esqueci-senha")}
                  sx={{
                    color: "#f27911",
                    textTransform: "none",
                    textDecoration: "underline",
                    fontSize: "0.9rem",
                    "&:hover": {
                      backgroundColor: "transparent",
                      textDecoration: "underline",
                    },
                  }}
                >
                  Esqueci minha senha
                </Button>
              </Box>
            </Box>
          </motion.div>

          {error && (
            <Alert
              severity="error"
              sx={{
                position: "absolute",
                top: "0px",
                backgroundColor: "#ffcccb",
                borderRadius: "5px",
                color: "#000",
                transition: "all 0.5s ease-out",
              }}
            >
              {error}
            </Alert>
          )}
        </Box>
      

      {/* Modal de Registro */}
      <Dialog
  open={openRegisterDialog}
  onClose={handleCloseDialog}
  sx={{
    "& .MuiPaper-root": {
      borderRadius: "0.5rem",
      padding: "20px",
      backgroundColor: "rgba(255, 255, 255, 0.3)",
      backdropFilter: "blur(15px)",
      boxShadow: "0 8px 20px rgba(0, 0, 0, 0.2)",
      border: "1px solid rgba(255, 255, 255, 0.1)",
      background: "linear-gradient(145deg, rgba(255, 255, 255, 0.6), rgba(255, 255, 255, 0.02))",
    },
  }}
>
  <DialogTitle sx={{ textAlign: "center",fontSize: "1.5rem", fontWeight: "bold", color: "#111" }}>
    Login Falhou
  </DialogTitle>
  <DialogContent>
    <Typography sx={{ textAlign: "center", fontSize: "1rem" , color: "#fff"}}>
      Esse usuário esta cadastrado?
    </Typography>
  </DialogContent>
  <DialogActions sx={{ justifyContent: "center", gap: 2 }}>
  <Stack sx={{
                mt: 2,
                justifyContent: "space-between",
                width: "100%",
                flexWrap: "wrap",
              }}
              direction={{ xs: "column", sm: "row" }} // Pilha no mobile, linha em telas maiores
              spacing={2} // Espaçamento entre os botões
            > 
    
    <Button
      onClick={handleCloseDialog}
      
      sx={{ 
        flex: 1,
         mt: 2,
         height: 45,
         bgcolor: "#0a4a6d",
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
      Sim
    </Button>
    <Button
    onClick={settings?.allowRegister ? handleRegisterRedirect : handleRequireRegisterRedirect}
      
      sx={{
        flex: 1,
        mt: 2,
        height: 45,
        bgcolor: "#555",
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
        }}}
    >
      {settings?.allowRegister ? 'Cadastrar' : 'Não'}
    </Button>
    </Stack>
  </DialogActions>
</Dialog>

    </Box>
  );
}
