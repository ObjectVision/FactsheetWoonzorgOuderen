import { useEffect, useState } from "react";
import wijken from "./assets/cbs_wijken_limburg.json?url";
//import wijken from "/cbs_wijken_limburg.fgb?url";
import {DeckGL} from '@deck.gl/react';
import {MapView, Deck, OrthographicView} from '@deck.gl/core';
import {BitmapLayer, GeoJsonLayer} from '@deck.gl/layers';
import {TileLayer} from '@deck.gl/geo-layers';
//import { } from '@loaders.gl/flatgeobuf';
//import {FlatGeoBufLoader} from '@loaders.gl/flatgeobuf';

const INITIAL_VIEW_STATE:any = {
  longitude: 5.606440797330272,
  zoom: 7,
  latitude: 52.062958234585004,
  pitch: 0,
  bearing: 0
};

function Map() {

  const layers = [
          new TileLayer<ImageBitmap>({
            data: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
            maxRequests: 20,
            pickable: true,
            autoHighlight: false,
            highlightColor: [60, 60, 60, 40],
            minZoom: 0,
            maxZoom: 19,
            tileSize: 256,
            zoomOffset: -0.9,
            renderSubLayers: props => {
              const [[west, south], [east, north]] = props.tile.boundingBox;
              const {data, ...otherProps} = props;

              return [
                new BitmapLayer(otherProps, {
                  image: data,
                  bounds: [west, south, east, north]
                })
              ];
            }
          }),
          new GeoJsonLayer({
            id: 'GeoJsonLayer', 
            data: wijken,
            opacity: 1.0,
            stroked: true,
            filled: true,
            getLineColor: [256, 256, 256, 100],
            getFillColor: [72, 191, 145, 256],
            getLineWidth: 20,
            getPointRadius: 4,
            getTextSize: 12
        })
        ];

  return <DeckGL
      initialViewState={INITIAL_VIEW_STATE}
      controller
      layers={layers} />;
}

export default Map;
