import { Card, CardContent, Typography, Box } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
// Optional: define GeoJSON.Feature type if not available
//type Feature = GeoJSON.Feature;


interface ChildProps {
  selectedPolygons: GeoJSON.Feature[];
  setSelectedPolygons: React.Dispatch<React.SetStateAction<GeoJSON.Feature[]>>;
}



export default function FeatureCards({ selectedPolygons, setSelectedPolygons }: ChildProps) {
  if (!selectedPolygons)
    return;

  const handleRemove = (indexToRemove: number) => {
    setSelectedPolygons(prev => prev.filter((_, i) => i !== indexToRemove));
  };
  return (
    <Box
      sx={{
        position: 'fixed',
        top: '50%',
        left: 16,
        transform: 'translateY(-50%)',
        display: 'flex',
        flexDirection: 'row',
        gap: 2,
        zIndex: 1300,
      }}
    >
      {selectedPolygons.map((feature:GeoJSON.Feature, idx:number) => (
        <Card key={idx} sx={{ minWidth: 200, maxWidth:200, position: 'relative'}}>
          <IconButton
            size="small"
            onClick={() => handleRemove(idx)}
            sx={{ position: 'absolute', top: 4, right: 4 }}
          >
          <CloseIcon fontSize="small" />
          </IconButton>
          <CardContent>
            
            <Typography variant="h6">{feature.properties!.naam}</Typography>
            <Typography variant="body2" color="text.secondary">
                <strong>WK_CODE:</strong> {feature.properties!.WK_CODE}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}