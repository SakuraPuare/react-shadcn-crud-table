"use client";

import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Edit, Trash2, Plus, Download } from "lucide-react";
import { useState } from "react";
import { Filter, Page } from "@/components/data-table/types";

// 示例数据类型
interface User {
  id: string;
  name: string;
  email: string;
  status: "active" | "inactive" | "pending";
  role: string;
  createdAt: string;
  lastLogin?: string;
}

// 示例数据
const sampleData: User[] = [
  {
    id: "1",
    name: "张三",
    email: "zhangsan@example.com",
    status: "active",
    role: "管理员",
    createdAt: "2024-01-15 10:30:00",
    lastLogin: "2024-01-20 14:20:00",
  },
  {
    id: "2",
    name: "李四",
    email: "lisi@example.com",
    status: "inactive",
    role: "编辑者",
    createdAt: "2024-01-10 09:15:00",
    lastLogin: "2024-01-18 11:45:00",
  },
  {
    id: "3",
    name: "王五",
    email: "wangwu@example.com",
    status: "pending",
    role: "用户",
    createdAt: "2024-01-22 16:00:00",
  },
  {
    id: "4",
    name: "赵六",
    email: "zhaoliu@example.com",
    status: "active",
    role: "编辑者",
    createdAt: "2024-01-08 13:25:00",
    lastLogin: "2024-01-21 09:30:00",
  },
  {
    id: "5",
    name: "钱七",
    email: "qianqi@example.com",
    status: "active",
    role: "用户",
    createdAt: "2024-01-25 11:10:00",
    lastLogin: "2024-01-25 15:20:00",
  },
];

export default function Home() {
  const [data, setData] = useState<User[]>(sampleData);
  const [page, setPage] = useState<Page>({
    pageNumber: 1,
    pageSize: 10,
    totalRow: sampleData.length,
  });
  const [filter, setFilter] = useState<Filter<User>>({
    filter: {},
    filterOptions: [],
    search: "",
    sort: "",
    page: 1,
    size: 10,
    startDateTime: null,
    endDateTime: null,
  });

  // 定义表格列
  const columns: ColumnDef<User>[] = [
    {
      id: "select",
      enableHiding: false,
      enableSorting: false,
    },
    {
      accessorKey: "name",
      id: "name",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 p-0 font-medium"
        >
          姓名
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("name")}</div>
      ),
    },
    {
      accessorKey: "email",
      id: "email",
      header: "邮箱",
      cell: ({ row }) => (
        <div className="text-muted-foreground">{row.getValue("email")}</div>
      ),
    },
    {
      accessorKey: "status",
      id: "status",
      header: "状态",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        const statusMap = {
          active: { label: "活跃", variant: "default" as const },
          inactive: { label: "非活跃", variant: "secondary" as const },
          pending: { label: "待审核", variant: "outline" as const },
        };
        const statusInfo = statusMap[status as keyof typeof statusMap];
        return <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>;
      },
    },
    {
      accessorKey: "role",
      id: "role",
      header: "角色",
    },
    {
      accessorKey: "createdAt",
      id: "createdAt",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 p-0 font-medium"
        >
          创建时间
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: "lastLogin",
      id: "lastLogin",
      header: "最后登录",
      cell: ({ row }) => {
        const lastLogin = row.getValue("lastLogin") as string;
        return lastLogin ? (
          <div>{lastLogin}</div>
        ) : (
          <div className="text-muted-foreground">从未登录</div>
        );
      },
    },
  ];

  // 处理编辑操作
  const handleEdit = (user: User) => {
    alert(`编辑用户: ${user.name}`);
  };

  // 处理删除操作
  const handleDelete = (user: User) => {
    if (confirm(`确定要删除用户 ${user.name} 吗？`)) {
      setData((prev) => prev.filter((item) => item.id !== user.id));
    }
  };

  // 处理批量删除
  const handleBatchDelete = (selectedRows: User[]) => {
    if (confirm(`确定要删除选中的 ${selectedRows.length} 个用户吗？`)) {
      const selectedIds = selectedRows.map((row) => row.id);
      setData((prev) => prev.filter((item) => !selectedIds.includes(item.id)));
    }
  };

  // 处理添加用户
  const handleAddUser = () => {
    alert("添加新用户功能");
  };

  // 处理导出数据
  const handleExport = () => {
    alert("导出数据功能");
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Data Table 组件演示</h1>
        <p className="text-muted-foreground">
          这是一个基于 React、Shadcn UI 和 TanStack Table
          构建的高级数据表格组件演示。
          支持排序、筛选、分页、行选择和自定义操作。
        </p>
      </div>

      <DataTable
        title="用户管理"
        description="管理系统中的所有用户账户"
        loading={false}
        columns={columns}
        data={data}
        actions={[
          {
            label: "编辑",
            icon: <Edit className="h-4 w-4" />,
            onClick: handleEdit,
          },
          {
            label: "删除",
            icon: <Trash2 className="h-4 w-4" />,
            onClick: handleDelete,
          },
        ]}
        page={page}
        onPageChange={(pageNum) => {
          setPage((prev) => ({ ...prev, pageNumber: pageNum }));
          setFilter((prev) => ({ ...prev, page: pageNum }));
        }}
        filter={filter}
        onFilterChange={setFilter}
        toolbars={[
          {
            label: "添加用户",
            icon: <Plus className="h-4 w-4" />,
            onClick: handleAddUser,
          },
          {
            label: "导出数据",
            icon: <Download className="h-4 w-4" />,
            onClick: handleExport,
          },
        ]}
        batchAction={[
          {
            label: "批量删除",
            icon: <Trash2 className="h-4 w-4" />,
            onClick: handleBatchDelete,
          },
        ]}
      />
    </div>
  );
}
