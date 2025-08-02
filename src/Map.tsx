import { useEffect, useState } from "react";
import wijken from "./assets/cbs_wijken_limburg.json?url";
import bag_panden from "./assets/bag_pand_Limburg_uncompressed_3.arrow?url";
//import bag_panden from "./assets/bag_pand_NL_uncompressed.arrow?url";

import {DeckGL} from '@deck.gl/react';
import type {PickingInfo} from '@deck.gl/core';
import {BitmapLayer, GeoJsonLayer} from '@deck.gl/layers';
import {TileLayer} from '@deck.gl/geo-layers';
import { GeoArrowPolygonLayer } from "@geoarrow/deck.gl-layers";
import * as arrow from "apache-arrow";

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

/////////////////






/////////////////

interface ChildProps {
  selectedPolygons: GeoJSON.Feature[];
  setSelectedPolygons: React.Dispatch<React.SetStateAction<GeoJSON.Feature[]>>;
}

function Map({ selectedPolygons, setSelectedPolygons }: ChildProps) {
  const [isHovering, setIsHovering] = useState(false);
  const [table, setTable] = useState<arrow.Table | null>(null);
  
  useEffect(() => {
    // declare the data fetching function
    const fetchData = async () => {
      const data = await fetch(bag_panden);
      const buffer = await data.arrayBuffer();
      const table = arrow.tableFromIPC(buffer);
      const table2 = new arrow.Table(table.batches.slice(0, 10));
      //window.table = table2;
      setTable(table2);
    };

    if (!table) {
      fetchData().catch(console.error);
    }
  });


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

    const arrow_layer =  new GeoArrowPolygonLayer({
        id: "geoarrow-polygons",
        stroked: false,
        filled: true,
        data: table!,
        getFillColor: [255, 0, 0, 255],
        getLineColor: [0, 0, 0],
        lineWidthMinPixels: 1,
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

  const layers = [
          background_layer,
          navigation_layer,
          selection_layer,
          arrow_layer
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
