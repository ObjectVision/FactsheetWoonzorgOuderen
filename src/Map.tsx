import { useEffect, useState } from "react";
//import geodata from "/cbs_wijken_limburg.json?url";
import {DeckGL} from '@deck.gl/react';
import {MapView, Deck, OrthographicView} from '@deck.gl/core';
import {BitmapLayer, PathLayer} from '@deck.gl/layers';
import {TileLayer} from '@deck.gl/geo-layers';

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
          })
        ];

  return <DeckGL
      initialViewState={INITIAL_VIEW_STATE}
      controller
      layers={layers} />;
}

export default Map;
