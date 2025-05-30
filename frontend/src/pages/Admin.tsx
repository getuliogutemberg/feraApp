import { Card, CardContent, Typography, Button, Box, Fade } from "@mui/material";
import { Link } from "react-router-dom";
import { deepPurple} from "@mui/material/colors";




// import { useContext } from "react";
// import { AuthContext } from "../context/AuthContext";
// import { motion } from "framer-motion";
import { TbPackages } from "react-icons/tb";

import { 
  FaUsers ,
  
  // FaLifeRing
} from "react-icons/fa";

import { FaPalette } from "react-icons/fa";

export default function Admin() {
  // const { user  } = useContext(AuthContext);
  

  return (
    <Box sx={{ 
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      px: 0,
      ml: "80px",
      // background: "#fff",
      width: "calc(100vw - 110px)",
      height: "calc(100vh - 110px)",
      mt: "60px",
      pt: 0,
      gap: 0
    }}>
      

      <Box sx={{
        display: "flex",
        justifyContent: "start",
        
        flexWrap: "wrap",
        overflow: "auto",
        height: "calc(100vh - 110px)",
        gap: 2
      }}>
        {[
          { title: "Usuários", icon: <FaUsers fontSize="large" />, color: "#1F2A4C", path: "/usuários" },
          { title: "Módulos", icon: <TbPackages fontSize="large" />, color: deepPurple[500], path: "/módulos" },
          { title: "Navegação", icon: <TbPackages fontSize="large" />, color: deepPurple[500], path: "/navegação" },
          { title: "Customização", icon: <FaPalette fontSize="large" />, color: "#1F2A4C", path: "/customização" },
        
        ].map((section, index) => (
          <Fade in key={index} timeout={500}>
            <Box sx={{ 
              width: 400,
              minWidth: 300,
              height: "fit-content",
              
              transition: "transform 0.3s, box-shadow 0.3s",
              "&:hover": {
                transform: "scale(1.02)",
                
              }
            }}>
              <Card
                sx={{
                  boxShadow: 3,
                  // backgroundColor: '#d3d3d3',
                  transition: "transform 0.3s, box-shadow 0.3s",
                  "&:hover": {
                    transform: "scale(1.02)",
                    boxShadow: 6,
                  }
                }}
              >
                <CardContent sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <Box sx={{
                    width: 56, 
                    height: 56, 
                    bgcolor: '#f7801c', 
                    color: '#141414', 
                    borderRadius: "50%", 
                    display: "flex", 
                    justifyContent: "center", 
                    alignItems: "center", 
                    mb: 2
                  }}>
                    {section.icon}
                  </Box>
                  <Typography variant="h6" fontWeight="bold" sx={{ color: '#141414' }}>{section.title}</Typography>
                  <Button
                    variant="contained"
                    sx={{ 
                      mt: 2,
                      backgroundColor: '#f7801c',
                      '&:hover': {
                        backgroundColor: '#f7801c',
                        color:"#141414"
                      }
                    }}
                    component={Link}
                    to={section.path}
                  >
                    Acessar
                  </Button>
                </CardContent>
              </Card>
            </Box>
          </Fade>
        ))}



      </Box>
    </Box>
  );
}
