import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// 定义 Page 接口
interface Page {
  pageNumber?: number;
  pageSize?: number;
  totalPage?: number;
  totalRow?: number;
}

interface DataPaginationProps {
  page: Page;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
}

export default function DataPagination({
  page,
  onPageChange,
  onPageSizeChange,
}: DataPaginationProps) {
  const { pageNumber = 1, pageSize = 10, totalPage = 1, totalRow = 0 } = page;
  const pages = Array.from({ length: totalPage }, (_, i) => i + 1);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPage) return;
    onPageChange(page);
  };

  const handlePageSizeChange = (value: string) => {
    onPageSizeChange?.(Number(value));
  };

  const renderPageNumbers = () => {
    const items = [];
    const showEllipsis = totalPage > 7;

    if (showEllipsis) {
      // Always show first page
      items.push(
        <PaginationItem key={1}>
          <PaginationLink
            href="#"
            onClick={() => handlePageChange(1)}
            isActive={pageNumber === 1}
          >
            1
          </PaginationLink>
        </PaginationItem>,
      );

      // Show ellipsis if not near start
      if (pageNumber > 4) {
        items.push(
          <PaginationItem key="ellipsis-1">
            <PaginationEllipsis />
          </PaginationItem>,
        );
      }

      // Show current page and neighbors
      for (
        let i = Math.max(2, pageNumber - 2);
        i <= Math.min(totalPage - 1, pageNumber + 2);
        i++
      ) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              href="#"
              onClick={() => handlePageChange(i)}
              isActive={pageNumber === i}
            >
              {i}
            </PaginationLink>
          </PaginationItem>,
        );
      }

      // Show ellipsis if not near end
      if (pageNumber < totalPage - 3) {
        items.push(
          <PaginationItem key="ellipsis-2">
            <PaginationEllipsis />
          </PaginationItem>,
        );
      }

      // Always show last page
      if (totalPage > 1) {
        items.push(
          <PaginationItem key={totalPage}>
            <PaginationLink
              href="#"
              onClick={() => handlePageChange(totalPage)}
              isActive={pageNumber === totalPage}
            >
              {totalPage}
            </PaginationLink>
          </PaginationItem>,
        );
      }
    } else {
      // Show all pages if total pages <= 7
      pages.forEach((page) => {
        items.push(
          <PaginationItem key={page}>
            <PaginationLink
              href="#"
              onClick={() => handlePageChange(page)}
              isActive={pageNumber === page}
            >
              {page}
            </PaginationLink>
          </PaginationItem>,
        );
      });
    }

    return items;
  };

  return (
    <div className="flex items-center relative py-2">
      {/* 左侧信息 */}
      <div className="text-sm text-muted-foreground text-nowrap z-10">
        <span className="mr-2">共 {totalRow} 条记录</span>
      </div>

      {/* 中间分页，绝对定位确保视觉居中 */}
      <div className="absolute left-0 right-0 flex justify-center items-center pointer-events-none">
        <div className="pointer-events-auto">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={() => handlePageChange(pageNumber - 1)}
                  aria-disabled={pageNumber === 1}
                />
              </PaginationItem>

              {renderPageNumbers()}

              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={() => handlePageChange(pageNumber + 1)}
                  aria-disabled={pageNumber === totalPage}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>

      {/* 右侧下拉框，推到右边 */}
      <div className="ml-auto z-10">
        <Select value={String(pageSize)} onValueChange={handlePageSizeChange}>
          <SelectTrigger className="w-[100px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="10">10 条/页</SelectItem>
            <SelectItem value="20">20 条/页</SelectItem>
            <SelectItem value="50">50 条/页</SelectItem>
            <SelectItem value="100">100 条/页</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
