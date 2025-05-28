import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
// 重新导入 ColumnDef 类型，因为子组件也需要它
import {
  Column,
  ColumnDef,
  flexRender,
  Table as ReactTableType,
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown, ChevronUp } from "lucide-react";
import React from "react";
import { DataTableRowActions } from "./data-table-row-actions"; // 导入行操作组件

interface DataTableCoreProps<T> {
  table: ReactTableType<T>;
  loading: boolean;
  processedColumns: ColumnDef<T>[]; // 需要传递处理后的列定义来计算 colspan
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
  showCheckboxColumn?: boolean; // 控制是否显示多选框列
}

export function DataTableCore<T>({
  table,
  loading,
  processedColumns,
  actions,
  getActions,
  showCheckboxColumn = true, // 默认为 true，保持向后兼容
}: DataTableCoreProps<T>) {
  /**
   * 处理表头点击事件，用于切换排序状态
   * @param column 被点击的列对象
   */
  const handleSortClick = (column: Column<T, unknown>) => {
    // 切换排序状态：未排序 -> 升序 -> 降序 -> 未排序
    column.toggleSorting(column.getIsSorted() === "asc");
  };

  const showActionsColumn = !!(actions || getActions);
  const colSpan =
    processedColumns.length +
    (showCheckboxColumn ? 1 : 0) +
    (showActionsColumn ? 1 : 0); // 根据 showCheckboxColumn 决定是否计算多选框列

  return (
    <div className="rounded-md border bg-white dark:bg-gray-800 dark:border-gray-700">
      <Table>
        {/* 表头 */}
        <TableHeader className="bg-gray-100 dark:bg-gray-700 select-none">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {/* 全选 Checkbox 列，根据 showCheckboxColumn 决定是否显示 */}
              {showCheckboxColumn && (
                <TableHead className="w-[50px]">
                  {" "}
                  {/* 固定宽度 */}
                  <Checkbox
                    checked={
                      table.getIsAllPageRowsSelected() || // 全选状态
                      (table.getIsSomePageRowsSelected() && "indeterminate") // 部分选择状态
                    }
                    onCheckedChange={
                      (value) => table.toggleAllPageRowsSelected(!!value) // 切换全选状态
                    }
                    aria-label="Select all"
                  />
                </TableHead>
              )}
              {/* 渲染数据列的表头 */}
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id} style={{ width: header.getSize() }}>
                  {/* 检查是否是占位符 */}
                  {!header.isPlaceholder && (
                    <div
                      className={
                        // 如果列允许排序，则添加可点击样式
                        header.column.getCanSort()
                          ? "flex items-center cursor-pointer select-none"
                          : "flex items-center" // 否则仅为 flex 布局
                      }
                      // 如果列允许排序，则绑定点击事件
                      onClick={
                        header.column.getCanSort()
                          ? () => handleSortClick(header.column)
                          : undefined
                      }
                    >
                      {/* 渲染表头内容 */}
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}

                      {/* 如果列允许排序，则显示排序图标 */}
                      {header.column.getCanSort() && (
                        <Button variant="ghost" className="ml-1 h-auto p-0">
                          {/* 根据排序状态显示不同图标 */}
                          {!header.column.getIsSorted() ? ( // 未排序
                            <ArrowUpDown className="h-4 w-4" />
                          ) : header.column.getIsSorted() === "asc" ? ( // 升序
                            <ChevronUp className="h-4 w-4 text-blue-500" /> // 使用向上箭头并设为蓝色
                          ) : (
                            // 降序
                            <ChevronDown className="h-4 w-4 text-blue-500" /> // 使用向下箭头并设为蓝色
                          )}
                        </Button>
                      )}
                    </div>
                  )}
                </TableHead>
              ))}
              {/* 如果定义了行操作，则添加 "操作" 列 */}
              {showActionsColumn && (
                <TableHead className="w-[80px]">操作</TableHead>
              )}{" "}
              {/* 固定宽度 */}
            </TableRow>
          ))}
        </TableHeader>

        {/* 表格内容 */}
        <TableBody>
          {loading ? ( // 加载状态
            <TableRow>
              <TableCell colSpan={colSpan} className="h-24 text-center">
                加载中...
              </TableCell>
            </TableRow>
          ) : table.getRowModel().rows?.length ? ( // 有数据时
            table.getRowModel().rows.map((row, index) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"} // 根据选择状态设置 data-state
                className={index % 2 === 1 ? "bg-gray-50 dark:bg-gray-700/50" : ""} // 斑马纹效果
              >
                {/* 行选择 Checkbox */}
                {showCheckboxColumn && (
                  <TableCell>
                    <Checkbox
                      checked={row.getIsSelected()} // 绑定行选择状态
                      onCheckedChange={(value) => row.toggleSelected(!!value)} // 切换行选择状态
                      aria-label="Select row"
                    />
                  </TableCell>
                )}
                {/* 渲染单元格数据 */}
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(
                      cell.column.columnDef.cell, // 使用列定义中的 cell 渲染函数
                      cell.getContext(), // 传递上下文
                    )}
                  </TableCell>
                ))}
                {/* 渲染行操作按钮 */}
                {showActionsColumn && (
                  <TableCell>
                    <DataTableRowActions // 使用新组件
                      row={row}
                      actions={actions}
                      getActions={getActions}
                    />
                  </TableCell>
                )}
              </TableRow>
            ))
          ) : (
            // 无数据时
            <TableRow>
              <TableCell colSpan={colSpan} className="h-24 text-center">
                暂无数据
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
