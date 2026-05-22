import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

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
    <nav aria-label="Paginação" className="grid grid-cols-3 gap-4 p-2 items-center">
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Total de {total} ocorrencias</span>
      </div>

      <div className="flex  gap-1 justify-center">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(page - 1)}
          className="size-8 p-0 text-xs"
          disabled={page <= 1}
          aria-label="Página anterior"
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
                variant={page === pageNumber ? 'default' : 'outline'}
                size="sm"
                onClick={() => handlePageChange(pageNumber)}
                className="size-8 p-0 text-xs"
                aria-label={`Página ${pageNumber}`}
                aria-current={page === pageNumber ? 'page' : undefined}
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
          className="size-8 p-0 text-xs"
          aria-label="Próxima página"
        >
          <ChevronRight className="size-4" />
        </Button>
      </div>

      <div className="flex justify-end gap-2">
        <span className="text-sm text-muted-foreground">
          {' '}
          {startItem}-{endItem} de {total}{' '}
        </span>
      </div>
    </nav>
  );
}
