// components/FoodTree.tsx
import React from "react";
import {
  checkboxesFeature,
  hotkeysCoreFeature,
  selectionFeature,
  syncDataLoaderFeature,
} from "@headless-tree/core";
import { useTree, AssistiveTreeDescription } from "@headless-tree/react";

export type JsonNode = {
  id: string;
  name: string;
  children?: JsonNode[];
};

export const jsonTree: JsonNode = {
  id: "root",
  name: "All food",
  children: [
    {
      id: "fruit",
      name: "Fruit",
      children: [
        { id: "apple", name: "Apple" },
        { id: "banana", name: "Banana" },
        { id: "orange", name: "Orange" },
      ],
    },
    {
      id: "vegetables",
      name: "Vegetables",
      children: [
        { id: "carrot", name: "Carrot" },
        { id: "broccoli", name: "Broccoli" },
      ],
    },
  ],
};

export type FlatItem = {
  name: string;
  children?: string[];
};

export function buildItems(root: JsonNode): Record<string, FlatItem> {
  const items: Record<string, FlatItem> = {};

  function visit(node: JsonNode) {
    items[node.id] = {
      name: node.name,
      children: node.children?.map((c) => c.id),
    };
    node.children?.forEach(visit);
  }

  visit(root);
  return items;
}

const items = buildItems(jsonTree);

export const FoodTree: React.FC = () => {
  const tree = useTree<FlatItem>({
    rootItemId: "root",
    initialState: {
      expandedItems: ["fruit"],
      checkedItems: ["banana"],
    },
    getItemName: (item) => item.getItemData().name,
    isItemFolder: (item) => !!item.getItemData().children,
    dataLoader: {
      getItem: (itemId) => items[itemId],
      getChildren: (itemId) => items[itemId].children ?? [],
    },
    indent: 20,
    features: [
      syncDataLoaderFeature,
      selectionFeature,
      checkboxesFeature,
      hotkeysCoreFeature,
    ],
  });

  return (
    <div>
      {tree.getItems().map((item) => {
        const meta = item.getItemMeta();
        const isFolder = item.isFolder();
        const indent = 4 + meta.level * (tree.getConfig().indent ?? 20);

        const rowProps = item.getProps();

        return (
          <div
            key={item.getId()}
            {...rowProps}
            style={{
              display: "flex",
              alignItems: "center",
              cursor: "default",
              background: item.isSelected() ? "#e5f2ff" : "transparent",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                flex: 1,
                paddingLeft: indent,
              }}
            >
              {isFolder ? (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    item.isExpanded() ? item.collapse() : item.expand();
                  }}
                  style={{
                    width: 16,
                    border: "none",
                    background: "transparent",
                    padding: 0,
                    marginRight: 4,
                  }}
                >
                  {item.isExpanded() ? "▾" : "▸"}
                </button>
              ) : (
                <span style={{ width: 16, marginRight: 4 }} />
              )}

              <span>{item.getItemName()}</span>
            </div>
            {!isFolder && (
              <input
                type="checkbox"
                {...item.getCheckboxProps()}
                style={{ marginLeft: 4, marginRight: 4 }}
              />
            )}
          </div>
        );
      })}

      <AssistiveTreeDescription tree={tree} />
    </div>
  );
};