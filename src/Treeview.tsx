"use client";

import {
  TreeExpander,
  TreeIcon,
  TreeLabel,
  TreeNode,
  TreeNodeContent,
  TreeNodeTrigger,
  TreeProvider,
  TreeView,
} from "@/components/kibo-ui/tree";

import { FileJson, FileText } from "lucide-react";

const treeData = [
  {
    id: "geology",
    label: "Geology Layers",
    children: [
      { id: "faults", label: "Fault Lines" },
      { id: "soil", label: "Soil Types" },
    ],
  },
  {
    id: "hydrology",
    label: "Hydrology Layers",
    children: [
      { id: "rivers", label: "Rivers" },
      { id: "aquifers", label: "Aquifers" },
    ],
  },
  {
    id: "metadata",
    label: "metadata.json",
    icon: <FileJson className="h-4 w-4" />,
  },
];

function RenderNode({ node, level = 0, isLast = false }) {
  const hasChildren = Array.isArray(node.children) && node.children.length > 0;

  return (
    <TreeNode level={level} nodeId={node.id} isLast={isLast}>
      <TreeNodeTrigger>
        <TreeExpander hasChildren={hasChildren} />
        <TreeIcon
          hasChildren={hasChildren}
          icon={!hasChildren && node.icon ? node.icon : undefined}
        />
        <TreeLabel>{node.label}</TreeLabel>
      </TreeNodeTrigger>

      {hasChildren && (
        <TreeNodeContent hasChildren>
          {node.children.map((child, index) => (
            <RenderNode
              key={child.id}
              node={child}
              level={level + 1}
              isLast={index === node.children.length - 1}
            />
          ))}
        </TreeNodeContent>
      )}
    </TreeNode>
  );
}

export default function JsonTreeView() {
  return (
    <TreeProvider
      defaultExpandedIds={["geology", "hydrology"]} // example defaults
      onSelectionChange={(ids) => console.log("Selected:", ids)}
    >
      <TreeView>
        {treeData.map((node, index) => (
          <RenderNode
            key={node.id}
            node={node}
            level={0}
            isLast={index === treeData.length - 1}
          />
        ))}
      </TreeView>
    </TreeProvider>
  );
}
