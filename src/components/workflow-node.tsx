"use client";

import { NodeToolbar, Position } from "@xyflow/react";
import { SettingsIcon, TrashIcon } from "lucide-react";
import { Button } from "./ui/button";
import { ReactNode } from "react";

interface WorkflowNodeProps {
  children: ReactNode;
  showToolbar?: boolean;
  onDelete?: () => void;
  onSettings?: () => void;
  name?: string;
  description?: string;
}

export function WorkflowNode({
  children,
  showToolbar,
  onDelete,
  onSettings,
  name,
  description,
}: WorkflowNodeProps) {
  return (
    <>
      {showToolbar && (
        <NodeToolbar>
          <Button size={"sm"} variant={"ghost"} onClick={onSettings}>
            <SettingsIcon size={"4"} />
          </Button>

          <Button size={"sm"} variant={"ghost"} onClick={onDelete}>
            <TrashIcon size={"4"} />
          </Button>
        </NodeToolbar>
      )}

      {children}

      {name && (
        <NodeToolbar
          position={Position.Bottom}
          isVisible
          className="max-w-[200px] text-center"
        >
          <p className="font-medium">{name}</p>

          {description && (
            <p
              className="text-muted-foreground truncate 
            text-sm"
            >
              {description}
            </p>
          )}
        </NodeToolbar>
      )}
    </>
  );
}
