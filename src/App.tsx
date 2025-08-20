import { useEffect, useState} from "react";
import "./App.css";
import Map from "./Map.tsx"
import FeatureCards from './FeatureCards';
import TitleBox from './Title.tsx'
import sources_json from "./data/sources.json?url";
import layers_json from "./data/layers.json?url";

function App() {
  const [selectedPolygons, setSelectedPolygons] = useState<GeoJSON.Feature[]>([]);
  const [sourceJSON, setsourceJSON] = useState<JSON[]>();
  const [layerJSON, setlayerJSON] = useState<JSON[]>();

  useEffect(() => {
    const fetchAppJsonFiles = async () => {
      fetch(sources_json).then((res) => { return res.json()}).then((res:any)=> {setsourceJSON(res)});
      fetch(layers_json).then((res) => { return res.json()}).then((res:any)=> {setlayerJSON(res)});
    };

    fetchAppJsonFiles();
  }, []);

  return (
    <div>
      <div id="details-area">
        <TitleBox/>
        <FeatureCards selectedPolygons={selectedPolygons} setSelectedPolygons={setSelectedPolygons} />
      </div>
      
      <div id="map-area">
        <Map  sourceJSON={sourceJSON} layerJSON={layerJSON} selectedPolygons={selectedPolygons} setSelectedPolygons={setSelectedPolygons}/>
      </div>
    </div>
  );
}

export default App;