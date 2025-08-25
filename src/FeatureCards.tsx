
import CloseIcon from "./assets/CloseIcon";
import styled from "styled-components";
import { useEffect, useState } from "react";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";


const Panel = styled.div`
  width: 100vw;
  height: auto;
  position: fixed;
  bottom: 0;
  max-height: 500px;
  display: flex;
  flex-direction: column;
  justify-content: stretch;
  z-index: 1300;
  overflow: hidden;
  transition: all 0.7s ease;
  &.collapsed {
    height: auto;
    max-height: 75vh;
  }
`;

const PanelHandle = styled.div`
  /*border: rgba(255, 0, 0, 1) 1px solid;*/
  display: flex;
  /*align-items: top;        */
  justify-content: center;    
  background: rgba(255,255,255,0.9);
  cursor: pointer;
  z-index: 1400;
   border-radius: 0px;
`;


const Cards = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: stretch;
  flex: 1;
  width: 100%;
`;

const Card = styled.div`
  display:flex;
  flex-direction: column;
  width: auto;
  align-items: stretch;
  justify-content: flex-start;
  flex-grow: 0.0001;
  width: 0%;
  
  animation: show 600ms 100ms cubic-bezier(0.38, 0.97, 0.56, 0.76) forwards;
  @keyframes show {
  100% {
    transform: none;
    flex:1;
  }
}
`

const CardTopInfo = styled.div`
  flex-grow: 0.0001;
  width: auto;
  height: 15vh;
  background-color: rgba(255, 255, 255, 0.8);
  padding: 1rem;
  transition: all 1.7s ease;
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

const CardContent = styled.div`
  width: auto;
  align-items: stretch;
  flex: 1;
  width: 100%;
  height: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  background: rgba(185, 61, 135, 0.9);
  z-index: 1400;
  overflow-x: hidden;
  overflow-y: scroll;
  border: white solid 5px;
`;

const CardFooter = styled.div`
  width: auto;
  height: 0;
  border: rgba(255, 75, 75, 1) 1px solid;
  background-color: rgba(255, 255, 255, 0.5);
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

  flex-grow: 0.0001;
  width: 0%;

  animation: show 600ms 100ms cubic-bezier(0.38, 0.97, 0.56, 0.76) forwards;
  @keyframes show {
  100% {
    transform: none;
    flex:1;
  }
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

  useEffect(() => {
    // remove container when no selected polygons
    if (selectedPolygons.length <= 0) {
      setCollapsed(false)
    }
  }, [selectedPolygons])

  return (
    <Panel className={collapsed ? "collapsed" : ""}>
      {selectedPolygons.length !== 0 ?
        <PanelHandle onClick={handleScrollDown}>
          <Button onClick={handleScrollDown}>
            <i className={collapsed ? "ri-arrow-up-wide-line" : "ri-arrow-down-wide-line"}></i>
          </Button>
        </PanelHandle> : null
      }
      <Cards>
        {selectedPolygons.map((feature: GeoJSON.Feature, idx: number) => (
          <Card key={`card-${idx}`} >
            <CardTopInfo key={`card-info-${idx}`} id={`polygon-${idx}`}>
              <CloseIcon className="top-right" onClick={() => handleRemove(idx)} />
              <div className="card-content">
                <h2>{feature.properties!.naam}</h2>
                <h3>{feature.properties!.WK_CODE}</h3>
                <p>Meer info komt hier</p>
              </div>
            </CardTopInfo>

          </Card>
        ))}
      </Cards>
      <Cards>
        {collapsed ?
          <> {
            selectedPolygons.map((feature: GeoJSON.Feature, idx: number) => (
              <CardContent key={`card-content-${idx}`}>
                <h1>Test</h1>
                <h1>Test 2</h1>
                <h1>Test 3</h1>
              </CardContent>))
          }</>
          : null}
      </Cards>
      <Cards>

        {selectedPolygons.map((feature: GeoJSON.Feature, idx: number) => (
          <CardFooter key={idx} id={`polygon-${idx}`}></CardFooter>
        ))}
      </Cards>

    </Panel>
  );
}
