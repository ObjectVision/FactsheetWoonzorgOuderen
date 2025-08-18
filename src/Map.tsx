import { useEffect, useState, useRef, useCallback, type AnyActionArg } from "react";
//import bag_panden from "./assets/bag_pand_Limburg_uncompressed_3.arrow?url";
//import bag_panden from "./assets/bag_pand_NL_uncompressed.arrow?url";
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
import {getDeckLayers, layerIsInDeckLayers, addDeckLayer, removeDeckLayer, updateDeckLayer, addGeoArrowPolygonDeckLayer} from "./layers/layers";

maplibregl.addProtocol('cog', cogProtocol);

interface ChildProps {
  latestChangedLayer:[boolean, TreeViewItem]|undefined;
  sourceJSON: JSON|undefined;
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

function Map({latestChangedLayer, sourceJSON, layerJSON, selectedPolygons, setSelectedPolygons }: ChildProps) {
  //const [table, setTable] = useState<Table>();
  const [mapReady, setMapReady] = useState(false);
  const [tableUrl, setTableUrl] = useState<URL>();
  const map = useRef<MapRef>(null);
  const deck = useRef<MapboxOverlay>(null);

  function getLayerDef(layerId:string) {
    for (var layer of layerJSON!) {
      if (layer.id == layerId) {
        return layer;
      }
    }
  }

  useEffect(() => {
    if (!latestChangedLayer)
      return;
    
    if (!sourceJSON)
      return;

    if (!layerJSON)
      return;

    const layerDef = getLayerDef(latestChangedLayer[1]!.layer!);

    if (!layerDef)
      return;

    if (layerDef.type==="geoarrow-polygon") {
      if (layerIsInDeckLayers(deck, layerDef.id)) {
        removeDeckLayer(deck, layerDef.id);
      } else {
        addGeoArrowPolygonDeckLayer(deck, layerDef, setSelectedPolygons); //fetchData(layerDef.url);
      }
    }

    let i = 0;

  }, [latestChangedLayer]);

  useEffect(() => {
    if (!mapReady)
      return;

  }, [mapReady]);

  useEffect(() => {
    updateDeckLayer(deck, "selection-layer", {data:selectedPolygons});
  }, [selectedPolygons]);

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
    
    deck.current = new MapboxOverlay({ 
      layers: [],
    });
    map.current.addControl(deck.current);

    addDeckLayer(deck, createSelectionLayer());
    setMapReady(true);

  }, []);

/*
        <Source
          id="cogSource"
          type="raster"
          url="cog://http://[2a01:7c8:bb01:6ce:5054:ff:fef7:57c0]/raster/loopafstand_huisarts_cog.tif"
        ></Source>

        <Layer
          id="cogLayer"
          source= "cogSource"
          type="raster"
        />
*/
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
