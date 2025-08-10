import { useEffect, useState} from "react";
import Box from '@mui/material/Box';
import type { TreeViewBaseItem } from '@mui/x-tree-view/models';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import {
  useTreeViewApiRef,
} from "@mui/x-tree-view";

export type TreeViewItemModelProperties = {
  name?: string;
  id?: string;
  label?: string;
  layer?: string;
  tree?: string;
  icon?: string;
};
export type TreeViewItem<R extends {} = TreeViewItemModelProperties> = R & {
  children?: TreeViewItem<R>[];
};

const ITEMS: TreeViewItem[] = [
  {
    id: 'grid',
    label: 'Data Grid',
    children: [
      { id: 'grid-community', label: '@mui/x-data-grid' },
      { id: 'grid-pro', label: '@mui/x-data-grid-pro' },
      { id: 'grid-premium', label: '@mui/x-data-grid-premium' },
    ],
  },
  {
    id: 'pickers',
    label: 'Date and Time Pickers',
    children: [
      { id: 'pickers-community', label: '@mui/x-date-pickers' },
      { id: 'pickers-pro', label: '@mui/x-date-pickers-pro' },
    ],
  },
  {
    id: 'charts',
    label: 'Charts',
    children: [
      { id: 'charts-community', label: '@mui/x-charts' },
      { id: 'charts-pro', label: '@mui/charts-pro' },
    ],
  },
  {
    id: 'tree-view',
    label: 'Tree View',
    children: [
      { id: 'tree-view-community', label: '@mui/x-tree-view' },
      { id: 'tree-view-pro', label: '@mui/x-tree-view-pro' },
    ],
  },
];

interface Props {
  showLayerControl: boolean;
  mapJSON: TreeViewItem[];
  //setShowLayerControl: React.Dispatch<React.SetStateAction<boolean>>;
}

function Treeview({showLayerControl, mapJSON}:Props) {
  if (showLayerControl == false) {
    return;
  }
  const apiRef = useTreeViewApiRef();
  
  function getItemChildren(item:any) {
    //return item.children;
  }

  /*useEffect(() => {
    if (!mapJSON)
      return;

    if (!apiRef)
      return;
    
  }, [mapJSON]);*/


  if (!mapJSON)
    return;

  return (
    <Box sx={{ minHeight: 352, 
               minWidth: 250, 
               maxWidth: 250, 
               backgroundColor: '#ffffffd8',   
               color: '#4a4a4ad3', 
               left:5, 
               top: 95, 
               position:'absolute',
               borderRadius: 1,
               padding: 0 }}>
      <RichTreeView items={mapJSON} apiRef={apiRef} />
    </Box>
  );
}

export default Treeview;