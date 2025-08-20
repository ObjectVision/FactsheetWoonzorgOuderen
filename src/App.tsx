import { useEffect, useState} from "react";
import "./App.css";
import Map from "./Map.tsx"
import FeatureCards from './FeatureCards';
import MapControlButtons from './Controls.tsx'
import TreeviewControl from "./TreeviewControl.tsx";
import TitleBox from './Title.tsx'
import Treeview from './Treeview.tsx'
import type {TreeViewItem} from './Treeview.tsx'

//import type { TreeViewBaseItem } from '@mui/x-tree-view/models';
import sources_json from "./data/sources.json?url";
import layers_json from "./data/layers.json?url";
import map_json from "./data/map.json?url";

function App() {
  const [selectedPolygons, setSelectedPolygons] = useState<GeoJSON.Feature[]>([]);
  const [showLayerControl, setshowLayerControl] = useState<boolean>(true);
  const [sourceJSON, setsourceJSON] = useState<JSON[]>();
  const [layerJSON, setlayerJSON] = useState<JSON[]>();
  const [mapJSON, setmapJSON] = useState<TreeViewItem[]>([{id: '', label: '', children: []}]);
  const [latestChangedLayer, setLatestChangedLayer] = useState<[boolean, TreeViewItem]|undefined>();

  useEffect(() => {
    const fetchAppJsonFiles = async () => {
      fetch(sources_json).then((res) => { return res.json()}).then((res:any)=> {setsourceJSON(res)});
      fetch(layers_json).then((res) => { return res.json()}).then((res:any)=> {setlayerJSON(res)});
      fetch(map_json).then((res) => { return res.json()}).then((res:any)=> {setmapJSON(res)});
    };

    fetchAppJsonFiles();
  }, []);

  return (
    <div>
      <div id="details-area">
        <TitleBox/>
        <Treeview setLatestChangedLayer={setLatestChangedLayer} showLayerControl={showLayerControl} mapJSON={mapJSON}/>
        <TreeviewControl showLayerControl={showLayerControl} setShowLayerControl={setshowLayerControl}/>
        <MapControlButtons/>
        <FeatureCards selectedPolygons={selectedPolygons} setSelectedPolygons={setSelectedPolygons} />
      </div>
      
      <div id="map-area">
        <Map latestChangedLayer={latestChangedLayer} sourceJSON={sourceJSON} layerJSON={layerJSON} selectedPolygons={selectedPolygons} setSelectedPolygons={setSelectedPolygons}/>
      </div>
    </div>
  );
}

export default App;