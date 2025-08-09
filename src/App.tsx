import { useEffect, useState} from "react";
import "./App.css";
import Map from "./Map.tsx"
import SwipeableEdgeDrawer from "./Drawer.tsx";
import Factsheet from "./Factsheet.tsx"
import FeatureCards from './FeatureCards';
import SearchAppBar from './AppBar.tsx';
import SubjectNav from './SubjectNav.tsx';
import Controls from './Controls.tsx'
import TreeviewControl from "./TreeviewControl.tsx";
import TitleBox from './Title.tsx'
import Treeview from './Treeview.tsx'

import sources_json from "./assets/sources.json?url";
import layers_json from "./assets/layers.json?url";
import map_json from "./assets/map.json?url";

function App() {
  const [currentNeighborhood, setCurrentNeighborhood] = useState<string>("Test wijk");
  const [selectedPolygons, setSelectedPolygons] = useState<GeoJSON.Feature[]>([]);
  const [showLayerControl, setshowLayerControl] = useState<boolean>(true);
  const [sourceJSON, setsourceJSON] = useState<JSON>();
  const [layerJSON, setlayerJSON] = useState<JSON>();
  const [mapJSON, setmapJSON] = useState<JSON>();
  

  useEffect(() => {
    console.log(currentNeighborhood);
  }, [currentNeighborhood]);

  useEffect(() => {
    const fetchAppJsonFiles = async () => {
        const [resA, resB, resC] = await Promise.all([
          fetch(sources_json),
          fetch(layers_json),
          fetch(map_json)
        ]);

        if (!resA.ok || !resB.ok || !resC.ok) {
          throw new Error('One or both JSON files failed to load.');
        }

        const [jsonA, jsonB, jsonC] = await Promise.all([
          resA.json(),
          resB.json(),
          resC.json()
        ]);

        setsourceJSON(jsonA);
        setlayerJSON(jsonB);
        setmapJSON(jsonC);

      };

    fetchAppJsonFiles();
  }, []);

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
        <Treeview showLayerControl={showLayerControl} setShowLayerControl={setshowLayerControl}/>
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
