import { useEffect, useState } from "react";
import wijken from "./assets/cbs_wijken_limburg.json?url";
//import wijken from "/cbs_wijken_limburg.fgb?url";
import {DeckGL} from '@deck.gl/react';
import type {PickingInfo} from '@deck.gl/core';
import {BitmapLayer, GeoJsonLayer} from '@deck.gl/layers';
import {TileLayer} from '@deck.gl/geo-layers';
//import {FlatGeoBufLoader} from '@loaders.gl';


const INITIAL_VIEW_STATE:any = {
  longitude: 5.844702066665236,
  zoom: 10,
  latitude: 50.91319982389477,
  pitch: 0,
  bearing: 0
};

function getTooltip({object}: PickingInfo) {
  if (object == undefined)
    return null;
  
  return object && {
    html: `<div>${object.properties.naam}</div>`,
    style: {
      backgroundColor: 'rgba(253, 253, 253, 0.85)',
      color:[0,0,0,256],
      fontSize: '0.8em'
    }
  };
}

function Map() {
  const layers = [
          new TileLayer<ImageBitmap>({
            data: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
            maxRequests: 20,
            pickable: false,
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
            getLineWidth: 5,
            getPointRadius: 4,
            getTextSize: 12,
            lineWidthMinPixels: 1,
            pickable: true,
        })
        ];

  return <DeckGL
      initialViewState={INITIAL_VIEW_STATE}
      controller
      layers={layers}
      getTooltip={getTooltip} />;
}

export default Map;
