import { useEffect, useState } from "react";
import wijken from "./assets/cbs_wijken_limburg.json?url";
import bag_panden from "./assets/bag_pand_Limburg_uncompressed_3.arrow?url";
//import bag_panden from "./assets/bag_pand_NL_uncompressed.arrow?url";
import loopafstand from "./assets/grid/loopafstand_huisarts_cog.tif?url";
//import loopafstand from "./assets/grid/loopafstand_huisarts_cog_gdal.tif?url";

//import test_cog from "./assets/grid/GHS_POP_E2015_COGeoN.tif?url";

//import {DeckGL} from '@deck.gl/react';
import {MapboxOverlay} from '@deck.gl/mapbox';
import type {PickingInfo} from '@deck.gl/core';
import {BitmapLayer, GeoJsonLayer} from '@deck.gl/layers';
import {TileLayer} from '@deck.gl/geo-layers';
import { GeoArrowPolygonLayer } from "@geoarrow/deck.gl-layers";
import * as arrow from "apache-arrow";
//import CogBitmapLayer from '@gisatcz/deckgl-geolib/src/cogbitmaplayer/CogBitmapLayer';
//import { GeoTIFFLoader } from '@loaders.gl/geotiff';
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import type {DeckProps} from '@deck.gl/core';
import {Map as ReactMap, useControl, Source, Layer} from 'react-map-gl/maplibre';
import type {MapRef} from 'react-map-gl/maplibre';
import {cogProtocol} from '@geomatico/maplibre-cog-protocol';

function DeckGLOverlay(props: DeckProps) {
  const overlay = useControl<MapboxOverlay>(() => new MapboxOverlay(props));
  overlay.setProps(props);
  return null;
}
maplibregl.addProtocol('cog', cogProtocol);

interface ChildProps {
  selectedPolygons: GeoJSON.Feature[];
  setSelectedPolygons: React.Dispatch<React.SetStateAction<GeoJSON.Feature[]>>;
}

function Map({ selectedPolygons, setSelectedPolygons }: ChildProps) {
  const [table, setTable] = useState<arrow.Table | null>(null);
  const [mapReady, setMapReady] = useState(false);
  
  

  let map:maplibregl.Map;
  //let deck: MapboxOverlay;
  const loopafstand_cog_url = `cog://${loopafstand}`;
  
  useEffect(() => {
    const fetchData = async () => {
      const data = await fetch(bag_panden);
      const buffer = await data.arrayBuffer();
      const table = arrow.tableFromIPC(buffer);
      setTable(table);
    };

    if (!table) {
      fetchData().catch(console.error);
    }
  });
  
  
const navigation_layer = new GeoJsonLayer({
    id: 'navigation-layer', 
    data: wijken,
    opacity: 1.0,
    stroked: true,
    filled: true,
    onClick: ({object}: any) => {
    if (!object) return;

    setSelectedPolygons(prev => {
        const maxFeatures = 3;
        const index = prev.findIndex((f) => f.properties!.WK_CODE === object.properties.WK_CODE);
        if (index!==-1)
        return prev.filter((_, i) => i !== index);

        const updated = [...prev, object];
        return updated.slice(-maxFeatures);
    });
    },
    parameters: {
    depthTest: false,
    depthRange: [0, 1]
    },
    
    getLineColor: [256, 256, 256, 100],
    getFillColor: [72, 191, 145, 100],
    getLineWidth: 5,
    getPointRadius: 4,
    getTextSize: 12,
    lineWidthMinPixels: 1,
    pickable: true,
})
  


const arrow_layer =  new GeoArrowPolygonLayer({
    id: "geoarrow-polygons",
    stroked: false,
    filled: true,
    data: table!,
    getFillColor: [255, 0, 0, 255],
    getLineColor: [0, 0, 0],
    lineWidthMinPixels: 0.001,
    extruded: false,
    wireframe: false,
    // getElevation: 0,
    pickable: false,
    positionFormat: "XY",
    _normalize: false,
    autoHighlight: false,
    // Note: change this version string if needed
    earcutWorkerUrl: new URL(
        "https://cdn.jsdelivr.net/npm/@geoarrow/geoarrow-js@0.3.0/dist/earcut-worker.min.js",
    ),
});
  /*useEffect(() => {
    if (!mapReady) return;

    map = new maplibregl.Map({
      container: "central-map",
      //style: 'https://demotiles.maplibre.org/style.json', // Open source tiles
      style: {
        version: 8,
        sources: {},
        layers: [],
      },
      hash: true,
      center: [5.836128219877641, 51.02386112443766],
      zoom: 10
    });

    map.setMaxPitch(0);
    map.touchPitch.disable();

    map.on("load", () => {


      deck = new MapboxOverlay({
        interleaved: true,
        layers: [
          background_layer,
          navigation_layer
          //selection_layer
        ],
        parameters: {
          depthWriteEnabled: false
        }
        
      });

      map!.addControl(deck);

    });

    map.on("click", (e) => {
      console.log(e);
    });
  });*/

  /*useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(bag_panden);
      const buffer = await res.arrayBuffer();
      const reader = await RecordBatchReader.from(buffer);
      const table = await reader.readAll(); // reads all batches
      setTable(table);
    };

    if (!table) {
      fetchData().catch(console.error);
    }
  }, [bag_panden, table]);*/








  const selection_layer = new GeoJsonLayer({
    id: 'selection-layer',
    data: {
    type: 'FeatureCollection',
    features: selectedPolygons,
    },
    filled: false,
    stroked: true,
    getLineWidth: 42,
    lineWidthMinPixels: 1,
    getLineColor: [200, 0, 0, 200],
  });


  let layers = [
          //background_layer,
          navigation_layer,
          selection_layer,
          //arrow_layer
        ];


  //return <div ref={() => setMapReady(true)} id="central-map" />;



    return (<ReactMap
      initialViewState={{
        longitude: 5.844702066665236,
        latitude: 50.91319982389477,
        zoom: 10
      }}
      
      mapStyle="https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json"//"https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
    >
      
      <DeckGLOverlay layers={layers} />
    </ReactMap>);

  /*return <DeckGL
      initialViewState={INITIAL_VIEW_STATE}
      controller
      layers={layers}
      getCursor={({ isDragging }) =>
        isDragging ? 'grabbing' : isHovering ? 'pointer' : 'default'
      }
      getTooltip={getTooltip} />;*/
}

export default Map;
