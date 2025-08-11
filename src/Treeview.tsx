import Box from '@mui/material/Box';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { useTreeViewApiRef } from "@mui/x-tree-view";
import ExpandCircleDownOutlinedIcon from '@mui/icons-material/ExpandCircleDownOutlined';
import { TreeItem, treeItemClasses } from '@mui/x-tree-view/TreeItem';
import { styled, alpha } from '@mui/material/styles';
import { useTreeItemUtils } from '@mui/x-tree-view/hooks';

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

interface Props {
  setLatestChangedLayer: React.Dispatch<React.SetStateAction<[boolean,TreeViewItem]|undefined>>;
  showLayerControl: boolean;
  mapJSON: TreeViewItem[];
}

export default function Treeview({setLatestChangedLayer, showLayerControl, mapJSON}:Props) {
  if (showLayerControl == false) {
    return;
  }
  const apiRef = useTreeViewApiRef();

  const handleItemSelectionToggle = (
    event: React.SyntheticEvent | null,
    itemId: string,
    isSelected: boolean,
  ) => {
    const item = apiRef.current?.getItem(itemId);
    setLatestChangedLayer([isSelected,item]);
    let i = 0;
    i = i + 1;
    
    //if (isSelected) {
    //  setLastSelectedItem(itemId);
    //}
  };
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
      <RichTreeView items={mapJSON} 
        multiSelect={false}
        checkboxSelection={true}
        onItemSelectionToggle={handleItemSelectionToggle}
      apiRef={apiRef} />
    </Box>
  );
}