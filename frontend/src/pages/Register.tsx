import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Typography, Box, CircularProgress, Alert, Dialog, DialogActions, DialogContent, DialogTitle, Stack, MenuItem, Select, PaletteMode } from "@mui/material";
import { motion } from "framer-motion";
import axios from "axios";

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

export default function Register() {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [category, setCategory] = useState(" ");
  const [newCategory, setNewCategory] = useState("");
  const [addCategory, setAddCategory] = useState(false);

  const [secretKey, setSecretKey] = useState("CLIENT");
  const [newSecretKey, setNewSecretKey] = useState("");
  const [addSecretKey, setAddSecretKey] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [settings, setSettings] = useState<Configuration | null>(null);
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

  const navigate = useNavigate();

  const [categories, setCategories] = useState([
    // "Operador de Máquina",
    // "Técnico de Manutenção",
    // "Supervisor de Produção",
    // "Engenheiro de Processos",
    // "Gerente Industrial",
    // "Diretor de Operações"
    //...adicionar mais categorias
    "Paraty"
  ]);

  const [secretKeys, setSecretKeys] = useState(["OWNER", "ADMIN", "CLIENT"]);

  const handleAddCategory = () => {
    if (newCategory && !categories.includes(newCategory)) {
      setCategories([...categories, newCategory]);
      setCategory(newCategory);
      setAddCategory(false);
      setNewCategory("");
    }
  };

  const handleCancelAddCategory = () => {
      setCategory('')
      setAddCategory(false);
      setNewCategory("");
    
  };

  const handleCancelAddSecretKey = () => {
    setSecretKey('')
    setAddSecretKey(false);
    setNewSecretKey("");
  
};
  const handleAddSecretKey = () => {
    if (newSecretKey && !secretKeys.includes(newSecretKey)) {
      setSecretKeys([...secretKeys, newSecretKey]);
      setSecretKey(newSecretKey);
      setNewSecretKey("");
    }
  };

  const handleRegister = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    if (!name) {
      setError("Nome é obrigatório!");
      setLoading(false);
      return;
    }

    try {
      await axios.post("http://localhost:5000/register", {
        name,
        email: username,
        password,
        category,
        className: secretKey,
        status: 'cadastro'
      });
      setSuccess("Usuário registrado com sucesso!");
      setOpenDialog(true);
    } catch {
      setError("Erro inesperado. Tente novamente.");
    }
    setLoading(false);
  };

  return (
    <Box sx={{ width: "50vw", height: "100vh", display: "flex", alignItems: "center", justifyContent: "center",minWidth:"500px" }}>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "40px 20px",
          backgroundColor: "rgba(255, 255, 255, 0.3)",
          backdropFilter: "blur(15px)",
          borderRadius: "10px",
          boxShadow: "0 8px 20px rgba(0, 0, 0, 0.2)",
          border: "1px solid rgba(255, 255, 255, 0.1)"
        }}
      >
        <Typography variant="h3" gutterBottom sx={{ color: "#0a4a6d", textAlign: "center" }}>
          Cadastro de acesso
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

        <Box component="form" onSubmit={handleRegister}>
          <TextField label="Nome" variant="filled" fullWidth sx={{ mb: 2, bgcolor: "white", borderRadius: "5px" }} value={name} onChange={(e) => setName(e.target.value)} required />
          <TextField label="Usuário (E-mail)" variant="filled" fullWidth sx={{ mb: 2, bgcolor: "white", borderRadius: "5px" }} value={username} onChange={(e) => setUsername(e.target.value)} required />
          <TextField label="Senha" type="password" variant="filled" fullWidth sx={{ mb: 2, bgcolor: "white", borderRadius: "5px" }} value={password} onChange={(e) => setPassword(e.target.value)} required />

         
        {!addCategory ? settings?.addCategory && <Select fullWidth displayEmpty value={category} onChange={(e) => setCategory(e.target.value)} sx={{ mb: 2, bgcolor: "white", borderRadius: "5px" }}>
            <MenuItem value="" disabled>Selecione uma categoria</MenuItem>
            {categories.map((cat) => (
              <MenuItem key={cat} value={cat}>{cat}</MenuItem>
            ))}
           {settings ? (settings.allowNewCategory && <MenuItem onClick={() => setAddCategory(true)} >+ Adicionar uma categoria ?</MenuItem>) : null}

          </Select> : 
            <Box sx={{
              display: "flex",
              // flexDirection:"column",
              gap: 2,
              // width: "calc(100vw - 330px)",
              // minWidth: "500px",
              flexWrap: "wrap",
              mb:2
            }}
            flexDirection={{ xs: "row", sm: "column" }}
            >
              <TextField fullWidth sx={{ 
                 flex: 1,
                 borderRadius: "5px",
                 bgcolor: "white",
                 color: "#fff",
                 textTransform: "capitalize",
                 width: "100%",
                 
                 transition: "all 0.3s ease-in-out",
                 "&:hover": {
                   boxShadow: "0 8px 18px rgba(0, 0, 0, 0.3)",
                   transform: "translateY(-2px)",
                 },
                 "&:disabled": {
                   bgcolor: "rgba(0, 0, 0, 0.4)",
                 },
                
                 }}  label="Nova Categoria" value={newCategory} onChange={(e) => setNewCategory(e.target.value)} />

                 <Stack sx={{
                  flex: 0,
                  direction: "row",
                  justifyContent: "space-between",
                  width: "100%",
                  flexWrap: "nowrap",
                  
                }}
                direction={{ xs: "row", sm: "row" }} // Pilha no mobile, linha em telas maiores
                spacing={2} // Espaçamento entre os botões
                
                >
             <Button onClick={handleAddCategory} disabled={!newCategory}
              sx={{ 
                flex: newCategory ? 1 : 0,
                 
                 
                 bgcolor: "#0a4a6d",
                 color: "#fff",
                 textTransform: "capitalize",
                 fontWeight: "bold",
                 fontSize: "1.5rem",
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
              > + </Button>
<Button onClick={handleCancelAddCategory}
              sx={{ 
                flex:  !newCategory ? 1 : 0,
                 
                 
                 bgcolor: "rgba(255,0,0,0.5)",
                 color: "#fff",
                 textTransform: "lowercase",
                 fontWeight: "bold",
                 fontSize: "1.5rem",
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
              > x </Button>
             
             
             </Stack>
             </Box> 
           } 

{!addSecretKey ? settings?.addSecretKey && <Select fullWidth displayEmpty value={secretKey} onChange={(e) => setSecretKey(e.target.value)} sx={{ mb: 2, bgcolor: "white", borderRadius: "5px" }}>
            <MenuItem value="" disabled>Selecione uma chave</MenuItem>
            {secretKeys.map((key) => (
              <MenuItem key={key} value={key}>{key}</MenuItem>
            ))}
            {settings ? (settings.allowNewClassName && <MenuItem onClick={()=>setAddSecretKey(true)} > + Adicionar uma Classe ?</MenuItem>): null}
          </Select>
           : 
            <Box sx={{
              display: "flex",
              // flexDirection:"column",
              gap: 2,
              // width: "calc(100vw - 330px)",
              // minWidth: "500px",
              flexWrap: "wrap",
              mb:2
            }}
            flexDirection={{ xs: "row", sm: "column" }}
            >
              <TextField fullWidth sx={{ 
                 flex: 1,
                 borderRadius: "5px",
                 bgcolor: "white",
                 color: "#fff",
                 textTransform: "capitalize",
                 width: "100%",
                 
                 transition: "all 0.3s ease-in-out",
                 "&:hover": {
                   boxShadow: "0 8px 18px rgba(0, 0, 0, 0.3)",
                   transform: "translateY(-2px)",
                 },
                 "&:disabled": {
                   bgcolor: "rgba(0, 0, 0, 0.4)",
                 },
                
                 }}  label="Nova Classe" value={newSecretKey} onChange={(e) => setNewSecretKey(e.target.value)} />

                 <Stack sx={{
                  flex: 0,
                  direction: "row",
                  justifyContent: "space-between",
                  width: "100%",
                  flexWrap: "nowrap",
                  
                }}
                direction={{ xs: "row", sm: "row" }} // Pilha no mobile, linha em telas maiores
                spacing={2} // Espaçamento entre os botões
                
                >
             <Button onClick={handleAddSecretKey} disabled={!newSecretKey}
              sx={{ 
                flex: newSecretKey ? 1 : 0,
                 
                 
                 bgcolor: "#0a4a6d",
                 color: "#fff",
                 textTransform: "capitalize",
                 fontWeight: "bold",
                 fontSize: "1.5rem",
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
              > + </Button>
                  <Button onClick={handleCancelAddSecretKey}
              sx={{ 
                flex:  !newSecretKey ? 1 : 0,
                 
                 
                 bgcolor: "rgba(255,0,0,0.5)",
                 color: "#fff",
                 textTransform: "lowercase",
                 fontWeight: "bold",
                 fontSize: "1.5rem",
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
              > x </Button>
             
             
             </Stack>
             </Box> 
           } 

         
          

          <Stack 
          sx={{
            mt: 2,
            justifyContent: "space-between",
            width: "100%",
            flexWrap: "wrap",
          }}
          direction={{ xs: "column", sm: "row" }} // Pilha no mobile, linha em telas maiores
          spacing={2} // Espaçamento entre os botões
          >
            <Button type="submit"  sx={{ 
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
        
         }}  disabled={loading}>
              {loading ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Registrar"}
            </Button>
            <Button onClick={() => navigate(-1)}  sx={{
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
        }}}>Voltar</Button>
          </Stack>
        </Box>
      </motion.div>

      <Dialog 
      open={openDialog}
      onClose={() => setOpenDialog(false)}
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
        <DialogTitle  sx={{ textAlign: "center",fontSize: "1.5rem", fontWeight: "bold", color: "#111" }}>Registro Concluído</DialogTitle>
        <DialogContent>
          <Typography sx={{ textAlign: "center", fontSize: "1rem" , color: "#fff"}}>Usuário registrado com sucesso! Deseja fazer login agora?</Typography>
        </DialogContent>
        <DialogActions  sx={{ justifyContent: "center", gap: 2 }}>
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
          onClick={() => setOpenDialog(false)}
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
             >Fechar</Button>
          <Button 
          onClick={() => navigate("/login")}
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
             >Ir para Login</Button>
              </Stack>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
