import { useEffect, useState} from "react";
import "./App.css";
import Map from "./Map.tsx"
//import SwipeableEdgeDrawer from "./Drawer.tsx";
import Factsheet from "./Factsheet.tsx"
import FeatureCards from './FeatureCards';
import SearchAppBar from './AppBar.tsx';
//import SubjectNav from './SubjectNav.tsx';
import Controls from './Controls.tsx'
import TreeviewControl from "./TreeviewControl.tsx";
import TitleBox from './Title.tsx'
import Treeview from './Treeview.tsx'
import type {TreeViewItem} from './Treeview.tsx'
import * as arrow from "apache-arrow";
import maplibregl, { DoubleClickZoomHandler } from "maplibre-gl";

//import type { TreeViewBaseItem } from '@mui/x-tree-view/models';
import sources_json from "./assets/sources.json?url";
import layers_json from "./assets/layers.json?url";
import map_json from "./assets/map.json?url";

function App() {
  const [currentNeighborhood, setCurrentNeighborhood] = useState<string>("Test wijk");
  const [selectedPolygons, setSelectedPolygons] = useState<maplibregl.MapGeoJSONFeature[]>([]);
  const [showLayerControl, setshowLayerControl] = useState<boolean>(true);
  const [sourceJSON, setsourceJSON] = useState<JSON[]>();
  const [layerJSON, setlayerJSON] = useState<JSON[]>();
  const [mapJSON, setmapJSON] = useState<TreeViewItem[]>([{id: '', label: '', children: []}]);
  const [latestChangedLayer, setLatestChangedLayer] = useState<[boolean, TreeViewItem]|undefined>();

  useEffect(() => {
    console.log(currentNeighborhood);
  }, [currentNeighborhood]);

  useEffect(() => {
    const fetchAppJsonFiles = async () => {
      fetch(sources_json).then((res) => { return res.json()}).then((res:any)=> {setsourceJSON(res)});
      fetch(layers_json).then((res) => { return res.json()}).then((res:any)=> {setlayerJSON(res)});
      fetch(map_json).then((res) => { return res.json()}).then((res:any)=> {setmapJSON(res)});
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
        <Treeview setLatestChangedLayer={setLatestChangedLayer} showLayerControl={showLayerControl} mapJSON={mapJSON}/>
        <TreeviewControl showLayerControl={showLayerControl} setShowLayerControl={setshowLayerControl}/>
        <Controls/>
        <FeatureCards selectedPolygons={selectedPolygons} setSelectedPolygons={setSelectedPolygons} />
      </div>
      
      <div id="map-area">
        <Map latestChangedLayer={latestChangedLayer} sourceJSON={sourceJSON} layerJSON={layerJSON} selectedPolygons={selectedPolygons} setSelectedPolygons={setSelectedPolygons}/>
      </div>
    </div>
  );
}

export default App;
