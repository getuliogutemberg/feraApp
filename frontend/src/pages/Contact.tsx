import { useState } from "react";
import { TextField, Button, Typography, Grid, Alert, Paper, useMediaQuery } from "@mui/material";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Box } from "@mui/system";

const Contact = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const isSmallScreen = useMediaQuery("(max-width:1200px)");
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <Box sx={{ textAlign: "center", mt:isSmallScreen ? "80px" : "80px",  height:'90vh',overflow:"auto" ,padding:"20px"   }}>
      {/* Título com animação */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Contato
        </Typography>
        <Typography variant="body1" sx={{ mb: 3, color: "#888" }}>
          Entre em contato conosco preenchendo o formulário abaixo. Responderemos o mais breve possível.
        </Typography>
      </motion.div>

      {/* Alerta de sucesso */}
      {submitted && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
          <Alert severity="success" sx={{ mb: 2 }}>
            Mensagem enviada com sucesso!
          </Alert>
        </motion.div>
      )}

      {/* Formulário dentro de um Paper para melhor visualização */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Paper elevation={3} sx={{ p: 4, borderRadius: 3, maxWidth: 600, mx: "auto" }}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3} justifyContent="center">
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Nome"
                  name="name"
                  variant="outlined"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  sx={{ borderRadius: 2 }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  type="email"
                  label="E-mail"
                  name="email"
                  variant="outlined"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  sx={{ borderRadius: 2 }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Mensagem"
                  name="message"
                  multiline
                  rows={4}
                  variant="outlined"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  sx={{ borderRadius: 2 }}
                />
              </Grid>
              <Grid item xs={12}>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    sx={{
                      width: "100%",
                      py: 1.5,
                      borderRadius: 2,
                      fontSize: "1rem",
                      fontWeight: "bold",
                    }}
                  >
                    Enviar Mensagem
                  </Button>
                  
                </motion.div>
                <Button
          component={Link}
          to="/"
          variant="contained"
          fullWidth
          sx={{
            backgroundColor: "#00eaff",
              borderColor: "#00eaff",
              color: "#0d1117",
              fontWeight: "bold",
            mt: 2,
            height: 45,
           
            
            "&:hover": {
              borderColor: "#00eaff",
              color: "white",
            },
          }}
        >
          {"Voltar"}
        </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </motion.div>
      
    </Box>
  );
};

export default Contact;
