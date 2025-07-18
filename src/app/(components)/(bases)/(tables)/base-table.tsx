"use client";

import { Loader2, Table2Icon } from "lucide-react";
import Link from "next/link";

import { Pagination } from "@/app/(components)/(bases)/(pagination)/pagination";
import { Pagination as PaginationType } from "@/app/(types)/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

interface Column<T> {
  header: string;
  accessorKey: keyof T;
  className?: string;
  cell?: (value: T[keyof T], item: T) => React.ReactNode;
}

interface BaseTableProps<T> {
  data: T[];
  columns: Column<T>[];
  actions?: (item: T) => React.ReactNode;
  onRowClick?: (item: T) => void;
  title?: string;
  seeMoreLink?: string;
  emptyMessage?: string;
  loading?: boolean;
  onPaginationChange?: (value: PaginationType) => void;
  pagination?: PaginationType;
  totalItems?: number;
}

export interface BaseTableOptions {
  tableOptions: {
    page: PaginationType
    totalCount: number
  }
  onPaginationChange?: (value: PaginationType) => void
}

export function BaseTable<T>({
  data,
  columns,
  actions,
  onRowClick,
  title,
  seeMoreLink,
  emptyMessage = "Nenhum dado encontrado",
  loading = false,
  onPaginationChange,
  pagination,
  totalItems,
}: BaseTableProps<T>) {
  return (
    <div className="border-slate-200 dark:border-slate-700 rounded-md border bg-slate-50 dark:bg-slate-800 px-3 py-2 text-slate-950 dark:text-white">
      {title && (
        <div className="mb-4 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Table2Icon className="size-4" />
            <h1 className="text-base font-medium">{title}</h1>
          </div>
          {seeMoreLink && (
            <Link
              href={seeMoreLink}
              className="text-muted-foreground text-sm hover:underline"
            >
              Ver todos
            </Link>
          )}
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <Loader2 className="size-12 text-muted-foreground/50 mb-2 animate-spin" />
          <p className="text-muted-foreground text-sm">Carregando...</p>
        </div>
      ) : data.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <Table2Icon className="size-12 text-muted-foreground/50 mb-2" />
          <p className="text-muted-foreground text-sm">{emptyMessage}</p>
        </div>
      ) : (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((column) => (
                  <TableHead
                    key={String(column.accessorKey)}
                    className={column.className}
                  >
                    {column.header}
                  </TableHead>
                ))}
                {actions && <TableHead className="w-14"></TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item, index) => (
                <TableRow
                  key={index}
                  onClick={() => onRowClick?.(item)}
                  className={cn(
                    onRowClick && "cursor-pointer",
                    "animate-in fade-in-0 slide-in-from-bottom-2 duration-300",
                    `delay-${Math.min(index * 50, 500)}`
                  )}
                  style={{
                    animationDelay: `${index * 50}ms`,
                    animationFillMode: 'both'
                  }}
                >
                  {columns.map((column) => (
                    <TableCell
                      key={String(column.accessorKey)}
                      className={column.className}
                    >
                      {column.cell
                        ? column.cell(item[column.accessorKey], item)
                        : (item[column.accessorKey] as React.ReactNode)}
                    </TableCell>
                  ))}
                  {actions && (
                    <TableCell className="w-14">{actions(item)}</TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {pagination && totalItems && (
            <div className="mt-4">
              <Pagination
                page={pagination.page}
                limit={pagination.limit}
                total={totalItems || 0}
                onPageChange={onPaginationChange}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}