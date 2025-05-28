import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TimeRangePicker } from "@/components/ui/time-range-picker";
import { Table } from "@tanstack/react-table";
import { Search } from "lucide-react";
import React, { Dispatch, SetStateAction } from "react";
// 导入类型定义
import { Filter, TimeRange } from "./types";

interface DataTableFilterProps<T> {
  filter: Filter<T>;
  onFilterChange: (newFilter: Filter<T>) => void;
  searchTerm: string;
  setSearchTerm: Dispatch<SetStateAction<string>>;
  timeRange: TimeRange;
  setTimeRange: Dispatch<SetStateAction<TimeRange>>;
  table: Table<T>;
}

export default function DataTableFilter<T>({
  filter,
  onFilterChange,
  searchTerm,
  setSearchTerm,
  timeRange,
  setTimeRange,
  table,
}: DataTableFilterProps<T>) {
  /**
   * 处理筛选下拉框选项变化
   * @param optionId 筛选字段的 ID (对应数据类型 T 的 key)
   * @param value 选中的值
   */
  const handleFilterOptionChange = (
    optionId: keyof T | string, // 允许字符串类型的 key
    value: string | T[keyof T], // 值可以是 'all' 或具体类型的值
  ) => {
    if (!filter) return;

    const newFilter = { ...filter, filter: { ...filter.filter } }; // 深拷贝 filter

    // 如果选择 "all"，则从 filter 中删除该字段
    if (value === "all") {
      delete newFilter.filter[optionId as keyof T];
    } else {
      // 否则更新 filter 中对应字段的值
      newFilter.filter[optionId as keyof T] = value as T[keyof T];
    }

    onFilterChange(newFilter);
  };

  // 处理搜索输入变化
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchTerm(value);

    // 使用防抖来减少 API 请求次数（这里假设 onFilterChange 会触发 API 请求）
    // 可以使用 debounce 库或 setTimeout 实现
    const timeoutId = setTimeout(() => {
      if (filter) {
        const newFilter = { ...filter, search: value };
        onFilterChange(newFilter);
      }
    }, 500); // 500ms 防抖延迟

    return () => clearTimeout(timeoutId);
  };

  // 检查表格是否有时间列
  const hasTimeColumns = table
    .getAllColumns()
    .some((column) => column.id === "createdAt" || column.id === "updatedAt");

  return (
    <div className="flex flex-row items-center gap-2 flex-wrap">
      {/* 搜索框 */}
      <div className="flex items-center gap-1 w-96">
        <Search className="w-5 h-5 text-gray-500" />
        <Input
          placeholder="搜索..."
          className="max-w-7xl" // 限制最大宽度
          value={searchTerm} // 使用 value 使其受控
          onChange={handleSearchChange} // 更新内部状态并触发防抖回调
        />
      </div>

      <div className="grow"></div>

      {/* 筛选选项下拉框 */}
      <div className="flex flex-row gap-2 flex-wrap">
        {filter?.filterOptions?.map(
          (option: {
            id: keyof T | string;
            label: string;
            placeholder?: React.ReactNode;
            options: {
              label: string;
              value: string;
            }[];
          }) => (
            <div key={String(option.id)} className="min-w-[150px]">
              {" "}
              {/* 保证最小宽度 */}
              <Select
                onValueChange={(value) =>
                  handleFilterOptionChange(option.id, value)
                }
                // 将 defaultValue 改为 value
                value={
                  filter?.filter?.[option.id as keyof T]
                    ? String(filter.filter[option.id as keyof T])
                    : "all"
                }
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={option.placeholder || `${option.label} 筛选`}
                  />
                </SelectTrigger>
                <SelectContent>
                  {/* "全部" 选项 */}
                  <SelectItem value="all">{option.label} 全部</SelectItem>
                  {/* 渲染具体筛选选项 */}
                  {option.options.map(
                    (selection: { label: string; value: string }) => (
                      <SelectItem key={selection.value} value={selection.value}>
                        {selection.label} {/* 显示选项标签 */}
                      </SelectItem>
                    ),
                  )}
                </SelectContent>
              </Select>
            </div>
          ),
        )}
      </div>

      {/* 时间范围选择器，仅在存在时间列时显示 */}
      {hasTimeColumns && (
        <TimeRangePicker
          timeRange={timeRange}
          onTimeRangeChange={setTimeRange}
        />
      )}
    </div>
  );
}
