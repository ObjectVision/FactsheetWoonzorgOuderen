import { useEffect, useState, useRef, useCallback } from "react";
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
import type {DeckProps, LayersList} from '@deck.gl/core';
import {Map as ReactMapGl, useControl, Source, Layer} from 'react-map-gl/maplibre';
import type {MapRef} from 'react-map-gl/maplibre';
import {cogProtocol} from '@geomatico/maplibre-cog-protocol';
import { List } from "@mui/material";

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
  //const [deckLayers, setDeckLayers] = useState<LayersList>([]);
  const map = useRef<MapRef>(null);
  const deck = useRef<MapboxOverlay>(null);
  let deckLayers: LayersList = [];
  let showNavLayer:boolean= false;
  let showSelLayer:boolean= false;
  
  //let map: maplibregl.Map;
  //let deck: MapboxOverlay;
  
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
  }, [table]); // Add dependency array to prevent infinite re-renders

  /*useEffect(() => {
    if (!deck.current) 
      return;
    deck.current.setProps({
        layers: deckLayers
      });
  }, [deckLayers]);*/

  // Create navigation layer (base layer)
  const createNavigationLayer = useCallback(() => {
    return new GeoJsonLayer({
      id: 'navigation-layer',
      beforeId: 'deck-foreground-anchor',
      data: wijken,
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


  // Create selection layer (overlay layer)
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
      getLineColor: [255, 0, 0, 255], // Changed to red for better visibility
      pickable: false, // Prevent interference with navigation layer clicks
    });
  }, [selectedPolygons]);

  // Update deck layers when selectedPolygons changes
  /*useEffect(() => {
    if (overlayRef.current) {
      const navigationLayer = createNavigationLayer();
      const selectionLayer = createSelectionLayer();
      
      // Update the overlay with new layers
      overlayRef.current.setProps({
        layers: [navigationLayer, selectionLayer] // Order matters: navigation first, selection on top
      });
      
      setDeckLayers([navigationLayer, selectionLayer]);
    }
  }, [selectedPolygons, createNavigationLayer, createSelectionLayer]);*/

  const onMapLoad = useCallback(() => {
    if (!map.current) return;
    
    let currentMap = map.current.getMap();
    currentMap.doubleClickZoom.disable();
    currentMap.dragRotate.disable();
    currentMap.touchPitch.disable();
    currentMap.boxZoom.disable();
    currentMap.setMaxPitch(0);

    // Add anchor layers for deck.gl
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

    // Create initial layers
    //const navigationLayer = createNavigationLayer();
    //const selectionLayer = createSelectionLayer();

    // Create deck overlay
    
    deck.current = new MapboxOverlay({ 
      layers: [],
      // Optional: specify layer order more explicitly

    });
    
    map.current.addControl(deck.current);
    //overlayRef.current = deck;
    //setDeckLayers([]); //navigationLayer, selectionLayer
    setMapReady(true);

  }, []); // createNavigationLayer, createSelectionLayer

  // Function to dynamically add/remove layers
  const addLayer = useCallback((layer: any) => {
    if (deck.current) {
      let currentMap = map.current!.getMap();
      let layersOrder = currentMap.getLayersOrder();
      deck.current.setProps({
        layers: [...deckLayers, layer]
      });
      deckLayers = [...deckLayers, layer];
      //setDeckLayers([...deckLayers, layer]);
    }
  }, []);

  const removeLayer = useCallback((layerId: string) => {
    if (deck.current) {
      const filteredLayers = deckLayers.filter((layer: any) => layer.id !== layerId);
      deck.current.setProps({
        layers: filteredLayers
      });
      deckLayers = filteredLayers;
    }
  }, []);

  function toggleNavLayer(){
    if (showNavLayer) {
      removeLayer("navigation-layer");
      
    } else {
      addLayer(createNavigationLayer());
    }
    showNavLayer = !showNavLayer;
    return;
  };

  function toggleSelLayer(){
    if (showSelLayer) {
      removeLayer("selection-layer");
      
    } else {
      addLayer(createSelectionLayer());
    }
    showSelLayer = !showSelLayer;
    return;
  };




  // Function to update a specific layer
  const updateLayer = useCallback((layerId: string, newProps: any) => {
    if (deck.current) {
      const updatedLayers = deckLayers.map((layer: any) => 
        layer.id === layerId ? layer.clone(newProps) : layer
      );
      deckLayers = updatedLayers;
      deck.current.setProps({
        layers: updatedLayers
      });

      //setDeckLayers(updatedLayers);
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
        {/* You can add additional controls or components here */}
      </ReactMapGl>
      </div>

  );
}

export default Map;
