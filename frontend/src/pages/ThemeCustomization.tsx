import { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Switch,
  FormControlLabel,
  Popover,
} from '@mui/material';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import { HexColorPicker } from 'react-colorful';

interface ThemeSettings {
  fontFamily: string;
  themeMode: 'light' | 'dark';
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
  buttonPrimaryColor: string;
  buttonSecondaryColor: string;
  titleBarColor: string;
  navBarColor: string;
  cardColor: string;
  backgroundImageBase64?: string;
}

const fontOptions = [
  'Arial',
  'Roboto',
  'Open Sans',
  'Montserrat',
  'Poppins',
  'Inter',
];

const fontFallbacks: { [key: string]: string } = {
  'Arial': 'Arial, Helvetica, sans-serif',
  'Roboto': 'Roboto, Arial, sans-serif',
  'Open Sans': 'Open Sans, Arial, sans-serif',
  'Montserrat': 'Montserrat, Arial, sans-serif',
  'Poppins': 'Poppins, Arial, sans-serif',
  'Inter': 'Inter, Arial, sans-serif',
};

function getFontStack(fontFamily: string): string {
  return fontFallbacks[fontFamily] || 'Arial, Helvetica, sans-serif';
}

export default function ThemeCustomization() {
  const [settings, setSettings] = useState<ThemeSettings>({
    fontFamily: 'Arial',
    themeMode: 'light',
    primaryColor: '#1F2A4C',
    secondaryColor: '#f7801c',
    backgroundColor: '#ffffff',
    textColor: '#000000',
    buttonPrimaryColor: '#1976d2',
    buttonSecondaryColor: '#9c27b0',
    titleBarColor: '#333333',
    navBarColor: '#222222',
    cardColor: '#f5f5f5',
    backgroundImageBase64: '',
  });
  const { enqueueSnackbar } = useSnackbar();
  const [anchorEl, setAnchorEl] = useState<{ [key: string]: HTMLElement | null }>({});
  
  // Estado para preview temporário
  const [previewColors, setPreviewColors] = useState({
    backgroundColor: '#ffffff',
    textColor: '#000000',
    primaryColor: '#1F2A4C',
    secondaryColor: '#f7801c',
  });

  const fetchSettings = useCallback(async () => {
    try {
      const response = await axios.get('/api/configurations');
      const config = response.data[0];
      setSettings({
        fontFamily: config.fontFamily,
        themeMode: config.themeMode,
        primaryColor: config.primaryColor.startsWith('#') ? config.primaryColor : '#1F2A4C',
        secondaryColor: config.secondaryColor.startsWith('#') ? config.secondaryColor : '#f7801c',
        backgroundColor: config.backgroundColor.startsWith('#') ? config.backgroundColor : '#ffffff',
        textColor: config.textColor.startsWith('#') ? config.textColor : '#000000',
        buttonPrimaryColor: config.buttonPrimaryColor || '#1976d2',
        buttonSecondaryColor: config.buttonSecondaryColor || '#9c27b0',
        titleBarColor: config.titleBarColor || '#333333',
        navBarColor: config.navBarColor || '#222222',
        cardColor: config.cardColor || '#f5f5f5',
        backgroundImageBase64: config.backgroundImageBase64 || '',
      });
    } catch (error) {
      enqueueSnackbar('Erro ao carregar configurações' + error, { variant: 'error' });
    }
  }, [enqueueSnackbar]);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  useEffect(() => {
    // Atualiza preview ao carregar settings ou ao trocar modo
    if (settings.themeMode === 'dark') {
      setPreviewColors({
        backgroundColor: '#181818',
        textColor: '#f5f5f5',
        primaryColor: '#222',
        secondaryColor: '#444',
      });
    } else {
      setPreviewColors({
        backgroundColor: settings.backgroundColor,
        textColor: settings.textColor,
        primaryColor: settings.primaryColor,
        secondaryColor: settings.secondaryColor,
      });
    }
  }, [settings.themeMode, settings.backgroundColor, settings.textColor, settings.primaryColor, settings.secondaryColor]);

  const handleSave = async () => {
    try {
      await axios.put('/api/configurations/1', settings);
      enqueueSnackbar('Configurações salvas com sucesso!', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar('Erro ao salvar configurações'+ error, { variant: 'error' });
    }
  };

  const handleColorClick = (event: React.MouseEvent<HTMLElement>, colorField: string) => {
    setAnchorEl(prev => ({ ...prev, [colorField]: event.currentTarget }));
  };

  const handleColorClose = (colorField: string) => {
    setAnchorEl(prev => ({ ...prev, [colorField]: null }));
  };

  const handleColorChange = (color: string, field: keyof ThemeSettings) => {
    setSettings(prev => ({ ...prev, [field]: color }));
    setAnchorEl(prev => ({ ...prev, [field]: null })); // Fecha o popover ao escolher
  };

  // Função para upload de imagem e conversão para base64
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setSettings(prev => ({ ...prev, backgroundImageBase64: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  return (
    <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'start',
        px: 2,
        ml: "80px",
        width: "calc(100vw - 110px)",
        height: "calc(100vh - 110px)",
        mt: "60px",
        pt: 3,
        gap: 2,
        overflow: 'hidden',
      }}>
      <Typography variant="h4" gutterBottom >
        Customização da Interface
      </Typography>
      
      <Box sx={{display:'flex', justifyContent:'space-between',gap : 2,height: 'calc(100vh - 110px)'}}>
          <Card sx={{flexGrow: 1, justifyContent:'space-between',overflow:'auto'}}>
            <CardContent sx={{}}>
              <Typography variant="h6" gutterBottom>
                Configurações de Tema
              </Typography>
              
              <FormControl fullWidth margin="normal">
                <InputLabel>Família da Fonte</InputLabel>
                <Select
                  value={settings.fontFamily}
                  onChange={(e) => setSettings({ ...settings, fontFamily: e.target.value })}
                >
                  {fontOptions.map((font) => (
                    <MenuItem key={font} value={font}>
                      {font}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControlLabel
                control={
                  <Switch
                    checked={settings.themeMode === 'dark'}
                    onChange={(e) => setSettings({
                      ...settings,
                      themeMode: e.target.checked ? 'dark' : 'light'
                    })}
                  />
                }
                label="Modo Escuro"
              />

              {/* Color Pickers */}
              <Box sx={{ mt: 2 }}>
                <Typography gutterBottom>Cor Primária</Typography>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      backgroundColor: settings.primaryColor,
                      border: '1px solid #ccc',
                      cursor: 'pointer'
                    }}
                    onClick={(e) => handleColorClick(e, 'primaryColor')}
                  />
                  <span>{settings.primaryColor}</span>
                </Box>
                <Popover
                  open={Boolean(anchorEl['primaryColor'])}
                  anchorEl={anchorEl['primaryColor']}
                  onClose={() => handleColorClose('primaryColor')}
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                >
                  <Box sx={{ p: 2 }}>
                    <HexColorPicker
                      color={settings.primaryColor}
                      onChange={(color) => handleColorChange(color, 'primaryColor')}
                    />
                  </Box>
                </Popover>
              </Box>

              <Box sx={{ mt: 2 }}>
                <Typography gutterBottom>Cor Secundária</Typography>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      backgroundColor: settings.secondaryColor,
                      border: '1px solid #ccc',
                      cursor: 'pointer'
                    }}
                    onClick={(e) => handleColorClick(e, 'secondaryColor')}
                  />
                  <span>{settings.secondaryColor}</span>
                </Box>
                <Popover
                  open={Boolean(anchorEl['secondaryColor'])}
                  anchorEl={anchorEl['secondaryColor']}
                  onClose={() => handleColorClose('secondaryColor')}
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                >
                  <Box sx={{ p: 2 }}>
                    <HexColorPicker
                      color={settings.secondaryColor}
                      onChange={(color) => handleColorChange(color, 'secondaryColor')}
                    />
                  </Box>
                </Popover>
              </Box>

              <Box sx={{ mt: 2 }}>
                <Typography gutterBottom>Cor de Fundo</Typography>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      backgroundColor: settings.backgroundColor,
                      border: '1px solid #ccc',
                      cursor: 'pointer'
                    }}
                    onClick={(e) => handleColorClick(e, 'backgroundColor')}
                  />
                  <span>{settings.backgroundColor}</span>
                </Box>
                <Popover
                  open={Boolean(anchorEl['backgroundColor'])}
                  anchorEl={anchorEl['backgroundColor']}
                  onClose={() => handleColorClose('backgroundColor')}
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                >
                  <Box sx={{ p: 2 }}>
                    <HexColorPicker
                      color={settings.backgroundColor}
                      onChange={(color) => handleColorChange(color, 'backgroundColor')}
                    />
                  </Box>
                </Popover>
              </Box>

              <Box sx={{ mt: 2 }}>
                <Typography gutterBottom>Cor do Texto</Typography>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      backgroundColor: settings.textColor,
                      border: '1px solid #ccc',
                      cursor: 'pointer'
                    }}
                    onClick={(e) => handleColorClick(e, 'textColor')}
                  />
                  <span>{settings.textColor}</span>
                </Box>
                <Popover
                  open={Boolean(anchorEl['textColor'])}
                  anchorEl={anchorEl['textColor']}
                  onClose={() => handleColorClose('textColor')}
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                >
                  <Box sx={{ p: 2 }}>
                    <HexColorPicker
                      color={settings.textColor}
                      onChange={(color) => handleColorChange(color, 'textColor')}
                    />
                  </Box>
                </Popover>
              </Box>

              {/* Novos campos de cor */}
              <Box sx={{ mt: 2 }}>
                <Typography gutterBottom>Cor do Botão Primário</Typography>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                  <Box
                    sx={{ width: 40, height: 40, backgroundColor: settings.buttonPrimaryColor, border: '1px solid #ccc', cursor: 'pointer' }}
                    onClick={(e) => handleColorClick(e, 'buttonPrimaryColor')}
                  />
                  <span>{settings.buttonPrimaryColor}</span>
                </Box>
                <Popover
                  open={Boolean(anchorEl['buttonPrimaryColor'])}
                  anchorEl={anchorEl['buttonPrimaryColor']}
                  onClose={() => handleColorClose('buttonPrimaryColor')}
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                >
                  <Box sx={{ p: 2 }}>
                    <HexColorPicker
                      color={settings.buttonPrimaryColor}
                      onChange={(color) => handleColorChange(color, 'buttonPrimaryColor')}
                    />
                  </Box>
                </Popover>
              </Box>

              <Box sx={{ mt: 2 }}>
                <Typography gutterBottom>Cor do Botão Secundário</Typography>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                  <Box
                    sx={{ width: 40, height: 40, backgroundColor: settings.buttonSecondaryColor, border: '1px solid #ccc', cursor: 'pointer' }}
                    onClick={(e) => handleColorClick(e, 'buttonSecondaryColor')}
                  />
                  <span>{settings.buttonSecondaryColor}</span>
                </Box>
                <Popover
                  open={Boolean(anchorEl['buttonSecondaryColor'])}
                  anchorEl={anchorEl['buttonSecondaryColor']}
                  onClose={() => handleColorClose('buttonSecondaryColor')}
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                >
                  <Box sx={{ p: 2 }}>
                    <HexColorPicker
                      color={settings.buttonSecondaryColor}
                      onChange={(color) => handleColorChange(color, 'buttonSecondaryColor')}
                    />
                  </Box>
                </Popover>
              </Box>

              <Box sx={{ mt: 2 }}>
                <Typography gutterBottom>Cor da Barra de Título</Typography>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                  <Box
                    sx={{ width: 40, height: 40, backgroundColor: settings.titleBarColor, border: '1px solid #ccc', cursor: 'pointer' }}
                    onClick={(e) => handleColorClick(e, 'titleBarColor')}
                  />
                  <span>{settings.titleBarColor}</span>
                </Box>
                <Popover
                  open={Boolean(anchorEl['titleBarColor'])}
                  anchorEl={anchorEl['titleBarColor']}
                  onClose={() => handleColorClose('titleBarColor')}
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                >
                  <Box sx={{ p: 2 }}>
                    <HexColorPicker
                      color={settings.titleBarColor}
                      onChange={(color) => handleColorChange(color, 'titleBarColor')}
                    />
                  </Box>
                </Popover>
              </Box>

              <Box sx={{ mt: 2 }}>
                <Typography gutterBottom>Cor da Barra de Navegação</Typography>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                  <Box
                    sx={{ width: 40, height: 40, backgroundColor: settings.navBarColor, border: '1px solid #ccc', cursor: 'pointer' }}
                    onClick={(e) => handleColorClick(e, 'navBarColor')}
                  />
                  <span>{settings.navBarColor}</span>
                </Box>
                <Popover
                  open={Boolean(anchorEl['navBarColor'])}
                  anchorEl={anchorEl['navBarColor']}
                  onClose={() => handleColorClose('navBarColor')}
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                >
                  <Box sx={{ p: 2 }}>
                    <HexColorPicker
                      color={settings.navBarColor}
                      onChange={(color) => handleColorChange(color, 'navBarColor')}
                    />
                  </Box>
                </Popover>
              </Box>

              <Box sx={{ mt: 2 }}>
                <Typography gutterBottom>Cor dos Cards</Typography>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                  <Box
                    sx={{ width: 40, height: 40, backgroundColor: settings.cardColor, border: '1px solid #ccc', cursor: 'pointer' }}
                    onClick={(e) => handleColorClick(e, 'cardColor')}
                  />
                  <span>{settings.cardColor}</span>
                </Box>
                <Popover
                  open={Boolean(anchorEl['cardColor'])}
                  anchorEl={anchorEl['cardColor']}
                  onClose={() => handleColorClose('cardColor')}
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                >
                  <Box sx={{ p: 2 }}>
                    <HexColorPicker
                      color={settings.cardColor}
                      onChange={(color) => handleColorChange(color, 'cardColor')}
                    />
                  </Box>
                </Popover>
              </Box>

              {/* Upload de imagem de background */}
              <Box sx={{ mt: 2 }}>
                <Typography gutterBottom>Imagem de Background</Typography>
                <input type="file" accept="image/*" onChange={handleImageUpload} />
                {settings.backgroundImageBase64 && (
                  <Box sx={{ mt: 1 }}>
                    <img src={settings.backgroundImageBase64} alt="Background preview" style={{ maxWidth: 200, maxHeight: 100, borderRadius: 8 }} />
                  </Box>
                )}
              </Box>

              <Button
                variant="contained"
                color="primary"
                onClick={handleSave}
                sx={{ mt: 2 }}
              >
                Salvar Configurações
              </Button>
            </CardContent>
          </Card>
          <Card sx={{ overflow:'auto'}}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Preview
              </Typography>
              {/* Preview com as novas cores */}
              <Box
                sx={{
                  p: 0,
                
                  color: previewColors.textColor,
                  fontFamily: getFontStack(settings.fontFamily),
                 
                  aspectRatio: '16/9',
                  border: '2px solid #ccc',
                }}
              >
                {/* Barra de título */}
                <Box sx={{ backgroundColor: settings.titleBarColor, color: settings.textColor, p: 1, borderRadius: 0 }}>
                  <Typography variant="h5" gutterBottom>
                    Barra de Título
                  </Typography>
                </Box>
                <Box sx={{ 
                    display: 'flex' ,
                    height:'100%',
                    backgroundImage: settings.backgroundImageBase64 ? `url(${settings.backgroundImageBase64})` : undefined,
                    backgroundColor: previewColors.backgroundColor,
                    backgroundSize: 'cover',
                    backgroundPosition: 'bottom right',
                    backgroundRepeat: 'no-repeat',
                     }}>
                {/* Barra de navegação */}
                <Box sx={{ backgroundColor: settings.navBarColor, color: settings.textColor, p: 1, flexGrow: 1 }}>
                  <Typography>
                    Barra de Navegação
                  </Typography>
                </Box>
                {/* Card */}
                <Box sx={{  display:'flex',flexDirection:'column',justifyContent:'space-between', backgroundColor: settings.cardColor, color: settings.textColor, m: 2,p:2, borderRadius: 2  }}>
                  <Typography>
                    Este é um card de exemplo com a cor selecionada.
                  </Typography>
                <Box sx={{display:'flex',gap:2}}>
                    {/* Botões */}
                <Button
                  variant="contained"
                  sx={{
                   
                    backgroundColor: settings.buttonPrimaryColor,
                    color: '#fff',
                    
                    '&:hover': {
                      backgroundColor: settings.buttonPrimaryColor,
                      opacity: 0.8,
                    },
                  }}
                >
                  Botão Primário
                </Button>
                <Button
                  variant="contained"
                  sx={{
                    
                    backgroundColor: settings.buttonSecondaryColor,
                    color: '#fff',
                    '&:hover': {
                      backgroundColor: settings.buttonSecondaryColor,
                      opacity: 0.8,
                    },
                  }}
                >
                  Botão Secundário
                </Button>
                </Box>
                </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>
          </Box>
    </Box>
  );
} 