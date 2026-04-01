import { useEffect, useState} from "react";
import "./App.css";
import Map from "./Map.tsx"
import FeatureCards from './FeatureCards';
import sources_json from "./data/sources.json?url";
import layers_json from "./data/layers.json?url";
import map_json from "./data/map.json?url";
import {ScrollArea} from "./components/ui/scroll-area.tsx"
import Treeview from "@/Treeview.tsx";
import Header from "./Header.tsx";
import KaartZoeker from "./KaartZoeker.tsx";

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
      <div id="details-area" className="absolute z-100rounded-md w-full border-1 border-[rgba(3,68,220,0.3)]">
        <Header/>
      </div>



      <div id="details-area">
        <FeatureCards selectedPolygons={selectedPolygons} setSelectedPolygons={setSelectedPolygons} />
      </div>

      <ScrollArea className="text-opacity-20
      h-200 w-75 rounded-md border-1 border-[rgba(3,68,220,0.3)]
      absolute top-2 z-50 bg-white/85 
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