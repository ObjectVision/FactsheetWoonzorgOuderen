import { Card } from "@mui/material";
import { CloseIcon } from "./assets/CloseIcon";
import IconButton from "@mui/material/IconButton";
import styled from "styled-components";

// Optional: define GeoJSON.Feature type if not available
//type Feature = GeoJSON.Feature;

const Panel = styled.div`
  position: fixed;
  padding: 1rem;
  margin: 1rem;
  top: 50%;
  left: 16;
  transform: translateY(-50%);
  display: flex;
  gap: 2;
  z-index: 1300;
`;

interface ChildProps {
  selectedPolygons: GeoJSON.Feature[];
  setSelectedPolygons: React.Dispatch<React.SetStateAction<GeoJSON.Feature[]>>;
}

export default function FeatureCards({
  selectedPolygons,
  setSelectedPolygons,
}: ChildProps) {
  if (!selectedPolygons) return;

  const handleRemove = (indexToRemove: number) => {
    setSelectedPolygons((prev) => prev.filter((_, i) => i !== indexToRemove));
  };

  return (
    <Panel>
      {selectedPolygons.map((feature: GeoJSON.Feature, idx: number) => (
        <Card
          key={idx}
          sx={{ minWidth: 200, maxWidth: 200, position: "relative" }}
        >
          <IconButton
            size="small"
            onClick={() => handleRemove(idx)}
            sx={{ position: "absolute", top: 4, right: 4 }}
          >
            <CloseIcon />
          </IconButton>
          <i className="ri-admin-line"></i>
          <div className="card-content">
            <h2>{feature.properties!.naam}</h2>
            <p>
              {" "}
              <strong>WK_CODE:</strong> {feature.properties!.WK_CODE}
            </p>
          </div>
        </Card>
      ))}
    </Panel>
  );
}
