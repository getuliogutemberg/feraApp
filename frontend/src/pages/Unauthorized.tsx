
import { Box } from '@mui/system';
import './Unauthorized.css';  // Importe o arquivo CSS
import { useNavigate } from 'react-router-dom';



export default function Unauthorized() {
  const navigate = useNavigate();  // Inicialize o hook de navegação
   // Função para voltar uma navegação
   const handleGoBack = () => {
    navigate(-3);  // Volta uma navegação na pilha de histórico
  };
  
  return (
    <div className="container">
      <h1>Rota Restrita </h1> 
      <p>Autorização Recomendada. </p>
      <Box sx={{ mt: 4 }}>
        {/* Chamando handleGoBack para navegar uma página atrás */}
        <button onClick={handleGoBack}>Voltar</button>
      </Box>
    </div>
  );
}