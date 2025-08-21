import { useEffect, useState, useRef, useCallback, type AnyActionArg } from "react";

//import wijken from "./data/cbs_wijken_limburg.json?url";
import {MapboxOverlay} from '@deck.gl/mapbox';
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { NavigationControl, Map as ReactMapGl} from 'react-map-gl/maplibre';
import type {MapRef} from 'react-map-gl/maplibre';
import {cogProtocol} from '@geomatico/maplibre-cog-protocol';
import background_style from "./data/style.json?url";

//import MapControlButtons from "./assets/Controls";
import {addGeoArrowPolygonDeckLayer, addGeoJsonSelectionDeckLayer, updateDeckLayer} from "./layers/layers";

maplibregl.addProtocol('cog', cogProtocol);

interface ChildProps {
  sourceJSON: JSON[]|undefined;
  layerJSON: JSON[]|undefined;
  selectedPolygons: GeoJSON.Feature[];
  setSelectedPolygons: React.Dispatch<React.SetStateAction<GeoJSON.Feature[]>>;
}

type CustomPolygon = {
  naam: string;
  WK_CODE: string;
  geometry: {
    x: number;
    y: number;
  }[][][]; // matches [[[ {x,y}, ... ]]]
};

export function toGeoJSONFeature(input: CustomPolygon): GeoJSON.Feature<GeoJSON.Polygon> {
  // Convert from {x,y} to [x,y] pairs
  const coordinates = input.geometry.map((multiRing) =>
    multiRing.map((ring) =>
      ring.map((point) => [point.x, point.y] as [number, number])
    )
  );

  // Build a GeoJSON Feature
  return {
    type: "Feature",
    geometry: {
      type: "Polygon",
      coordinates: coordinates[0] // take first polygon shell (no MultiPolygon in your example)
    },
    properties: {
      naam: input.naam,
      WK_CODE: input.WK_CODE
    }
  };
}

function Map({ sourceJSON, layerJSON, selectedPolygons, setSelectedPolygons }: ChildProps) {
  //const [table, setTable] = useState<Table>();
  const [mapReady, setMapReady] = useState(false);
  const [tableUrl, setTableUrl] = useState<URL>();
  const map = useRef<MapRef>(null);
  const deck = useRef<MapboxOverlay>(null);

  function getLayerOrSourceDef(layerId:string, layerOrSourceJSON:JSON[]) {
    for (var layer of layerOrSourceJSON!) {
      if (layer.id == layerId) {
        return layer;
      }
    }
  }

  useEffect(() => {
    updateDeckLayer(deck, "selection-layer", {data:selectedPolygons});
  }, [selectedPolygons]);

  // update selected polygon viewstate
  /*useEffect(() => {
    for (let i = 0; i<selectedPolygons.length; i++) {
      const polygon = selectedPolygons[i];
      map.current!.setFeatureState({id:polygon!.id, source: "wijk-navigation-source"}, {'state-level':i});
    }
    
  }, selectedPolygons);*/

  const onMapLoad = useCallback(() => {
    if (!map.current) return;

    let currentMap = map.current.getMap();
    currentMap.doubleClickZoom.disable();
    currentMap.dragRotate.disable();
    currentMap.touchPitch.disable();
    currentMap.boxZoom.disable();
    currentMap.setMaxPitch(0);

    currentMap.setMaxBounds([
        [4.5, 50.5],
        [7.5, 52]
      ]);

    currentMap.addControl(new maplibregl.NavigationControl({showCompass:false}), 'top-right')
    //currentMap.addControl(new MapControlButtons(currentMap), "top-right");

    currentMap.addLayer({
      id: 'background-anchor',
      type: 'background',
      layout: { visibility: 'none' }
    });
    currentMap.addLayer({
      id: 'foreground-anchor',
      type: 'background',
      layout: { visibility: 'none' }
    });
    currentMap.addLayer({
      id: 'selection-anchor',
      type: 'background',
      layout: { visibility: 'none' }
    });

    deck.current = new MapboxOverlay({ 
      layers: [],
      onHover: ({object}) => {
        const canvas = currentMap.getCanvas();
        if (object) {
          canvas.style.cursor = 'pointer'; // hovering over layer
        } else {
          canvas.style.cursor = '';        // reset (MapLibre will handle default/grab)
        }
      },
      onDrag: () => { currentMap.getCanvas().style.cursor = 'grabbing'; },
      onDragEnd: () => { currentMap.getCanvas().style.cursor = ''; }
    });
    map.current.addControl(deck.current);

    const selectionLayerDef = {
        "id": "selection-layer",
        "type": "geojson-deckgl",
        "props": {
            "beforeId": "selection-anchor",
            "filled": false,
            "stroked": true,
            "opacity": 1.0,
            "lineCapRounded":true,
            "lineJointRounded":true,
            "getLineWidth": 42,
            "lineWidthMinPixels": 3,
            //"getLineColor": [255, 0, 0, 255],
            "pickable": false
        }
    };

    addGeoJsonSelectionDeckLayer(deck, selectionLayerDef, selectedPolygons);
    const navigationLayerDef = {
        "id": "arrow-layer",
        "type": "geoarrow-polygon",
        "url": "https://factsheetwoonzorgouderen.online/vector/cbs_wijken_limburg.arrow",
        "props":{
            "beforeId": "foreground-anchor",
            "stroked": true,
            "filled": true,
            "getLineColor": [70, 70, 70, 255],
            "getFillColor": [72, 191, 145, 0],
            "getLineWidth": 5,
            "getPointRadius": 4,
            "lineCapRounded":true,
            "lineJointRounded":true,
            "getTextSize": 12,
            "lineWidthMinPixels": 1,
            "extruded": false,
            "wireframe": false,
            "pickable": true,
            "positionFormat": "XY",
            "_normalize": false,
            "autoHighlight": true,
            "highlightColor": [66, 165, 245, 50]
        }
    };


    addGeoArrowPolygonDeckLayer(deck, navigationLayerDef, setSelectedPolygons);
    //addDeckLayer(deck, createSelectionLayer());
    setMapReady(true);
 
  }, []);

  return (
      <div id ="central-map">
      <ReactMapGl
        ref={map}
        initialViewState={{
          longitude: 5.0844702066665236,
          latitude: 52.5,
          zoom: 5
        }}
        //mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
        //mapStyle="https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json"
        mapStyle={background_style}//"https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json"
        onLoad={onMapLoad}
      >      

      </ReactMapGl>
      </div>

  );
}

export default Map;
