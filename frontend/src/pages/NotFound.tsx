import { Box } from '@mui/system';
import './NotFound.css';  // Importe o arquivo CSS
import { useNavigate } from 'react-router-dom';  // Importe o hook useNavigate

export default function NotFound() {
  const navigate = useNavigate();  // Inicialize o hook de navegação

  // Função para voltar uma navegação
  const handleGoBack = () => {
    navigate(-1);  // Volta uma navegação na pilha de histórico
  };

  return (
    <div className="container">
      <h1>Rota Inexistente </h1>
      <p>A rota não existe.</p>
      <Box sx={{ mt: 4 }}>
        {/* Chamando handleGoBack para navegar uma página atrás */}
        <button onClick={handleGoBack}>Voltar</button>
      </Box>
    </div>
  );
}
