import { useEffect, useState} from "react";
import "./App.css";
import Map from "./Map";
import SwipeableEdgeDrawer from "./Drawer.tsx";
import Factsheet from "./Factsheet.tsx"
import FeatureCards from './FeatureCards';

function App() {
  const [currentNeighborhood, setCurrentNeighborhood] = useState<string>("Test wijk");
  const [selectedPolygons, setSelectedPolygons] = useState<GeoJSON.Feature[]>([]);

  useEffect(() => {
    console.log(currentNeighborhood);
  }, [currentNeighborhood]);

      /*<div id="app-container">
      <NavPanel
        currentNeighborhood={currentNeighborhood}
        setCurrentNeighborhood={setCurrentNeighborhood}
      />
      <Factsheet currentNeighborhood={currentNeighborhood} />
    </div>*/
  return (
    <div>
      <div id="details-area">
        <SwipeableEdgeDrawer/>
        <FeatureCards selectedPolygons={selectedPolygons} setSelectedPolygons={setSelectedPolygons} />
      </div>
      
      <div id="map-area">
        <Map selectedPolygons={selectedPolygons} setSelectedPolygons={setSelectedPolygons}/>
      </div>
    </div>
  );
}

export default App;
