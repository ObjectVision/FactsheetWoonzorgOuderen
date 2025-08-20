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

  &.collapsed {
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
  border: none;

  box-shadow: rgba(0, 0, 0, 0.07) 0px 1px 1px, rgba(0, 0, 0, 0.07) 0px 2px 2px,
    rgba(0, 0, 0, 0.07) 0px 4px 4px, rgba(0, 0, 0, 0.07) 0px 8px 8px,
    rgba(0, 0, 0, 0.07) 0px 16px 16px;

  &#polygon-0 {
    h2,
    h3 {
      color: #d95f02;
    }
    border-bottom: #d95f02 15px solid;
  }
  &#polygon-1 {
    h2,
    h3 {
      color: #7570b3;
    }
    border-bottom: #7570b3 15px solid;
  }
  &#polygon-2 {
    h2,
    h3 {
      color: #1b9e77;
    }
    border-bottom: #1b9e77 15px solid;
  }

  > .top-right {
    position: relative;
    float: right;
  }

  > .center{
    position:relative;
    width: 100%;
    float:center;
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
    setCollapsed(!collapsed);
  };

  return (
    <Panel className={collapsed ? "collapsed" : ""}>
      {selectedPolygons.map((feature: GeoJSON.Feature, idx: number) => (
        <PanelCard key={idx} id={`polygon-${idx}`}>
          <CloseIcon className="top-right" onClick={() => handleRemove(idx)} />
          <div className="card-content">
            <><h2>{feature.properties!.naam}</h2>
            <h3>{feature.properties!.WK_CODE}</h3>
            </>
            <p>Meer info komt hier</p>
          </div>
          <DownIcon className="center" onClick={() => handleScrollDown()} />
        </PanelCard>
      ))}
    </Panel>
  );
}
