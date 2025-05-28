# React Shadcn DATA Table 使用示例

这是一个展示如何使用 `react-shadcn-data-table` 库的完整示例项目。

## 功能特性

这个示例展示了以下功能：

- 🔍 **搜索和筛选** - 全文搜索、列筛选功能
- 📄 **分页** - 支持自定义页面大小和页码跳转  
- 🔄 **排序** - 多列排序，支持升序/降序
- ✅ **行选择** - 单选、多选、批量操作
- 🎨 **自定义样式** - 基于 Tailwind CSS，完全可定制
- 📱 **响应式设计** - 适配移动端和桌面端
- 🛠️ **行操作** - 查看、编辑、删除等操作
- 🔧 **工具栏** - 添加、导入、设置等工具栏按钮
- 📊 **批量操作** - 批量导出、删除、发送邮件等

## 快速开始

1. 安装依赖：

```bash
npm install
# 或
yarn install
```

2. 启动开发服务器：

```bash
npm run dev
# 或
yarn dev
```

3. 在浏览器中打开 [http://localhost:3000](http://localhost:3000) 查看效果。

## 代码说明

### 数据结构

示例使用了一个用户管理的场景，数据结构如下：

```typescript
interface User {
  id: string;
  name: string;
  email: string;
  status: 'active' | 'inactive';
  role: 'admin' | 'user' | 'editor';
  createdAt: string;
}
```

### 主要组件配置

#### 列定义 (Columns)

```typescript
const columns: ColumnDef<User>[] = [
  {
    accessorKey: 'name',
    header: '姓名',
  },
  {
    accessorKey: 'status',
    header: '状态',
    cell: ({ row }) => (
      // 自定义单元格渲染
    ),
  },
  // 更多列定义...
];
```

#### 行操作 (Actions)

```typescript
const actions = [
  {
    label: '查看',
    icon: <Eye className="h-4 w-4" />,
    onClick: (row: User) => {
      // 处理查看操作
    },
  },
  // 更多操作...
];
```

#### 工具栏按钮 (Toolbars)

```typescript
const toolbars = [
  {
    label: '添加用户',
    icon: <Plus className="h-4 w-4" />,
    onClick: () => {
      // 处理添加操作
    },
  },
  // 更多工具栏按钮...
];
```

#### 批量操作 (Batch Actions)

```typescript
const batchActions = [
  {
    label: '批量导出',
    icon: <Download className="h-4 w-4" />,
    onClick: (selectedRows: User[]) => {
      // 处理批量导出
    },
  },
  // 更多批量操作...
];
```

## 主要文件

- `src/app/page.tsx` - 主页面组件，展示表格的完整使用
- `src/app/globals.css` - 全局样式，包含 shadcn/ui 所需的 CSS 变量
- `tailwind.config.ts` - Tailwind CSS 配置
- `package.json` - 项目依赖配置

## 库依赖

此示例依赖以下核心库：

- `react-shadcn-data-table` - 主要的表格组件库
- `@tanstack/react-table` - 底层表格逻辑
- `lucide-react` - 图标库
- `tailwindcss` - CSS 框架

## 自定义开发

你可以基于此示例进行自定义开发：

1. 修改数据结构以适应你的业务场景
2. 自定义列定义和单元格渲染
3. 添加或修改行操作、工具栏按钮和批量操作
4. 调整样式和主题配置

## 了解更多

- [React Shadcn DATA Table 文档](../README.md)
- [TanStack Table 文档](https://tanstack.com/table)
- [Shadcn/ui 文档](https://ui.shadcn.com/)
- [Tailwind CSS 文档](https://tailwindcss.com/)

## 许可证

本示例项目采用 MIT 许可证。
