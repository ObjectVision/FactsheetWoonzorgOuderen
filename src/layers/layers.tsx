import * as arrow from "apache-arrow";
import { GeoArrowPolygonLayer } from "@geoarrow/deck.gl-layers";
import { toGeoJSONFeature } from "../Map"
import type {LayersList} from '@deck.gl/core';

export function layerIsInDeckLayers(deck: React.RefObject<any>, layerId:string) : boolean {
  let layers = getDeckLayers(deck).filter((layer: any) => layer.id === layerId);
  return layers.length !== 0;
}

export function getDeckLayers(deck: React.RefObject<any>): LayersList {
  if (!deck.current) return [];
  const deckLayers = (deck.current as any)._props.layers;
  return deckLayers;
}

export function addDeckLayer(deck: React.RefObject<any>, layer: any) {
  if (!deck.current) return;

  deck.current.setProps({
    layers: [layer, ...getDeckLayers(deck)],
  });
}

export function removeDeckLayer(deck: React.RefObject<any>, layerId: string) {
  if (!deck.current) return;
  const filteredLayers = getDeckLayers(deck).filter((layer: any) => layer.id !== layerId);
      deck.current.setProps({
        layers: filteredLayers
      });
}

export function updateDeckLayer(deck: React.RefObject<any>, layerId: string, newProps: any) {
  if (!deck.current) return;

  const updatedLayers = getDeckLayers(deck).map((layer: any) => 
    layer.id === layerId ? layer.clone(newProps) : layer
  );
  deck.current.setProps({
    layers: updatedLayers
  });
}

export async function addGeoArrowPolygonDeckLayer(deck: React.RefObject<any>, layerDef:any, setSelectedPolygons: React.Dispatch<React.SetStateAction<GeoJSON.Feature[]>>) {
      const data = await fetch(layerDef.url);
      const buffer = await data.arrayBuffer();
      const table = arrow.tableFromIPC(buffer);
      addDeckLayer(deck, new GeoArrowPolygonLayer({
          ...layerDef.props,
          id: layerDef.id,
          data: table!,
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
          earcutWorkerUrl: new URL(
            "https://cdn.jsdelivr.net/npm/@geoarrow/geoarrow-js@0.3.0/dist/earcut-worker.min.js",
          ),
        }))
      return;
}

export function addMaplibreSource(map: React.RefObject<any>, sourceDef:any) {
  if (!map.current) return;
  map.current.getMap().addSource(sourceDef.id, {
    ...sourceDef
  });
}

export function removeMaplibreSource(map: React.RefObject<any>, sourceId:string) {
  if (!map.current) return;
}

export function addMaplibreLayer(map: React.RefObject<any>, layerDef:any) {
  if (!map.current) return;
  map.current.getMap().addLayer({
    id: layerDef.id,
    ...layerDef.props
  });
}

export function removeMaplibreLayer(map: React.RefObject<any>, layerId:string) {
  if (!map.current) return;
}

export function sourceIsInMaplibreSources(map: React.RefObject<any>, sourceId:string) : boolean {
  //let layers = getDeckLayers(deck).filter((layer: any) => layer.id === layerId);
  //return layers.length !== 0;
  return false;
}

export function layerIsInMaplibreLayers(map: React.RefObject<any>, layerId:string) : boolean {
  //let layers = getDeckLayers(deck).filter((layer: any) => layer.id === layerId);
  //return layers.length !== 0;
  return false;
}

export async function addCogMaplibreLayer(map: React.RefObject<any>, sourceDef:any, layerDef:any) {
  if (!map.current) return;

  const sourceId = sourceDef.id;
  const layerId = layerDef.id;
  if (!sourceIsInMaplibreSources(map, sourceId))
    addMaplibreSource(map, sourceDef);

  if (!layerIsInMaplibreLayers(map, layerId))
    addMaplibreLayer(map, layerDef);

  return;
}