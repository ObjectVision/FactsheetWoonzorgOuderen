import CloseIcon from "./assets/CloseIcon";
import styled from "styled-components";
import { DownIcon, UpIcon } from "./assets/DownIcon";
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

const PanelHandle = styled.div`
  /*border: rgba(255, 0, 0, 1) 1px solid;*/
  
  
  display: flex;
  /*align-items: top;        */
  justify-content: center;     /* center horizontally */
  background: rgba(255,255,255,0.9);
  cursor: pointer;
  z-index: 1400;
   border-radius: 0px;
`;

const PanelContent = styled.div`
  /*border: rgba(255, 0, 0, 1) 1px solid;*/
  
  flex-grow: 100;
  overflow-y: auto;
  display: flex;
  align-items: top;        
  justify-content: center;     /* center horizontally */
  background: rgba(185, 61, 135, 0.9);
  cursor: pointer;
  z-index: 1400;
   border-radius: 0px;
`;

const PanelCard = styled.div`
  width: auto;
  height: 15vh;
  background-color: rgba(255, 255, 255, 0.8);
  padding: 1rem;
  flex-grow: 1;
  border: rgba(255, 75, 75, 1) 1px solid;
  /*border: none;*/
  position: relative;

  &#polygon-0 {
    h2,
    h3 {
      color: #d95f02;
    }
  }
  &#polygon-1 {
    h2,
    h3 {
      color: #7570b3;
    }
  }
  &#polygon-2 {
    h2,
    h3 {
      color: #1b9e77;
    }
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

const PanelFooter = styled.div`
  width: auto;
  height: 0;
  border: rgba(255, 75, 75, 1) 1px solid;
  background-color: rgba(255, 255, 255, 0.5);
  flex-grow: 1;
  position: relative;

  &#polygon-0 {
    border-bottom: #d95f02 15px solid;
  }
  &#polygon-1 {
    border-bottom: #7570b3 15px solid;
  }
  &#polygon-2 {
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
  flex-direction: row;         
  justify-content: space-around;
  align-items: stretch;
  flex: 1;
  width: 100%;
`;

const Button = styled.button`
  height: auto;
  width: auto;
  background-color: rgba(0,0,0,0);
  border: none;
  padding: 0.3rem;
  cursor: pointer;
  color: grey;
  text-decoration: none;
  font-size: 1.8rem;
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
    { selectedPolygons.length!==0?
      <PanelHandle onClick={handleScrollDown}>
        {collapsed?
          <Button onClick={handleScrollDown}>
            <i className="ri-arrow-down-wide-line"></i>
          </Button>:
          <Button onClick={handleScrollDown}>
            <i className="ri-arrow-up-wide-line"></i>
          </Button>
        }
      </PanelHandle> : null
    }

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

    <PanelContent>

      test
    </PanelContent>

    <CardsRow>
      {selectedPolygons.map((feature: GeoJSON.Feature, idx: number) => (
        <PanelFooter key={idx} id={`polygon-${idx}`}></PanelFooter>
      ))}
    </CardsRow>
  </Panel>
);
}
