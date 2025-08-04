import React from 'react';
import { Box, Typography } from '@mui/material';
import AssistWalkerIcon from '@mui/icons-material/AssistWalker';
import AccessibleForwardIcon from '@mui/icons-material/AccessibleForward';

const TitleBox: React.FC<{ title?: string }> = ({ title = 'Wonen & Zorg Limburg' }) => {
  return (
<Box
  sx={{
    position: 'fixed',
    top: 5,
    left: 500,
    right: 5,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffffd8',
    color: '#4a4a4ad3',
    height: 40,
    borderRadius: 1,
    padding: 0,
    stroke: '#4a4a4ad3',
    strokeWidth: 0.3,
    zIndex: 1300,
    '&:focus': {
      outline: 'none',
    },
  }}
>
      <AssistWalkerIcon/>
      <Typography variant="h1" sx={{ fontSize: 30, fontWeight:'550', textAlign: 'center' }}>
        {title}
      </Typography>
      <AccessibleForwardIcon/>
    </Box>
  );
};

export default TitleBox;