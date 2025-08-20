import { useEffect, useState, useRef, useCallback, type AnyActionArg } from "react";
//import bag_panden from "./assets/bag_pand_Limburg_uncompressed_3.arrow?url";
import wijken from "./assets/cbs_wijken_limburg.json?url";
import {MapboxOverlay} from '@deck.gl/mapbox';
import {GeoJsonLayer} from '@deck.gl/layers';
import { GeoArrowPolygonLayer } from "@geoarrow/deck.gl-layers";
import * as arrow from "apache-arrow";
import {RecordBatchReader, Table, tableFromIPC, tableFromArrays } from "apache-arrow";
import maplibregl, { DoubleClickZoomHandler } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import type {LayersList} from '@deck.gl/core';
import {Map as ReactMapGl, Source, Layer} from 'react-map-gl/maplibre';
import type {MapRef} from 'react-map-gl/maplibre';
import {cogProtocol} from '@geomatico/maplibre-cog-protocol';
//import { ArrowLoader } from '@loaders.gl/arrow';
import type {TreeViewItem} from './Treeview.tsx';
import {getDeckLayers, layerIsInDeckLayers, addDeckLayer, removeDeckLayer, updateDeckLayer, addGeoArrowPolygonDeckLayer, addCogMaplibreLayer, layerIsInMaplibreLayers, removeMaplibreLayer} from "./layers/layers";

maplibregl.addProtocol('cog', cogProtocol);

interface ChildProps {
  latestChangedLayer:[boolean, TreeViewItem]|undefined;
  sourceJSON: JSON[]|undefined;
  layerJSON: JSON[]|undefined;
  selectedPolygons: maplibregl.MapGeoJSONFeature[];
  setSelectedPolygons: React.Dispatch<React.SetStateAction<maplibregl.MapGeoJSONFeature[]>>;
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

function Map({latestChangedLayer, sourceJSON, layerJSON, selectedPolygons, setSelectedPolygons }: ChildProps) {
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

  // update selected polygon viewstate
  useEffect(() => {
    for (let i = 0; i<selectedPolygons.length; i++) {
      const polygon = selectedPolygons[i];
      map.current!.setFeatureState({id:polygon!.id, source: "wijk-navigation-source"}, {'state-level':i});
    }
    
  }, selectedPolygons);

  /*useEffect(() => {
    if (!latestChangedLayer)
      return;
    
    if (!sourceJSON)
      return;

    if (!layerJSON)
      return;

    const layerDef = getLayerOrSourceDef(latestChangedLayer[1]!.layer!, layerJSON);

    if (!layerDef)
      return;

    switch (layerDef.type) {
      case "geoarrow-polygon": { 
        if (layerIsInDeckLayers(deck, layerDef.id)) {
          removeDeckLayer(deck, layerDef.id);
        } else {
          addGeoArrowPolygonDeckLayer(deck, layerDef, setSelectedPolygons);
        }
        break; 
      } 
      case "cog": { 
        if (layerIsInMaplibreLayers(map, layerDef.id)) {
          removeMaplibreLayer(map, layerDef.id) 
        } else {
          const sourceDef = getLayerOrSourceDef(layerDef.props.source, sourceJSON);
          addCogMaplibreLayer(map, sourceDef, layerDef);
        }
        break; 
      } 
      default: { 
          // throw error or warning, unknown layer type
          break; 
      } 
    }
  }, [latestChangedLayer]);

  useEffect(() => {
    if (!mapReady)
      return;

  }, [mapReady]);*/

  /*useEffect(() => {
    updateDeckLayer(deck, "selection-layer", {data:selectedPolygons});
  }, [selectedPolygons]);*/

  const createSelectionLayer = useCallback(() => {
    return new GeoJsonLayer({
      id: 'selection-layer',
      beforeId: 'selection-anchor',
      data: {
        type: 'FeatureCollection',
        features: selectedPolygons,
      },
      filled: false,
      stroked: true,
      opacity: 1.0,
      getLineWidth: 42,
      lineWidthMinPixels: 1,
      getLineColor: [255, 0, 0, 255],
      pickable: false,
    });
  }, []);

  const onMapLoad = useCallback(() => {
    if (!map.current) return;
    
    let currentMap = map.current.getMap();
    currentMap.doubleClickZoom.disable();
    currentMap.dragRotate.disable();
    currentMap.touchPitch.disable();
    currentMap.boxZoom.disable();
    currentMap.setMaxPitch(0);

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
    
    currentMap.addSource("wijk-navigation-source", {
      type: 'geojson',
      data: wijken,
      generateId: true
    });

    currentMap.addLayer({
      id: 'wijk-navigation-layer',
      type: 'fill',
      source: 'wijk-navigation-source',
      paint: {//
        'fill-color': [ //  // 67, 72, 120, 1 // 44, 137, 127, 1
          'match',
          ['feature-state', 'state-level'],
           -1, 'rgba(237, 233, 157, 1)',
            0, 'rgba(226, 64, 0, 1)',
            1, 'rgba(67, 72, 120, 1)',
            2, 'rgba(44, 137, 127, 1)',
            'rgba(237, 233, 157, 1)' // default value if no match
        ],

        'fill-opacity': 0.5
      }
      
    });

    currentMap.on("click", "wijk-navigation-layer", (e)=>{
      console.log(e, e.features);

      const feature:maplibregl.MapGeoJSONFeature = e.features![0];
      setSelectedPolygons(prev => {
      if (!prev || prev.length===0) 
        return [feature];
      
      const maxFeatures = 3;
      let index = -1;
      for (let i=0; i<prev.length; i++) {
        const prevFeature = prev[i];
        if (prevFeature.properties.WK_CODE === feature.properties!.WK_CODE) {
          index = i;
          break;
        }
      }

      if (index !== -1) {
        map.current!.setFeatureState({id:prev[index].properties.id, source: "wijk-navigation-source"}, {'state-level':-1});
        return prev.filter((_, i) => i !== index);
      }

      const updated = [...prev, feature];
      if (updated.length>maxFeatures) // handle neutral coloring of feature about to become unselected
        map.current!.setFeatureState({id:updated.at(-1)!.id, source: "wijk-navigation-source"}, {'state-level':-1});

      return updated.slice(-maxFeatures);
      });      
    });

    deck.current = new MapboxOverlay({ 
      layers: [],
    });
    map.current.addControl(deck.current);

    //addDeckLayer(deck, createSelectionLayer());
    setMapReady(true);
 
  }, []);

  return (
      <div id ="central-map">
      <ReactMapGl
        ref={map}
        initialViewState={{
          longitude: 5.844702066665236,
          latitude: 50.91319982389477,
          zoom: 10
        }}
        mapStyle="https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json"
        onLoad={onMapLoad}
      >      

      </ReactMapGl>
      </div>

  );
}

export default Map;
