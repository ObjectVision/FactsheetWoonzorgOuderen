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