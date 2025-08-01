import { useEffect, useState} from "react";
import "./App.css";
import Map from "./Map";
import SwipeableEdgeDrawer from "./Drawer.tsx";
import Factsheet from "./Factsheet.tsx"
import FeatureCards from './FeatureCards';
import SearchAppBar from './AppBar.tsx';
import SubjectNav from './SubjectNav.tsx';
import Controls from './Controls.tsx'
import TreeviewControl from "./TreeviewControl.tsx";
import TitleBox from './Title.tsx'
import LayerTreeView from './LayerControl.tsx'

function App() {
  const [currentNeighborhood, setCurrentNeighborhood] = useState<string>("Test wijk");
  const [selectedPolygons, setSelectedPolygons] = useState<GeoJSON.Feature[]>([]);
  const [showLayerControl, setshowLayerControl] = useState<boolean>(false);

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
        <TitleBox/>
        <LayerTreeView showLayerControl={showLayerControl} setShowLayerControl={setshowLayerControl}/>
        <TreeviewControl showLayerControl={showLayerControl} setShowLayerControl={setshowLayerControl}/>
        <Controls/>
        <FeatureCards selectedPolygons={selectedPolygons} setSelectedPolygons={setSelectedPolygons} />
      </div>
      
      <div id="map-area">
        <Map selectedPolygons={selectedPolygons} setSelectedPolygons={setSelectedPolygons}/>
      </div>
    </div>
  );
}

export default App;
