import { useEffect, useState} from "react";
import "./App.css";
import Map from "./Map.tsx"
import FeatureCards from './FeatureCards';
import TitleBox from './Title.tsx'
import RegionToggleButtons from './RegionToggleButtons.tsx'
import sources_json from "./data/sources.json?url";
import layers_json from "./data/layers.json?url";
import { BrowserRouter as Router, Routes, Route } from 'react-router';

function App() {
  const [selectedPolygons, setSelectedPolygons] = useState<GeoJSON.Feature[]>([]);
  const [activeRegions, setActiveRegions] = useState("Gemeenten");
  const [sourceJSON, setsourceJSON] = useState<JSON[]>();
  const [layerJSON, setlayerJSON] = useState<JSON[]>();

  useEffect(() => {
    const fetchAppJsonFiles = async () => {
      fetch(sources_json).then((res) => { return res.json()}).then((res:any)=> {setsourceJSON(res)});
      fetch(layers_json).then((res) => { return res.json()}).then((res:any)=> {setlayerJSON(res)});
    };

    fetchAppJsonFiles();
  }, []);

  const MapEmbed = () => (
    <div style={{ width: "100%", height: "100vh", margin: 0, padding: 0 }}>
      <Map  sourceJSON={sourceJSON} layerJSON={layerJSON} selectedPolygons={selectedPolygons} setSelectedPolygons={setSelectedPolygons} activeRegions={activeRegions}/>
    </div>
  );
  
  return (
    <Router>
      <Routes>
        <Route path = "/" element={
          <div>
            <div id="details-area">
              
              <FeatureCards selectedPolygons={selectedPolygons} setSelectedPolygons={setSelectedPolygons} />
            </div>
            
            <div id="details-area">
              <RegionToggleButtons activeRegions={activeRegions} setActiveRegions={setActiveRegions}/>
            </div>

            <div id="map-area">

              <Map  sourceJSON={sourceJSON} layerJSON={layerJSON} selectedPolygons={selectedPolygons} setSelectedPolygons={setSelectedPolygons} activeRegions={activeRegions}/>
            </div>
          </div>}>
        </Route>
        
        <Route path="/embed/map" element={<MapEmbed />} />

    </Routes>
    </Router>
  );
}

export default App;