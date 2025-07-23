import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { useEffect, useState } from "react";
import geodata from "/cbs_wijken_limburg.json?url";
interface MapProps {
  currentNeighborhood: string;
  setCurrentNeighborhood: (e: string) => void;
}

function Map({ currentNeighborhood, setCurrentNeighborhood }: MapProps) {
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    if (!mapReady) return;

    const map = new maplibregl.Map({
      container: "central-map",
      zoom: 8,
      hash: true,
      center: [5.879, 51.173],
    });

    map.on("load", () => {
      fetch("./assets/cbs_wijken_limburg.json")
      .then(response => JSON.parse(response))
      .then(data => console.log(data))

      map.addSource("limburg", {
        type: "geojson",
        data: geodata,
      });

      map.addLayer({
        id: "limburg",
        source: "limburg",
        type: "fill",
        paint: {
          "fill-color": "#eeff00",
        },
      });
    });

    map.on("click", (e) => {
      console.log(e);
      setCurrentNeighborhood("test wijk nr 2");
    });
  }, [mapReady]);

  return <div ref={() => setMapReady(true)} id="central-map" />;
}

export default Map;
