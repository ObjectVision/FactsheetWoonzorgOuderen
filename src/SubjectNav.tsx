import React from 'react';
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Paper,
} from '@mui/material';

export default function SubjectNav() {
  const [layer1, setLayer1] = React.useState('');
  const [layer2, setLayer2] = React.useState('');
  const [layer3, setLayer3] = React.useState('');

  return (
    <Paper
      elevation={4}
      sx={{
        position: 'fixed',
        top: 100,
        left: '50%',
        transform: 'translateX(-50%)',
        padding: 2,
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        zIndex: 10,
      }}
    >
      <FormControl size="small">
        <InputLabel id="layer1-label">Layer 1</InputLabel>
        <Select
          labelId="layer1-label"
          value={layer1}
          label="Layer 1"
          onChange={(e) => setLayer1(e.target.value)}
        >
          <MenuItem value="a">Option A</MenuItem>
          <MenuItem value="b">Option B</MenuItem>
        </Select>
      </FormControl>

      <Box>en</Box>

      <FormControl size="small">
        <InputLabel id="layer2-label">Layer 2</InputLabel>
        <Select
          labelId="layer2-label"
          value={layer2}
          label="Layer 2"
          onChange={(e) => setLayer2(e.target.value)}
        >
          <MenuItem value="x">Option X</MenuItem>
          <MenuItem value="y">Option Y</MenuItem>
        </Select>
      </FormControl>

      <Box>voor</Box>

      <FormControl size="small">
        <InputLabel id="layer3-label">gebied</InputLabel>
        <Select
          labelId="layer3-label"
          value={layer3}
          label="Layer 3"
          onChange={(e) => setLayer3(e.target.value)}
        >
          <MenuItem value="1">Option 1</MenuItem>
          <MenuItem value="2">Option 2</MenuItem>
        </Select>
      </FormControl>
    </Paper>
  );
}