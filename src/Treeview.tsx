import * as React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ChevronDown, ChevronRight, Info } from "lucide-react";

type TreeNode = {
  id: string;
  name: string;
  icon?: string;
  layer?: string;
  children?: TreeNode[];
};

type TreeviewProps = {
  mapJSON?: any;
};

type TreeNodeItemProps = {
  node: TreeNode;
  depth: number;
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
  openIds: Set<string>;
  toggleOpen: (id: string) => void;
  openInfo: (node: TreeNode) => void;
  checkedIds: Set<string>;
  onLeafCheck: (id: string, checked: boolean) => void;
};

function TreeNodeItem({
  node,
  depth,
  selectedId,
  setSelectedId,
  openIds,
  toggleOpen,
  openInfo,
  checkedIds,
  onLeafCheck,
}: TreeNodeItemProps) {
  const isLeaf = !node.children || node.children.length === 0;
  const isOpen = openIds.has(node.id);
  const isSelected = selectedId === node.id;

  const levelIndent = depth * 16;
  const rowInnerPaddingLeft = 8;

  const isChecked = isLeaf && checkedIds.has(node.id);

  return (
    <div className="w-full">
      <div style={{ marginLeft: levelIndent }}>
        <div
          className={[
            "flex items-center justify-between px-2 py-1 text-sm rounded-sm",
            "hover:bg-muted cursor-pointer",
            isSelected ? "bg-blue-50 text-blue-900" : "",
          ]
            .filter(Boolean)
            .join(" ")}
          style={{ paddingLeft: rowInnerPaddingLeft }}
          onClick={() => {
            if (isLeaf) {
              const newChecked = !isChecked;
              onLeafCheck(node.id, newChecked);
              setSelectedId(node.id);
            } else {
              setSelectedId(node.id);
              toggleOpen(node.id);
            }
          }}
        >
          <div className="flex items-center gap-2">
            {isLeaf ? (
              <span className="inline-flex h-4 w-4 items-center justify-center" />
            ) : (
              <button
                type="button"
                className="inline-flex h-4 w-4 items-center justify-center rounded-sm hover:bg-muted/70 cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleOpen(node.id);
                }}
              >
                {isOpen ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </button>
            )}

            <span>{node.name}</span>
          </div>

          {isLeaf && (
            <div
              className="flex items-center gap-1 pr-2"
              onClick={(e) => e.stopPropagation()}
            >
              {isSelected && (
                <Button
                  type="button"
                  size="icon"
                  variant="outline"
                  className="h-6 w-6 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    openInfo(node);
                  }}
                >
                  <Info className="h-3 w-3" />
                </Button>
              )}

              <Checkbox
                className="border-gray-400 cursor-pointer"
                checked={isChecked}
                onCheckedChange={(val) => {
                  const checked = val === true;
                  onLeafCheck(node.id, checked);
                  if (checked) {
                    setSelectedId(node.id);
                  }
                }}
              />
            </div>
          )}
        </div>
      </div>

      {!isLeaf && isOpen && node.children && node.children.length > 0 && (
        <div className="mt-1">
          {node.children.map((child) => (
            <TreeNodeItem
              key={child.id}
              node={child}
              depth={depth + 1}
              selectedId={selectedId}
              setSelectedId={setSelectedId}
              openIds={openIds}
              toggleOpen={toggleOpen}
              openInfo={openInfo}
              checkedIds={checkedIds}
              onLeafCheck={onLeafCheck}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function Treeview({ mapJSON }: TreeviewProps) {
  const data: TreeNode[] = Array.isArray(mapJSON) ? (mapJSON as TreeNode[]) : [];

  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const [openIds, setOpenIds] = React.useState<Set<string>>(
    () => new Set<string>()
  );

  const [checkedIds, setCheckedIds] = React.useState<Set<string>>(
    () => new Set<string>()
  );

  const [infoNode, setInfoNode] = React.useState<TreeNode | null>(null);
  const [infoOpen, setInfoOpen] = React.useState(false);

  const toggleOpen = React.useCallback((id: string) => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const openInfo = React.useCallback((node: TreeNode) => {
    setInfoNode(node);
    setInfoOpen(true);
  }, []);

  const handleLeafCheck = React.useCallback((id: string, checked: boolean) => {
    setCheckedIds((prev) => {
      const next = new Set(prev);
      if (checked) next.add(id);
      else next.delete(id);
      return next;
    });
  }, []);

  if (!data || data.length === 0) {
    return null;
  }

  return (
    <>
      <div className="mt-2 ml-2 w-full">
        {data.map((node) => (
          <TreeNodeItem
            key={node.id}
            node={node}
            depth={0}
            selectedId={selectedId}
            setSelectedId={setSelectedId}
            openIds={openIds}
            toggleOpen={toggleOpen}
            openInfo={openInfo}
            checkedIds={checkedIds}
            onLeafCheck={handleLeafCheck}
          />
        ))}
      </div>

      <Dialog open={infoOpen} onOpenChange={setInfoOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{infoNode?.name ?? "Metainfo"}</DialogTitle>
            <DialogDescription>
              Detailinformatie over het geselecteerde element.
            </DialogDescription>
          </DialogHeader>

          {infoNode && (
            <div className="mt-2 space-y-1 text-sm">
              <div>
                <span className="font-mono text-[11px] opacity-70 mr-1">
                  id:
                </span>
                {infoNode.id}
              </div>
              {infoNode.icon && (
                <div>
                  <span className="font-mono text-[11px] opacity-70 mr-1">
                    icon:
                  </span>
                  {infoNode.icon}
                </div>
              )}
              {infoNode.layer && (
                <div>
                  <span className="font-mono text-[11px] opacity-70 mr-1">
                    layer:
                  </span>
                  {infoNode.layer}
                </div>
              )}
              {!infoNode.icon && !infoNode.layer && (
                <div className="italic text-muted-foreground">
                  Geen extra metadata beschikbaar.
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
