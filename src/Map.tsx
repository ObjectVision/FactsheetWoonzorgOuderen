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
import {getDeckLayers, layerIsInDeckLayers, addDeckLayer, removeDeckLayer, updateDeckLayer} from "./layers/layers";

maplibregl.addProtocol('cog', cogProtocol);

interface ChildProps {
  latestChangedLayer:[boolean, TreeViewItem]|undefined;
  sourceJSON: JSON|undefined;
  layerJSON: JSON[]|undefined;
  selectedPolygons: GeoJSON.Feature[];
  setSelectedPolygons: React.Dispatch<React.SetStateAction<GeoJSON.Feature[]>>;
} // TODO redo GeoJSON.Feature

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
    const fetchData = async (tableUrl:URL) => {
      const data = await fetch(tableUrl);//"http://[2a01:7c8:bb01:6ce:5054:ff:fef7:57c0]/vector/cbs_wijken_limburg.arrow");
      const buffer = await data.arrayBuffer();
      const table = arrow.tableFromIPC(buffer);
      //const table2 = new arrow.Table(table.batches.slice(0, 10));
      addDeckLayer(deck, new GeoArrowPolygonLayer({
          id: "navigation-layer",
          beforeId: "foreground-anchor",
          stroked: true,
          filled: true,
          data: table!,
          getLineColor: [256, 256, 256, 255],
          getFillColor: [72, 191, 145, 100],
          getLineWidth: 5,
          getPointRadius: 4,
          getTextSize: 12,
          lineWidthMinPixels: 1,
          extruded: false,
          wireframe: false,
          onClick: ({ object }: any) => {
            if (!object) 
              return;
            const jsonFeature = toGeoJSONFeature(JSON.parse(JSON.stringify(object.toJSON())));
            setSelectedPolygons(prev => {
              if (!prev || prev.length===0)
                return [jsonFeature];
              const maxFeatures = 3;
              const index = prev.findIndex((f) => f!.properties!.WK_CODE === jsonFeature.properties!.WK_CODE);
              if (index !== -1)
                return prev.filter((_, i) => i !== index);
    
              const updated = [...prev, jsonFeature];
              return updated.slice(-maxFeatures);
            });

          },
          pickable: true,
          positionFormat: "XY",
          _normalize: false,
          autoHighlight: false,
          earcutWorkerUrl: new URL(
            "https://cdn.jsdelivr.net/npm/@geoarrow/geoarrow-js@0.3.0/dist/earcut-worker.min.js",
          ),
        }))
      return;
    };

    if (!layerDef)
      return;

    if (layerDef.type==="geoarrow-polygon") {
      if (layerIsInDeckLayers(deck, layerDef.id)) {
        removeDeckLayer(deck, layerDef.id);
      } else {
        fetchData(layerDef.url);
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
