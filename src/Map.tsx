import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { useEffect, useRef, useState } from "react";

interface MapProps {
    currentNeighborhood: string;
    setCurrentNeighborhood: (e:string) => string
}

function Map({ currentNeighborhood, setCurrentNeighborhood }:MapProps) {
  
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

    map.on('click', (e) => {
        console.log(e)
        setCurrentNeighborhood("test wijk nr 2")
    })
  }, [mapReady]);

  

  return <div ref={() => setMapReady(true)} id="central-map" />;
}

export default Map;
