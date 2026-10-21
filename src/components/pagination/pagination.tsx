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

  const pageNumbers = Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
    if (totalPages <= 5) return i + 1;
    if (page <= 3) return i + 1;
    if (page >= totalPages - 2) return totalPages - 4 + i;
    return page - 2 + i;
  });

  return (
    <nav
      aria-label="Paginação"
      className="flex flex-col items-center gap-2 px-3 py-2 sm:grid sm:grid-cols-[1fr_auto_1fr] sm:gap-4"
    >
      {/* Info à esquerda — só desktop */}
      <span className="hidden text-sm text-muted-foreground sm:block">
        Total de {total} ocorrências
      </span>

      {/* Controles — sempre ao centro */}
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(page - 1)}
          className="size-9 shrink-0 p-0 sm:size-8"
          disabled={page <= 1}
          aria-label="Página anterior"
        >
          <ChevronLeft className="size-4" />
        </Button>

        {/* Botões numéricos — só desktop */}
        <div className="hidden items-center gap-1 sm:flex">
          {pageNumbers.map((pageNumber) => (
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
          ))}
        </div>

        {/* Indicador compacto — só mobile */}
        <span className="px-2 text-sm font-medium tabular-nums sm:hidden">
          {page} / {totalPages}
        </span>

        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(page + 1)}
          disabled={page >= totalPages}
          className="size-9 shrink-0 p-0 sm:size-8"
          aria-label="Próxima página"
        >
          <ChevronRight className="size-4" />
        </Button>
      </div>

      {/* Range — centralizado no mobile, à direita no desktop */}
      <span className="text-xs text-muted-foreground tabular-nums sm:text-right sm:text-sm">
        {startItem}–{endItem} de {total}
      </span>
    </nav>
  );
}
