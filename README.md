# React Shadcn Data Table

一个基于 React、Shadcn UI 和 TanStack Table 的高级数据表格组件，支持排序、筛选、分页、行选择和自定义操作。

[![npm version](https://badge.fury.io/js/react-shadcn-data-table.svg)](https://badge.fury.io/js/react-shadcn-data-table)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 🚀 功能特性

- 🔍 **搜索和筛选** - 全文搜索、列筛选、时间范围选择
- 📄 **分页** - 支持自定义页面大小和页码跳转
- 🔄 **排序** - 多列排序，支持升序/降序
- ✅ **行选择** - 单选、多选、批量操作
- 🎨 **自定义样式** - 基于 Tailwind CSS，完全可定制
- 📱 **响应式设计** - 适配移动端和桌面端
- 🔧 **TypeScript 支持** - 完整的类型定义
- ⚡ **高性能** - 基于 TanStack Table 的虚拟化
- 🎭 **主题支持** - 支持亮色/暗色主题
- 🛠️ **易于扩展** - 灵活的 API 设计

## 📦 安装

```bash
npm install react-shadcn-data-table
# 或
yarn add react-shadcn-data-table
# 或
pnpm add react-shadcn-data-table
```

## 🔧 依赖要求

### Peer Dependencies (必须安装)

```bash
npm install react@">=18.0.0" react-dom@">=18.0.0" tailwindcss@"^3.0.0 || ^4.0.0"
```

### 主要依赖

本包包含以下核心依赖，无需单独安装：

- `@tanstack/react-table` - 表格核心逻辑
- `@radix-ui/*` - UI 基础组件
- `lucide-react` - 图标库
- `date-fns` - 日期处理
- `react-day-picker` - 日期选择器
- `clsx` & `tailwind-merge` - 样式工具
- `class-variance-authority` - 变体管理

## 🎨 样式设置

确保您的项目已配置 Tailwind CSS。在您的 `tailwind.config.js` 中添加以下配置：

```js
// tailwind.config.js
module.exports = {
  content: [
    // ... 其他路径
    "./node_modules/react-shadcn-data-table/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        // ... 更多颜色变量
      },
    },
  },
  plugins: [],
}
```

并在您的 CSS 文件中添加 CSS 变量：

```css
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    --primary: 222.2 47.4% 11.2%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96%;
    --secondary-foreground: 222.2 84% 4.9%;
    --muted: 210 40% 96%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96%;
    --accent-foreground: 222.2 84% 4.9%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 222.2 84% 4.9%;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    /* ... 暗色主题变量 */
  }
}
```

## 🚀 快速开始

### 基本使用

```tsx
import { DataTable } from 'react-shadcn-data-table';
import { ColumnDef } from '@tanstack/react-table';

interface User {
  id: string;
  name: string;
  email: string;
  status: 'active' | 'inactive';
}

const columns: ColumnDef<User>[] = [
  {
    accessorKey: 'name',
    header: '姓名',
  },
  {
    accessorKey: 'email',
    header: '邮箱',
  },
  {
    accessorKey: 'status',
    header: '状态',
    cell: ({ row }) => (
      <span className={row.getValue('status') === 'active' ? 'text-green-600' : 'text-red-600'}>
        {row.getValue('status') === 'active' ? '活跃' : '非活跃'}
      </span>
    ),
  },
];

const data: User[] = [
  {
    id: '1',
    name: '张三',
    email: 'zhangsan@example.com',
    status: 'active',
  },
  // 更多数据...
];

function App() {
  return (
    <DataTable
      title="用户列表"
      columns={columns}
      data={data}
      loading={false}
    />
  );
}
```

## 📖 高级功能

### 分页

```tsx
import { useState } from 'react';
import { DataTable, Page } from 'react-shadcn-data-table';

function App() {
  const [page, setPage] = useState<Page>({
    pageNumber: 1,
    pageSize: 10,
    totalRow: 100,
  });

  return (
    <DataTable
      // ... 其他属性
      page={page}
      onPageChange={(pageNum) => 
        setPage(prev => ({ ...prev, pageNumber: pageNum }))
      }
    />
  );
}
```

### 筛选和搜索

```tsx
import { useState } from 'react';
import { DataTable, Filter } from 'react-shadcn-data-table';

function App() {
  const [filter, setFilter] = useState<Filter<User>>({
    filter: {},
    filterOptions: [
      {
        id: 'status',
        label: '状态',
        options: [
          { label: '活跃', value: 'active' },
          { label: '非活跃', value: 'inactive' },
        ],
      },
    ],
    search: '',
    sort: '',
    page: 1,
    size: 10,
    startDateTime: null,
    endDateTime: null,
  });

  return (
    <DataTable
      // ... 其他属性
      filter={filter}
      onFilterChange={setFilter}
    />
  );
}
```

### 行操作

```tsx
import { Edit, Trash, Eye } from 'lucide-react';

<DataTable
  // ... 其他属性
  actions={[
    {
      label: '查看',
      icon: <Eye className="h-4 w-4" />,
      onClick: (row) => console.log('查看', row),
    },
    {
      label: '编辑',
      icon: <Edit className="h-4 w-4" />,
      onClick: (row) => console.log('编辑', row),
    },
    {
      label: '删除',
      icon: <Trash className="h-4 w-4" />,
      onClick: (row) => console.log('删除', row),
      variant: 'destructive',
    },
  ]}
/>
```

### 批量操作

```tsx
import { Trash, Download, Mail } from 'lucide-react';

<DataTable
  // ... 其他属性
  batchAction={[
    {
      label: '批量导出',
      icon: <Download className="h-4 w-4" />,
      onClick: (selectedRows) => console.log('导出', selectedRows),
    },
    {
      label: '发送邮件',
      icon: <Mail className="h-4 w-4" />,
      onClick: (selectedRows) => console.log('发送邮件给', selectedRows),
    },
    {
      label: '批量删除',
      icon: <Trash className="h-4 w-4" />,
      onClick: (selectedRows) => console.log('删除', selectedRows),
      variant: 'destructive',
    },
  ]}
/>
```

### 工具栏按钮

```tsx
import { Plus, Upload, Settings } from 'lucide-react';

<DataTable
  // ... 其他属性
  toolbars={[
    {
      label: '添加用户',
      icon: <Plus className="h-4 w-4" />,
      onClick: () => console.log('添加用户'),
    },
    {
      label: '导入数据',
      icon: <Upload className="h-4 w-4" />,
      onClick: () => console.log('导入数据'),
      variant: 'outline',
    },
    {
      label: '设置',
      icon: <Settings className="h-4 w-4" />,
      onClick: () => console.log('设置'),
      variant: 'ghost',
    },
  ]}
/>
```

## 📋 API 参考

### DataTable Props

| 属性 | 类型 | 必需 | 默认值 | 描述 |
|------|------|------|--------|------|
| `title` | `string` | ✅ | - | 表格标题 |
| `columns` | `ColumnDef<T>[]` | ✅ | - | 列定义（TanStack Table 格式） |
| `data` | `T[]` | ✅ | - | 表格数据 |
| `loading` | `boolean` | ✅ | - | 加载状态 |
| `description` | `React.ReactNode` | ❌ | - | 表格描述 |
| `page` | `Page` | ❌ | - | 分页信息 |
| `onPageChange` | `(page: number) => void` | ❌ | - | 页码变化回调 |
| `filter` | `Filter<T>` | ❌ | - | 筛选配置 |
| `onFilterChange` | `(filter: Filter<T>) => void` | ❌ | - | 筛选变化回调 |
| `actions` | `Action[]` | ❌ | - | 行操作按钮 |
| `toolbars` | `Toolbar[]` | ❌ | - | 工具栏按钮 |
| `batchAction` | `BatchAction[]` | ❌ | - | 批量操作按钮 |

### 类型定义

```typescript
interface Page {
  pageNumber?: number;
  pageSize?: number;
  totalPage?: number;
  totalRow?: number;
}

interface Filter<T> {
  filter: { [key in keyof T]?: T[key] };
  filterOptions: FilterOption<T>[];
  search: string | null;
  sort: string | null;
  startDateTime: string | null;
  endDateTime: string | null;
  page?: number;
  size?: number;
}

interface FilterOption<T> {
  id: keyof T;
  label: string;
  placeholder?: React.ReactNode;
  options: { label: string; value: string }[];
}

interface Action {
  label: string;
  icon?: React.ReactNode;
  onClick: (row: any) => void;
  variant?: 'default' | 'destructive' | 'outline' | 'ghost';
}

interface Toolbar {
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  variant?: 'default' | 'destructive' | 'outline' | 'ghost';
}

interface BatchAction {
  label: string;
  icon?: React.ReactNode;
  onClick: (selectedRows: any[]) => void;
  variant?: 'default' | 'destructive' | 'outline' | 'ghost';
}
```

## 🎨 自定义主题

### 使用 CSS 变量

您可以通过修改 CSS 变量来自定义主题：

```css
:root {
  --primary: 200 100% 50%; /* 自定义主色调 */
  --primary-foreground: 0 0% 100%;
  /* 更多变量... */
}
```

### 使用 Tailwind 类名

大多数组件都支持通过 `className` 属性自定义样式：

```tsx
<DataTable
  className="border-2 border-blue-500"
  // ... 其他属性
/>
```

## 🔧 开发

```bash
# 克隆项目
git clone https://github.com/sakurapuare/react-shadcn-data-table.git

# 安装依赖
cd react-shadcn-data-table
npm install

# 启动开发服务器
npm run dev

# 构建库
npm run build:lib

# 运行测试
npm test
```

## 🤝 贡献

我们欢迎所有形式的贡献！请查看 [贡献指南](CONTRIBUTING.md) 了解更多信息。

### 贡献类型

- 🐛 Bug 报告
- 💡 功能建议
- 📖 文档改进
- 🧪 测试用例
- 💻 代码贡献

## 📄 许可证

本项目采用 [MIT 许可证](LICENSE)。

## 🙏 致谢

- [TanStack Table](https://tanstack.com/table) - 强大的表格库
- [Radix UI](https://radix-ui.com/) - 无障碍 UI 组件
- [Tailwind CSS](https://tailwindcss.com/) - 实用优先的 CSS 框架
- [Lucide](https://lucide.dev/) - 美观的图标库

## 📈 更新日志

查看 [CHANGELOG.md](CHANGELOG.md) 了解详细的版本更新信息。

## 🆘 支持

如果您在使用过程中遇到问题：

1. 查看 [FAQ](docs/FAQ.md)
2. 搜索 [现有 Issues](https://github.com/sakurapuare/react-shadcn-data-table/issues)
3. 创建 [新 Issue](https://github.com/sakurapuare/react-shadcn-data-table/issues/new)

## ⭐ Star History

如果这个项目对您有帮助，请考虑给它一个 ⭐！

[![Star History Chart](https://api.star-history.com/svg?repos=sakurapuare/react-shadcn-data-table&type=Date)](https://star-history.com/#sakurapuare/react-shadcn-data-table&Date)
