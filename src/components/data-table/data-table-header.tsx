import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Column, Table as ReactTableType } from "@tanstack/react-table";
import { ChevronDown } from "lucide-react";
import React from "react";

interface DataTableHeaderProps<T> {
  title: string;
  description?: React.ReactNode;
  toolbars?: {
    label: string;
    icon: React.ReactNode;
    onClick: () => void;
  }[];
  batchAction?: {
    label: string;
    icon: React.ReactNode;
    onClick: (selectedRows: T[]) => void;
  }[];
  table: ReactTableType<T>;
  selectedRows?: T[];
}

/**
 * 获取列标题的文本内容
 * @param column @tanstack/react-table 的 Column 对象
 * @returns 列标题字符串
 */
const getColumnHeaderText = <T,>(column: Column<T, unknown>): string => {
  const headerContent = column.columnDef.header;
  // 如果 header 是字符串，直接返回；否则使用列 ID 作为备选
  return typeof headerContent === "string"
    ? headerContent
    : (column.id as string);
};

export function DataTableHeader<T>({
  title,
  description,
  toolbars,
  batchAction,
  table,
  selectedRows = [],
}: DataTableHeaderProps<T>) {
  return (
    <div className="space-y-2">
      <div className="flex items-center py-4 gap-2">
        <h1 className="text-2xl font-bold">{title}</h1>
        <div className="grow"></div>
        {/* 渲染批量操作按钮 */}
        {batchAction &&
          selectedRows.length > 0 &&
          batchAction.map((item) => (
            <Button
              key={item.label}
              variant="default"
              onClick={() => item.onClick(selectedRows)}
            >
              {item.icon} {item.label} ({selectedRows.length})
            </Button>
          ))}
        {/* 渲染工具栏按钮 */}
        {toolbars?.map((item) => (
          <Button key={item.label} variant="outline" onClick={item.onClick}>
            {item.icon} {item.label}
          </Button>
        ))}
        {/* 列可见性筛选下拉菜单 */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              列筛选 <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[200px]">
            {table
              .getAllColumns()
              // 过滤掉 'select' 列和不允许隐藏的列
              .filter((column) => column.id !== "select" && column.getCanHide())
              .map((column) => (
                <DropdownMenuItem
                  key={column.id}
                  className="capitalize"
                  // 点击切换列的可见性
                  onClick={(e) => {
                    e.preventDefault(); // 防止菜单关闭
                    column.toggleVisibility();
                  }}
                >
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      } // 直接用 Checkbox 控制
                      aria-label={`Toggle column ${getColumnHeaderText(column)}`}
                    />
                    <span>{getColumnHeaderText(column)}</span>
                  </div>
                </DropdownMenuItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      {/* 渲染描述信息 */}
      {description && (
        <div className="text-sm text-muted-foreground">{description}</div>
      )}
    </div>
  );
}
