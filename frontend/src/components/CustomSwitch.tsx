import {  Switch,  styled, SwitchProps, } from "@mui/material";

const CustomSwitch = styled((props: SwitchProps) => (
    <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
  ))(({ theme }) => ({
    width: 25,
    height: 16,
    padding: 0,
    '& .MuiSwitch-switchBase': {
      padding: 0,
      margin: 0,
      transitionDuration: '300ms',
      '&.Mui-checked': {
        transform: 'translateX(10px)',
        color: '#fff',
        '& + .MuiSwitch-track': {
          backgroundColor: 'rgba(46, 112, 171, 1)',
          opacity: 1,
          border: 1,
          ...theme.applyStyles('dark', {
            backgroundColor: '#2ECA45',
          }),
        },
        '&.Mui-disabled + .MuiSwitch-track': {
          opacity: 0.5,
        },
      },
      '&.Mui-focusVisible .MuiSwitch-thumb': {
        color: '#33cf4d',
        border: '6px solid #fff',
      },
      '&.Mui-disabled .MuiSwitch-thumb': {
        color: theme.palette.grey[100],
        ...theme.applyStyles('dark', {
          color: theme.palette.grey[100],
        }),
      },
      '&.Mui-disabled + .MuiSwitch-track': {
        opacity: 0.7,
        ...theme.applyStyles('dark', {
          opacity: 0.7,
        }),
      },
    },
    '& .MuiSwitch-thumb': {
      boxSizing: 'border-box',
      width: 15,
      height: 15,
      position: 'relative',
      backgroundColor: '#888', // Cor cinza para o estado desligado
      '&::before': {
        content: '"✕"',
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        fontSize: '10px',
        color: '#fff', // X branco
      },
    },
    '& .MuiSwitch-switchBase.Mui-checked .MuiSwitch-thumb': {
      backgroundColor: '#fff', // Bolinha branca quando ligado
      '&::before': {
        content: '"✓"',
        color: 'rgba(46, 112, 171, 1)', // V azul
      },
    },
    '& .MuiSwitch-track': {
      borderRadius: 26 / 2,
      backgroundColor: '#E9E9EA',
      opacity: 1,
      transition: theme.transitions.create(['background-color'], {
        duration: 500,
      }),
      ...theme.applyStyles('dark', {
        backgroundColor: '#39393D',
      }),
    },
  }));

  export default CustomSwitch;