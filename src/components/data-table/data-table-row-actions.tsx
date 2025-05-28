import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Row } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import React from "react";

interface DataTableRowActionsProps<T> {
  row: Row<T>;
  actions?: {
    label: string | ((row: T) => string);
    icon: React.ReactNode;
    onClick: (row: T) => void;
  }[];
  getActions?: (row: T) => {
    label: string;
    icon: React.ReactNode;
    onClick: () => void;
  }[];
}

export function DataTableRowActions<T>({
  row,
  actions,
  getActions,
}: DataTableRowActionsProps<T>) {
  // 确定实际要使用的操作列表
  const effectiveActions = getActions
    ? getActions(row.original)
    : actions?.map((action) => ({
        label:
          typeof action.label === "function"
            ? action.label(row.original)
            : action.label,
        icon: action.icon,
        onClick: () => action.onClick(row.original),
      }));

  // 如果没有操作，则不渲染任何内容
  if (!effectiveActions || effectiveActions.length === 0) {
    return null;
  }

  // 如果只有一个操作，直接渲染按钮
  if (effectiveActions.length === 1) {
    const singleAction = effectiveActions[0];
    return (
      <Button
        className="h-8 w-auto px-2 py-1 flex items-center gap-1" // 调整 padding 和添加 gap
        onClick={singleAction.onClick}
        aria-label={singleAction.label} // 添加 aria-label
      >
        {singleAction.icon}
        {singleAction.label}
      </Button>
    );
  }

  // 如果有多个操作，渲染下拉菜单
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">打开菜单</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {effectiveActions.map((action) => (
          <DropdownMenuItem
            key={action.label}
            onClick={action.onClick}
            className="flex items-center gap-1" // 添加 gap 使图标和文字间距一致
          >
            {action.icon}
            {action.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
