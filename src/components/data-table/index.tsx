"use client";

import {
  ColumnDef,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { format } from "date-fns/format";
import React, { useEffect, useMemo, useState } from "react";
import DataPagination from "./data-pagination";
// 导入新的子组件
import { DataTableCore } from "./data-table-core";
import DataTableFilter from "./data-table-filter";
import { DataTableHeader } from "./data-table-header";
import { camelToSnakeCase } from "./utils";
// 导入类型定义
import { Filter, Page, TimeRange } from "./types";

/**
 * DataTable 组件的 Props
 * @template T - 表格数据的类型
 */
interface DataTableProps<T> {
  /** 表格标题 */
  title: string;
  /** 可选的描述或提示语，显示在标题下方 */
  description?: React.ReactNode;
  /** 是否处于加载状态 */
  loading: boolean;
  /**
   * 表格列定义
   * 使用 @tanstack/react-table 的 ColumnDef 类型
   */
  columns: ColumnDef<T>[];
  /** 表格数据源 */
  data: T[];
  /**
   * 行操作配置
   * 定义每行数据可执行的操作按钮
   */
  actions?: {
    /**
     * 操作按钮的标签
     * 可以是静态字符串或一个函数，根据行数据动态生成标签
     */
    label: string | ((row: T) => string);
    /** 操作按钮的图标 */
    icon: React.ReactNode;
    /** 点击操作按钮时的回调函数 */
    onClick: (row: T) => void;
  }[];
  /**
   * 动态生成行操作配置的函数
   * 根据行数据返回操作按钮数组
   */
  getActions?: (row: T) => {
    label: string;
    icon: React.ReactNode;
    onClick: () => void;
  }[];
  /** 分页信息 */
  page?: Page;
  /** 页码改变时的回调函数 */
  onPageChange?: (page: number) => void;
  /** 筛选和排序信息 */
  filter?: Filter<T>;
  /** 筛选或排序信息改变时的回调函数 */
  onFilterChange?: (filter: Filter<T>) => void;
  /**
   * 工具栏按钮配置
   * 在表格标题右侧添加自定义操作按钮
   */
  toolbars?: {
    /** 按钮标签 */
    label: string;
    /** 按钮图标 */
    icon: React.ReactNode;
    /** 点击按钮时的回调函数 */
    onClick: () => void;
  }[];
  /**
   * 批量操作按钮配置
   * 用于控制是否显示多选框，显示在工具栏中
   */
  batchAction?: {
    /** 按钮标签 */
    label: string;
    /** 按钮图标 */
    icon: React.ReactNode;
    /** 点击按钮时的回调函数 */
    onClick: (selectedRows: T[]) => void;
  }[];
}

/**
 * 常见列的默认宽度映射
 */
const defaultColumnWidths: Record<string, number> = {
  id: 50,
  name: 200,
  title: 250,
  status: 120,
  type: 100,
  createdAt: 180,
  updatedAt: 180,
  // 'select' 和 'actions' 列的宽度是硬编码的
};

/**
 * 一个基于 Shadcn UI 和 @tanstack/react-table 的通用数据表格组件。
 * 支持排序、筛选、分页、行选择、列可见性控制和自定义操作。
 * @template T - 表格数据的类型
 */
export function DataTable<T>({
  title,
  description,
  loading,
  columns,
  data: dataSource,
  actions,
  getActions,
  page,
  onPageChange,
  filter,
  onFilterChange,
  toolbars,
  batchAction,
}: DataTableProps<T>) {
  /** 行选择状态 */
  const [rowSelection, setRowSelection] = useState({});
  /** 排序状态 */
  const [sorting, setSorting] = useState<SortingState>([]);
  /** 列可见性状态 */
  const [columnVisibility, setColumnVisibility] = useState({});
  /** 时间范围选择状态 */
  const [timeRange, setTimeRange] = useState<TimeRange>({
    startDateTime: filter?.startDateTime
      ? new Date(filter.startDateTime)
      : undefined,
    endDateTime: filter?.endDateTime ? new Date(filter.endDateTime) : undefined,
  });
  /** 搜索框内部状态 */
  const [searchTerm, setSearchTerm] = useState(filter?.search ?? "");

  /**
   * 预处理列定义，为常见列添加默认宽度
   */
  const processedColumns = useMemo(() => {
    return columns.map((col) => {
      // 确保 col.id 是字符串类型
      const colId = typeof col.id === "string" ? col.id : undefined;

      if (
        colId && // 必须有 ID
        col.enableHiding !== false && // 必须是可以隐藏的列 (select/actions 通常不可隐藏，宽度已固定)
        !col.size && // 检查 size 是否未定义
        defaultColumnWidths[colId] // 检查是否是常见列
      ) {
        return {
          ...col,
          size: defaultColumnWidths[colId], // 应用默认宽度
        };
      }
      return col; // 返回原始列定义
    });
  }, [columns]); // 依赖于原始 columns prop

  /**
   * 效果：根据数据源自动隐藏没有数据的列
   * 当数据源或列定义变化时，遍历数据，检查每一列是否有有效数据。
   * 如果一列在所有行中都没有数据（或为 undefined/null/空字符串），则将其默认隐藏。
   * 注意：现在依赖 processedColumns 而不是原始的 columns
   */
  useEffect(() => {
    if (!dataSource || dataSource.length === 0) return;

    // 记录包含数据的列 ID
    const columnsWithData = new Set<string>();

    for (const column of processedColumns) {
      // 跳过 'select' 和 'actions' 列
      if (column.id === "select" || column.id?.startsWith("actions")) {
        columnsWithData.add(column.id);
        continue;
      }

      let hasData = false;
      for (const row of dataSource) {
        // 如果列是自定义渲染的 (accessorFn 存在), 认为它总是有内容的
        // 使用 'in' 操作符检查属性是否存在，避免 linter 警告
        if ("accessorFn" in column) {
          hasData = true;
          break;
        }

        // 检查单元格的值
        const cellValue = row[column.id as keyof T];

        // 如果值不为 null、undefined 或空字符串，则认为该列有数据
        if (
          cellValue !== null &&
          cellValue !== undefined &&
          cellValue !== '""'
        ) {
          hasData = true;
          break; // 找到一个有数据的单元格就可以确定该列有数据
        }
      }

      if (hasData) {
        columnsWithData.add(column.id as string);
      }
    }

    // 根据是否有数据设置列的可见性
    const newColumnVisibility: Record<string, boolean> = {};
    processedColumns.forEach((column) => {
      // 仅处理可以被隐藏的列
      if (column.enableHiding !== false) {
        newColumnVisibility[column.id as string] = columnsWithData.has(
          column.id as string,
        );
      } else {
        // 不能隐藏的列始终可见
        newColumnVisibility[column.id as string] = true;
      }
    });

    setColumnVisibility(newColumnVisibility);
  }, [dataSource, processedColumns]); // 依赖 processedColumns

  /**
   * 效果：处理排序状态变化
   * 当内部排序状态 `sorting` 改变时，将其转换为 API 需要的格式 (`{column_name}.{asc|desc}`)
   * 并更新外部传入的 `filter` 对象，然后调用 `onFilterChange` 回调。
   */
  useEffect(() => {
    if (!filter || !onFilterChange) return;

    // 将 @tanstack/react-table 的排序状态转换为后端 API 的 sort 参数
    const params = sorting
      .map(
        (sort) =>
          // 将驼峰式列名转换为下划线式，并附加排序方向
          `${camelToSnakeCase(sort.id)}.${sort.desc ? "desc" : "asc"}`,
      )
      .join(","); // 多个排序条件用逗号分隔

    // 仅在排序参数实际发生变化时更新 filter 并触发回调
    if (filter.sort !== params) {
      const newFilter = { ...filter, sort: params };
      onFilterChange(newFilter);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sorting]); // 依赖项只需要 sorting，以避免不必要的触发

  /**
   * 效果：处理时间范围选择变化
   * 当 `timeRange` 状态改变时，将其格式化为 "yyyy-MM-dd HH:mm:ss" 字符串，
   * 更新外部传入的 `filter` 对象中的 `startDateTime` 和 `endDateTime`，
   * 然后调用 `onFilterChange` 回调。
   */
  useEffect(() => {
    if (!filter || !onFilterChange) return;

    let changed = false;
    const newFilter = { ...filter }; // 创建副本以避免直接修改 props

    // 处理开始时间
    if (timeRange.startDateTime) {
      const formattedStart = format(
        timeRange.startDateTime,
        "yyyy-MM-dd HH:mm:ss",
      );
      if (newFilter.startDateTime !== formattedStart) {
        newFilter.startDateTime = formattedStart;
        changed = true;
      }
    } else if (newFilter.startDateTime) {
      // 如果 timeRange 中清除了开始时间，也需要更新 filter
      newFilter.startDateTime = null;
      changed = true;
    }

    // 处理结束时间
    if (timeRange.endDateTime) {
      const formattedEnd = format(timeRange.endDateTime, "yyyy-MM-dd HH:mm:ss");
      if (newFilter.endDateTime !== formattedEnd) {
        newFilter.endDateTime = formattedEnd;
        changed = true;
      }
    } else if (newFilter.endDateTime) {
      // 如果 timeRange 中清除了结束时间，也需要更新 filter
      newFilter.endDateTime = null;
      changed = true;
    }

    // 仅在时间范围实际发生变化时触发回调
    if (changed) {
      onFilterChange(newFilter);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeRange]); // 依赖项只需要 timeRange，以避免不必要的触发

  /**
   * 效果：同步外部 filter 变化到内部 timeRange state
   * 当 filter prop 中的 startDateTime 或 endDateTime 改变时，
   * 更新内部的 timeRange state 以确保 TimeRangePicker 显示正确的值。
   */
  useEffect(() => {
    const newStart = filter?.startDateTime
      ? new Date(filter.startDateTime)
      : undefined;
    const newEnd = filter?.endDateTime
      ? new Date(filter.endDateTime)
      : undefined;

    // 仅在外部 filter 的时间与内部 state 不同时更新
    if (
      newStart?.getTime() !== timeRange.startDateTime?.getTime() ||
      newEnd?.getTime() !== timeRange.endDateTime?.getTime()
    ) {
      setTimeRange({
        startDateTime: newStart,
        endDateTime: newEnd,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter?.startDateTime, filter?.endDateTime]); // 依赖外部 filter 的时间戳

  /**
   * 同步外部 filter 搜索词到内部 searchTerm
   */
  useEffect(() => {
    if (filter?.search !== searchTerm) {
      setSearchTerm(filter?.search ?? "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter?.search]);

  /**
   * 初始化 @tanstack/react-table 实例
   */
  const table = useReactTable({
    data: dataSource,
    columns: processedColumns,
    getCoreRowModel: getCoreRowModel(), // 获取核心行模型
    getSortedRowModel: getSortedRowModel(), // 获取排序行模型
    state: {
      rowSelection, // 同步行选择状态
      sorting, // 同步排序状态
      columnVisibility, // 同步列可见性状态
    },
    enableRowSelection: true, // 启用行选择
    onRowSelectionChange: setRowSelection, // 行选择变化回调
    onColumnVisibilityChange: setColumnVisibility, // 列可见性变化回调
    enableSorting: true, // 启用排序
    onSortingChange: setSorting, // 排序变化回调
    manualPagination: true, // 手动分页，因为分页逻辑由外部处理
    manualSorting: true, // 手动排序，因为排序逻辑由外部处理
    manualFiltering: true, // 手动筛选，因为筛选逻辑由外部处理
  });

  // 添加获取选中行的辅助函数
  const getSelectedRows = () => {
    // 获取所有选中行的原始数据
    return table.getFilteredSelectedRowModel().rows.map((row) => row.original);
  };

  return (
    <div className="space-y-4">
      <DataTableHeader
        title={title}
        description={description}
        toolbars={toolbars}
        batchAction={batchAction}
        table={table}
        selectedRows={getSelectedRows()}
      />
      {/* 如果存在筛选配置，则渲染筛选组件 */}
      {filter && onFilterChange && (
        <DataTableFilter
          filter={filter}
          onFilterChange={onFilterChange}
          timeRange={timeRange}
          setTimeRange={setTimeRange}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          table={table}
        />
      )}

      {/* 表格核心部分 */}
      <DataTableCore
        table={table}
        loading={loading}
        processedColumns={processedColumns} // 传递处理后的列
        actions={actions}
        getActions={getActions}
        showCheckboxColumn={!!batchAction} // 只有当存在批量操作按钮时才显示多选框
      />

      {/* 分页组件 */}
      {page && onPageChange && (
        <DataPagination
          page={page}
          onPageChange={onPageChange}
          onPageSizeChange={(pageSize) => {
            // 处理 pageSize 变化，更新外部 filter 并触发回调
            if (filter && onFilterChange) {
              const newFilter = { ...filter, size: pageSize, page: 1 }; // 页码重置为 1
              onFilterChange(newFilter);
            }
          }}
        />
      )}
    </div>
  );
}
