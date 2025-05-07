import { useState } from "react";
import { Typography, Accordion, AccordionSummary, AccordionDetails, useMediaQuery, Button, Box } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const faqData = [
  {
    question: "Como posso monitorar os sensores em tempo real?",
    answer: "Nosso painel de monitoramento exibe os dados em tempo real utilizando WebSockets."
  },
  {
    question: "Posso integrar novos sensores ao sistema?",
    answer: "Sim! O sistema permite a adição de sensores compatíveis via configuração na interface."
  },
  {
    question: "O sistema funciona sem internet?",
    answer: "Sim, mas algumas funcionalidades podem ser limitadas sem uma conexão ativa."
  },
];

const Faq = () => {
  const isSmallScreen = useMediaQuery("(max-width:1200px)");
  const [expanded, setExpanded] = useState<string | false>(false);

  const handleChange = (panel: string) => (_: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <Box sx={{ textAlign: "center", mt:isSmallScreen ? "80px" : "80px", height:'90vh',overflow:"auto" ,padding:"20px"  }}>
      {/* Título com animação */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Typography variant="h4" gutterBottom>
          Perguntas Frequentes
        </Typography>
      </motion.div>

      {faqData.map((faq, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: index * 0.1 }}
        >
          <Accordion
            expanded={expanded === `panel${index}`}
            onChange={handleChange(`panel${index}`)}
            sx={{ mb: 2, borderRadius: 2, boxShadow: 3 }}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">{faq.question}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body1">{faq.answer}</Typography>
            </AccordionDetails>
          </Accordion>
        </motion.div>
      ))}
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
    </Box>
  );
};

export default Faq;
