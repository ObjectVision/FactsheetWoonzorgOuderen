// TreeView.tsx
import * as React from "react";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";

export type TreeNode = {
  id: string;
  label: string;
  meta?: Record<string, string | number>;
  children?: TreeNode[];
};

type TreeViewProps = {
  items: TreeNode[];
  /**
   * Optional controlled selection callback for leaf nodes.
   * Called with the full list of selected leaf ids.
   */
  onSelectionChange?: (selectedIds: string[]) => void;
};

export const TreeView: React.FC<TreeViewProps> = ({ items, onSelectionChange }) => {
  const [selected, setSelected] = React.useState<Set<string>>(new Set());

  const toggleLeaf = (id: string, checked: boolean | "indeterminate") => {
    const next = new Set(selected);
    if (checked) {
      next.add(id);
    } else {
      next.delete(id);
    }
    setSelected(next);
    onSelectionChange?.(Array.from(next));
  };

  return (
    <Accordion type="multiple" className="w-full">
      <div className="space-y-1">
        {items.map((node) => (
          <TreeNodeItem
            key={node.id}
            node={node}
            depth={0}
            isSelected={(id) => selected.has(id)}
            onToggleLeaf={toggleLeaf}
          />
        ))}
      </div>
    </Accordion>
  );
};

type TreeNodeItemProps = {
  node: TreeNode;
  depth: number;
  isSelected: (id: string) => boolean;
  onToggleLeaf: (id: string, checked: boolean | "indeterminate") => void;
};

const TreeNodeItem: React.FC<TreeNodeItemProps> = ({
  node,
  depth,
  isSelected,
  onToggleLeaf,
}) => {
  const isLeaf = !node.children || node.children.length === 0;

  const paddingLeft = 12 + depth * 16; // indent per depth level

  if (!isLeaf) {
    // Branch node: collapsible with nested children
    return (
      <Collapsible className="group">
        <CollapsibleTrigger asChild>
          <button
            type="button"
            className="flex w-full items-center px-2 py-1 rounded hover:bg-muted text-left"
            style={{ paddingLeft }}
          >
            <span
              className="mr-1 inline-block text-xs transition-transform group-data-[state=open]:rotate-90"
              aria-hidden="true"
            >
              ▶
            </span>
            <span>{node.label}</span>
          </button>
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-1">
          {node.children?.map((child) => (
            <TreeNodeItem
              key={child.id}
              node={child}
              depth={depth + 1}
              isSelected={isSelected}
              onToggleLeaf={onToggleLeaf}
            />
          ))}
        </CollapsibleContent>
      </Collapsible>
    );
  }

  // Leaf node: accordion item + checkbox on the right
  return (
    <AccordionItem value={node.id} className="border-none">
      <AccordionTrigger asChild>
        <div
          className="flex w-full items-center gap-2 rounded px-2 py-1 hover:bg-muted"
          style={{ paddingLeft }}
        >
          <span className="flex-1 text-left">{node.label}</span>
          <Checkbox
            checked={isSelected(node.id)}
            onCheckedChange={(value) => onToggleLeaf(node.id, value)}
            // Prevent clicking the checkbox from re-toggling the accordion
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      </AccordionTrigger>
      <AccordionContent className="pl-6 pr-2 pb-2 text-sm text-muted-foreground">
        <LeafMeta meta={node.meta} />
      </AccordionContent>
    </AccordionItem>
  );
};

type LeafMetaProps = {
  meta?: Record<string, string | number>;
};

const LeafMeta: React.FC<LeafMetaProps> = ({ meta }) => {
  if (!meta || Object.keys(meta).length === 0) {
    return <div className="italic text-muted-foreground/80">No metadata available.</div>;
  }

  return (
    <div className="space-y-1">
      {Object.entries(meta).map(([key, value]) => (
        <div key={key} className="flex text-xs sm:text-sm">
          <div className="w-32 font-medium">{key}</div>
          <div className="flex-1 break-words">{String(value)}</div>
        </div>
      ))}
    </div>
  );
};