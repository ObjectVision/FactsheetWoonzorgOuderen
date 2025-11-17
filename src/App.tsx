import { useEffect, useState} from "react";
import "./App.css";
import Map from "./Map.tsx"
import FeatureCards from './FeatureCards';
import TitleBox from './Title.tsx'
import { AppSidebar } from './components/app-sidebar.tsx'
import sources_json from "./data/sources.json?url";
import layers_json from "./data/layers.json?url";
import { SidebarProvider } from "@/components/ui/sidebar"
import Page from "./dashboard.tsx" 
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

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
        <FeatureCards selectedPolygons={selectedPolygons} setSelectedPolygons={setSelectedPolygons} />
      </div>

      <Page sourceJSON={sourceJSON} layerJSON={layerJSON} selectedPolygons={selectedPolygons} setSelectedPolygons={setSelectedPolygons}/>
    </div>
  );
}

export default App;