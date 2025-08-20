import CloseIcon from "./assets/CloseIcon";
import styled from "styled-components";
import DownIcon from "./assets/DownIcon";
import { useState } from "react";

// Optional: define GeoJSON.Feature type if not available
//type Feature = GeoJSON.Feature;

const Panel = styled.div`
  width: 100vw;
  height: auto;
  position: fixed;
  bottom: 0%;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: stretch;
  z-index: 1300;
  overflow-y: hidden;

  &.collapsed{
    overflow-y: scroll;
    height: 90vh;
  }
`;

const PanelCard = styled.div`
  width: auto;
  background-color: rgba(255, 255, 255, 0.8);
  padding: 1rem;
  flex-grow: 1;
  border: rgb(128, 128, 128) 1px solid;
  display: flex;
  flex-direction: column;
  &#polygon-0 {
    h2 {
      color: red;
    }
    border: red 5px solid;
  }
  &#polygon-1 {
    h2 {
      color: blue;
    }
    border: blue 5px solid;
  }
  &#polygon-2 {
    h2 {
      color: green;
    }
    border: green 5px solid;
  }
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

  const [collapsed, setCollapsed] = useState(false);
  
  const handleRemove = (indexToRemove: number) => {
    setSelectedPolygons((prev) => prev.filter((_, i) => i !== indexToRemove));
  };
  const handleScrollDown = () => {
    setCollapsed(!collapsed)
  }

  return (
    <Panel className={collapsed? "collapsed": ""}>
      {selectedPolygons.map((feature: GeoJSON.Feature, idx: number) => (
        <PanelCard key={idx} id={`polygon-${idx}`}>
          <CloseIcon onClick={() => handleRemove(idx)} />
          <div className="card-content">
            <h2>{feature.properties!.naam}</h2>
            <p>
              <strong>WK_CODE:</strong> {feature.properties!.WK_CODE}
            </p>
          </div>
          <DownIcon onClick={() => handleScrollDown()}/>
        </PanelCard>
      ))}
    </Panel>
  );
}
