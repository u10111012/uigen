"use client";

import { FileEdit, FileX, FilePlus, RefreshCw, CheckCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ToolInvocation {
  toolName: string;
  state: "partial-call" | "call" | "result";
  args?: any;
  result?: any;
}

interface ToolStatusIndicatorProps {
  toolInvocation: ToolInvocation;
  className?: string;
}

function getToolMessage(toolInvocation: ToolInvocation): {
  message: string;
  icon: React.ComponentType<{ className?: string }>;
} {
  const { toolName, args } = toolInvocation;

  // Handle str_replace_editor tool
  if (toolName === "str_replace_editor") {
    const command = args?.command;
    const path = args?.path;
    const fileName = path ? path.split('/').pop() || path : 'file';

    switch (command) {
      case "create":
        return {
          message: `Creating ${fileName}`,
          icon: FilePlus,
        };
      case "str_replace":
        return {
          message: `Editing ${fileName}`,
          icon: FileEdit,
        };
      case "insert":
        return {
          message: `Adding code to ${fileName}`,
          icon: FileEdit,
        };
      case "view":
        return {
          message: `Reading ${fileName}`,
          icon: FileEdit,
        };
      default:
        return {
          message: `Working on ${fileName}`,
          icon: FileEdit,
        };
    }
  }

  // Handle file_manager tool
  if (toolName === "file_manager") {
    const command = args?.command;
    const path = args?.path;
    const newPath = args?.new_path;
    const fileName = path ? path.split('/').pop() || path : 'file';
    const newFileName = newPath ? newPath.split('/').pop() || newPath : 'file';

    switch (command) {
      case "rename":
        return {
          message: `Renaming ${fileName} to ${newFileName}`,
          icon: RefreshCw,
        };
      case "delete":
        return {
          message: `Deleting ${fileName}`,
          icon: FileX,
        };
      default:
        return {
          message: `Managing ${fileName}`,
          icon: FileEdit,
        };
    }
  }

  // Fallback for unknown tools
  return {
    message: `Running ${toolName}`,
    icon: RefreshCw,
  };
}

export function ToolStatusIndicator({ 
  toolInvocation, 
  className 
}: ToolStatusIndicatorProps) {
  const { message, icon: Icon } = getToolMessage(toolInvocation);
  const isCompleted = toolInvocation.state === "result";
  const isLoading = toolInvocation.state === "partial-call" || toolInvocation.state === "call";

  return (
    <div 
      className={cn(
        "inline-flex items-center gap-2 mt-2 px-3 py-1.5 rounded-lg text-xs border",
        isCompleted 
          ? "bg-emerald-50 border-emerald-200" 
          : "bg-neutral-50 border-neutral-200",
        className
      )}
      role="status"
      aria-live="polite"
      aria-label={isCompleted ? `Completed: ${message}` : `In progress: ${message}`}
    >
      {isCompleted ? (
        <CheckCircle className="w-3 h-3 text-emerald-600" aria-hidden="true" />
      ) : isLoading ? (
        <Loader2 className="w-3 h-3 animate-spin text-blue-600" aria-hidden="true" />
      ) : (
        <Icon className="w-3 h-3 text-neutral-600" aria-hidden="true" />
      )}
      <span className={cn(
        "font-medium",
        isCompleted ? "text-emerald-700" : "text-neutral-700"
      )}>
        {message}
      </span>
    </div>
  );
}