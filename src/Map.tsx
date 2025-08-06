import { useEffect, useState, useRef, useCallback } from "react";
import bag_panden from "./assets/bag_pand_Limburg_uncompressed_3.arrow?url";
//import bag_panden from "./assets/bag_pand_NL_uncompressed.arrow?url";
import {MapboxOverlay} from '@deck.gl/mapbox';
import {GeoJsonLayer} from '@deck.gl/layers';
import { GeoArrowPolygonLayer } from "@geoarrow/deck.gl-layers";
import * as arrow from "apache-arrow";
import {RecordBatchReader, Table, tableFromIPC, tableFromArrays } from "apache-arrow";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import type {LayersList} from '@deck.gl/core';
import {Map as ReactMapGl, Source, Layer} from 'react-map-gl/maplibre';
import type {MapRef} from 'react-map-gl/maplibre';
import {cogProtocol} from '@geomatico/maplibre-cog-protocol';
import { ArrowLoader } from '@loaders.gl/arrow';

maplibregl.addProtocol('cog', cogProtocol);

interface ChildProps {
  selectedPolygons: GeoJSON.Feature[];
  setSelectedPolygons: React.Dispatch<React.SetStateAction<GeoJSON.Feature[]>>;
}

function Map({ selectedPolygons, setSelectedPolygons }: ChildProps) {
  
  //const [table, setTable] = useState<Table>();
  const [mapReady, setMapReady] = useState(false);
  const [tableUrl, setTableUrl] = useState<URL>();
  const map = useRef<MapRef>(null);
  const deck = useRef<MapboxOverlay>(null);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetch(tableUrl!);
      const buffer = await data.arrayBuffer();
      const table = arrow.tableFromIPC(buffer);
      const table2 = new arrow.Table(table.batches.slice(0, 10));
      addLayer(new GeoArrowPolygonLayer({
        id: "navigation-layer",
        stroked: false,
        filled: true,
        data : table2,
        getFillColor: [255, 0, 0, 255],
        getLineColor: [0, 0, 0],
        lineWidthMinPixels: 0.001,
        extruded: false,
        wireframe: false,
        pickable: false,
        positionFormat: "XY",
        _normalize: false,
        autoHighlight: false,
        earcutWorkerUrl: new URL(
          "https://cdn.jsdelivr.net/npm/@geoarrow/geoarrow-js@0.3.0/dist/earcut-worker.min.js",
      )}));
    };
    fetchData().catch(console.error);
  }, [tableUrl]);

    /*useEffect(() => {
      // declare the data fetching function
      const fetchData = async () => {
        const data = await fetch("http://[2a01:7c8:bb01:6ce:5054:ff:fef7:57c0]/vector/cbs_wijken_limburg.arrow");
        const buffer = await data.arrayBuffer();
        const table = arrow.tableFromIPC(buffer);
        const table2 = new arrow.Table(table.batches.slice(0, 10));
        //window.table = table2;
        setTable(table2);
    };

    if (!table) {
      fetchData().catch(console.error);
    }
  }, [table]);*/

  useEffect(() => {
    updateLayer("selection-layer", {data:selectedPolygons});
  }, [selectedPolygons]);

  /*const arrow_layer =  new GeoArrowPolygonLayer({
      id: "navigation-layer",
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
    });*/

  /*const createGeoArrowNavigationLayer = useCallback( async() => {
    const arrow_layer =  new GeoArrowPolygonLayer({
      id: "navigation-layer",
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
    return arrow_layer;
  }, [table]);*/

  /*const createNavigationLayer = useCallback( async() => {
    return new GeoArrowPolygonLayer({
      id: 'navigation-layer',
      beforeId: 'deck-foreground-anchor',
      data: table!,
      opacity: 1.0,
      _normalize: false,
      autoHighlight: false,
      earcutWorkerUrl: new URL(
        "https://cdn.jsdelivr.net/npm/@geoarrow/geoarrow-js@0.3.0/dist/earcut-worker.min.js",
      ),
      stroked: true,
      filled: true,
      onClick: ({ object }: any) => {
        if (!object) return;

        setSelectedPolygons(prev => {
          const maxFeatures = 3;
          const index = prev.findIndex((f) => f.properties!.WK_CODE === object.properties.WK_CODE);
          if (index !== -1)
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
    });
  }, [setSelectedPolygons]);*/

  const createNavigationLayer = useCallback(() => {
    return new GeoJsonLayer({
      id: 'navigation-layer',
      beforeId: 'deck-foreground-anchor',
      data: 'http://[2a01:7c8:bb01:6ce:5054:ff:fef7:57c0]/vector/cbs_wijken_limburg.json',
      opacity: 1.0,
      stroked: true,
      filled: true,
      onClick: ({ object }: any) => {
        if (!object) return;

        setSelectedPolygons(prev => {
          const maxFeatures = 3;
          const index = prev.findIndex((f) => f.properties!.WK_CODE === object.properties.WK_CODE);
          if (index !== -1)
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
    });
  }, [setSelectedPolygons]);

  const createSelectionLayer = useCallback(() => {
    return new GeoJsonLayer({
      id: 'selection-layer',
      beforeId: 'deck-foreground-anchor',
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
  }, [selectedPolygons]);

  const onMapLoad = useCallback(() => {
    if (!map.current) return;
    
    let currentMap = map.current.getMap();
    currentMap.doubleClickZoom.disable();
    currentMap.dragRotate.disable();
    currentMap.touchPitch.disable();
    currentMap.boxZoom.disable();
    currentMap.setMaxPitch(0);

    currentMap.addLayer({
      id: 'deck-background-anchor',
      type: 'background',
      layout: { visibility: 'none' }
    });
    currentMap.addLayer({
      id: 'deck-foreground-anchor',
      type: 'background',
      layout: { visibility: 'none' }
    });
    
    deck.current = new MapboxOverlay({ 
      layers: [],
    });
    
    map.current.addControl(deck.current);
    setMapReady(true);

  }, []);

  function getDeckLayers(): LayersList {
    if (!deck.current)
      return [];
    const deckLayers = (deck.current as any)._props.layers;
    return deckLayers;
  }

  function layerIsInDeckLayers(layerId:string) : boolean {
    let layers = getDeckLayers().filter((layer: any) => layer.id === layerId);
    return layers.length !== 0;
  }

  const addLayer = useCallback((layer: any) => {
    if (deck.current) {     
      deck.current.setProps({
        layers: [...getDeckLayers(), layer]
      });
    }
  }, []);

  const removeLayer = useCallback((layerId: string) => {
    if (deck.current) {
      const filteredLayers = getDeckLayers().filter((layer: any) => layer.id !== layerId);
      deck.current.setProps({
        layers: filteredLayers
      });
    }
  }, []);

  function toggleNavLayer(){
    if (layerIsInDeckLayers("navigation-layer")) {
      removeLayer("navigation-layer");
    } else {
      const url: URL = new URL("http://[2a01:7c8:bb01:6ce:5054:ff:fef7:57c0]/vector/cbs_wijken_limburg.arrow"); 
      setTableUrl(url);
    }
      
    return;
  };

  function toggleSelLayer(){
    if (layerIsInDeckLayers("selection-layer")) {
      removeLayer("selection-layer");
    } else {
      addLayer(createSelectionLayer());
    }
    return;
  };

  const updateLayer = useCallback((layerId: string, newProps: any) => {
    if (deck.current) {
      const updatedLayers = getDeckLayers().map((layer: any) => 
        layer.id === layerId ? layer.clone(newProps) : layer
      );
      deck.current.setProps({
        layers: updatedLayers
      });
    }
  }, []);

  return (
      <div id ="central-map">
        <button onClick={toggleNavLayer}>toggle nav layer</button>
        <button onClick={toggleSelLayer}>toggle sel layer</button>
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
      </ReactMapGl>
      </div>

  );
}

export default Map;
