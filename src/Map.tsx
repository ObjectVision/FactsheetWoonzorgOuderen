import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { useEffect, useRef, useState } from "react";

function Map({ currentNeighborhood, setCurrentNeighborhood }) {
  
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    if (!mapReady) return;

    const map = new maplibregl.Map({
      container: 'central-map',
      style: "https://demotiles.maplibre.org/style.json",
      zoom: 8,
      hash: true,
      center: [5.879,51.173]
   
    });

    console.log("test")
    map.on('click', (e) => {
        console.log(e)
        setCurrentNeighborhood("test wijk nr 2")
    })
  }, [mapReady]);

  

  return <div ref={() => setMapReady(true)} id="central-map" />;
}

export default Map;
