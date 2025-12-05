"use client";

import { memo } from "react";
import { BaseTriggerNode } from "../base-trigger-node";
import type { NodeProps } from "@xyflow/react";
import { MousePointerIcon } from "lucide-react";

export const ManualTriggerNode = memo((props: NodeProps) => {
  return (
    <>
      <BaseTriggerNode
        {...props}
        icon={MousePointerIcon}
        name="When clicking 'Execute workflow'"
        // status={nodeStatus}
        onSettings={() => {}}
        onDoubleClick={() => {}}
      />
    </>
  );
});
