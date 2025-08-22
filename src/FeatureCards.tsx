import CloseIcon from "./assets/CloseIcon";
import styled from "styled-components";
import DownIcon from "./assets/DownIcon";
import { useEffect, useState } from "react";

const Panel = styled.div`
  width: 100vw;
  height: auto;
  position: fixed;
  bottom: 0;
  display: flex;
  flex-direction: column;   /* stack TopPanel on top of cards */
  z-index: 1300;
  overflow-y: hidden;

  &.collapsed {
    height: 90vh;
  }
`;

const TopPanel = styled.div`
  border: rgba(255, 0, 0, 1) 1px solid;
  width: 100%;
  height: 40px;                /* fixed height handle */
  display: flex;
  align-items: center;         /* center vertically */
  justify-content: center;     /* center horizontally */
  background: rgba(255,255,255,0.9);
  cursor: pointer;
  z-index: 1400;
`;

const PanelCard = styled.div`
  width: auto;
  background-color: rgba(255, 255, 255, 0.8);
  padding: 1rem;
  flex-grow: 1;
  border: rgba(255, 255, 255, 1) 1px solid;
  border: none;
  position: relative;

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

const CardsRow = styled.div`
  display: flex;
  flex-direction: row;          /* keep your cards side-by-side */
  justify-content: space-around;
  align-items: stretch;
  flex: 1;                      /* take remaining space */
  width: 100%;
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

  useEffect(()=>{
    // remove container when no selected polygons
    if(selectedPolygons.length <=0){
      setCollapsed(false)
    }
  },[selectedPolygons])

return (
  <Panel className={collapsed ? "collapsed" : ""}>
    <TopPanel onClick={handleScrollDown}>
      <DownIcon className="center" onClick={handleScrollDown} />
    </TopPanel>

    <CardsRow>
      {selectedPolygons.map((feature: GeoJSON.Feature, idx: number) => (
        <PanelCard key={idx} id={`polygon-${idx}`}>
          <CloseIcon className="top-right" onClick={() => handleRemove(idx)} />
          <div className="card-content">
            <h2>{feature.properties!.naam}</h2>
            <h3>{feature.properties!.WK_CODE}</h3>
            <p>Meer info komt hier</p>
          </div>
        </PanelCard>
      ))}
    </CardsRow>
  </Panel>
);
}
