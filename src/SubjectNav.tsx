import React from 'react';
import { Paper, Box, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const availableMaps = ['Topographic', 'Satellite', 'Greyscale', 'Hybrid'];

export default function SubjectNav() {
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 72, // Just below AppBar (64px default AppBar height + spacing)
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 1200,
      }}
    >
      <Paper elevation={3} sx={{ px: 2, py: 1 }}>
        <FormControl variant="standard" fullWidth>
          <InputLabel id="map-select-label">Select Map</InputLabel>
          <Select
            labelId="map-select-label"
            //value={selectedMap}
            //onChange={(e) => onChange(e.target.value)}
            label="Select Map"
            sx={{ minWidth: 200 }}
          >
            {availableMaps.map((mapName) => (
              <MenuItem key={mapName} value={mapName}>
                {mapName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Paper>
    </Box>
  );
}