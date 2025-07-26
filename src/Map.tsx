import { useEffect, useState } from "react";
import wijken from "./assets/cbs_wijken_limburg.json?url";
//import wijken from "/cbs_wijken_limburg.fgb?url";
import {DeckGL} from '@deck.gl/react';
import type {PickingInfo} from '@deck.gl/core';
import {BitmapLayer, GeoJsonLayer, PolygonLayer} from '@deck.gl/layers';
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
  const [isHovering, setIsHovering] = useState(false);
  const [selectedPolygons, setSelectedPolygons] = useState<GeoJSON.Feature[]>([]);

  const background_layer = new TileLayer<ImageBitmap>({
            data: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
            id: 'background_layer',
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
          });

  const navigation_layer = new GeoJsonLayer({
            id: 'navigation-layer', 
            data: wijken,
            opacity: 1.0,
            stroked: true,
            filled: true,
            onHover: ({object}) => {
              setIsHovering(Boolean(object));
            },
            onClick: ({object}: any) => {
              if (!object) return;

              setSelectedPolygons(prev => {
                const maxFeatures = 3;
                const index = prev.findIndex((f) => f.properties!.WK_CODE === object.properties.WK_CODE);
                if (index!==-1)
                  return prev.filter((_, i) => i !== index);

                const updated = [...prev, object];
                return updated.slice(-maxFeatures);
              });
            },
            parameters: {
              depthTest: false
            },
            getLineColor: [256, 256, 256, 100],
            getFillColor: [72, 191, 145, 256],
            getLineWidth: 5,
            getPointRadius: 4,
            getTextSize: 12,
            lineWidthMinPixels: 1,
            pickable: true,
        })

  const selection_layer = new GeoJsonLayer({
    id: 'selection-layer',
    data: {
      type: 'FeatureCollection',
      features: selectedPolygons,
    },
    filled: false,
    stroked: true,
    getLineWidth: 42,
    lineWidthMinPixels: 1,
    getLineColor: [200, 0, 0, 200],
});

  const layers = [
          background_layer,
          navigation_layer,
          selection_layer
        ];

  return <DeckGL
      initialViewState={INITIAL_VIEW_STATE}
      controller
      layers={layers}
      getCursor={({ isDragging }) =>
        isDragging ? 'grabbing' : isHovering ? 'pointer' : 'default'
      }
      getTooltip={getTooltip} />;
}

export default Map;
