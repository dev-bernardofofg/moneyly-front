import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  page: number;
  limit: number;
  total: number;
  onPageChange?: (pagination: { page: number; limit: number }) => void;
}

export function Pagination({ page, limit, total, onPageChange }: PaginationProps) {
  const totalPages = Math.ceil(total / limit);
  const startItem = (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, total);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      onPageChange?.({ page: newPage, limit });
    }
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-4 py-4">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>
          {startItem}-{endItem} de {total}
        </span>
      </div>

      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(page - 1)}
          disabled={page <= 1}
        >
          <ChevronLeft className="size-4" />
        </Button>

        <div className="flex items-center gap-1">
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let pageNumber;
            if (totalPages <= 5) {
              pageNumber = i + 1;
            } else if (page <= 3) {
              pageNumber = i + 1;
            } else if (page >= totalPages - 2) {
              pageNumber = totalPages - 4 + i;
            } else {
              pageNumber = page - 2 + i;
            }

            return (
              <Button
                key={pageNumber}
                variant={page === pageNumber ? "default" : "outline"}
                size="sm"
                onClick={() => handlePageChange(pageNumber)}
                className="w-8 h-8 p-0"
              >
                {pageNumber}
              </Button>
            );
          })}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(page + 1)}
          disabled={page >= totalPages}
        >
          <ChevronRight className="size-4" />
        </Button>
      </div>
    </div>
  );
} 