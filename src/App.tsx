import { useEffect, useState} from "react";
import "./App.css";
import Map from "./Map.tsx"
import FeatureCards from './FeatureCards';
import sources_json from "./data/sources.json?url";
import layers_json from "./data/layers.json?url";
import map_json from "./data/map.json?url";
import {ScrollArea} from "./components/ui/scroll-area.tsx"
import Treeview from "@/Treeview.tsx";

function App() {
  const [selectedPolygons, setSelectedPolygons] = useState<GeoJSON.Feature[]>([]);
  const [sourceJSON, setsourceJSON] = useState<JSON[]>();
  const [layerJSON, setlayerJSON] = useState<JSON[]>();
  const [mapJSON, setmapJSON] = useState<JSON[]>();

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
        <FeatureCards selectedPolygons={selectedPolygons} setSelectedPolygons={setSelectedPolygons} />
      </div>

      <ScrollArea className="text-opacity-20
      h-200 w-100 rounded-md border 
      absolute top-4 left-2 z-50 bg-white/85 shadow-lg
      ">
       <Treeview mapJSON={mapJSON}/>
      </ScrollArea>
      <div id="map-area">
        <Map  sourceJSON={sourceJSON} layerJSON={layerJSON} selectedPolygons={selectedPolygons} setSelectedPolygons={setSelectedPolygons}/>
      </div>
    </div>
  );
}

export default App;