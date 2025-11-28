import { useEffect, useState} from "react";
import "./App.css";
import Map from "./Map.tsx"
import FeatureCards from './FeatureCards';
import sources_json from "./data/sources.json?url";
import layers_json from "./data/layers.json?url";
import DataHeader from "./components/header.tsx"
import {ScrollArea} from "./components/ui/scroll-area.tsx"
import { Separator } from "@/components/ui/separator"
import { FoodTree } from "@/Treeview.tsx";

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

const treeData: any[] = [
  
  {
    id: "group-1",
    label: "Section A",
    children: [
      {
        id: "leaf-1",
        label: "Item A1",
        meta: {
          type: "Feature",
          createdBy: "System",
          status: "Active",
        },
      },
      {
        id: "leaf-2",
        label: "Item A2",
        meta: {
          type: "Layer",
          records: 1234,
        },
      },
    ],
  },
  {
    id: "group-2",
    label: "Section B",
    children: [
      {
        id: "leaf-3",
        label: "Item B1",
        meta: {
          description: "Example with more metadata fields",
          version: "1.0.3",
        },
      },
    ],
  },
];
  return (
    <div>
      <div id="details-area">
        <FeatureCards selectedPolygons={selectedPolygons} setSelectedPolygons={setSelectedPolygons} />
      </div>

      <ScrollArea className="text-opacity-20
      h-200 w-100 rounded-md border 
      absolute top-4 left-2 z-50 bg-white/85 shadow-lg
      ">
       <FoodTree />
      </ScrollArea>
      <div id="map-area">
        <Map  sourceJSON={sourceJSON} layerJSON={layerJSON} selectedPolygons={selectedPolygons} setSelectedPolygons={setSelectedPolygons}/>
      </div>
    </div>
  );
}

export default App;