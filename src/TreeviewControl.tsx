import { Box, Button, SvgIcon } from '@mui/material';
import LayersIcon from '@mui/icons-material/Layers';

const buttonStyle = {
  backgroundColor: '#ffffffd8',
  color: '#4a4a4ad3',
  width: 40,
  height: 40,
  minWidth: 40,
  borderRadius: 1,
  padding: 0,
  stroke:'#4a4a4ad3',
  strokeWidth:1,
  border: '1px',
  '&:focus': {
    outline: 'none'
  }
};

export default function TreeviewControl() {
  return (
    <Box
      sx={{
        position: 'absolute',
        top: 50,
        left: 5,
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        zIndex: 1000,
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Button sx={buttonStyle}>
          <LayersIcon/>
        </Button>
      </Box>
    </Box>
  );
}