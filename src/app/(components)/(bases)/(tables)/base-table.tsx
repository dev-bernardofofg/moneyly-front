"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Loader2, Table2Icon } from "lucide-react";
import Link from "next/link";

import { Pagination } from "@/app/(components)/(bases)/(pagination)/pagination";
import { PaginationType } from "@/app/(types)/pagination.type";
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
}

export interface BaseTableOptions {
  tableOptions: {
    pagination: PaginationType
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
}: BaseTableProps<T>) {

  return (
    <div className="border-slate-200 dark:border-slate-700 rounded-md border bg-slate-50 dark:bg-slate-800 px-3 py-2 text-slate-950 dark:text-white min-h-[calc(100dvh-6rem)] relative">
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
        <AnimatePresence mode="wait">
          <motion.div
            key={JSON.stringify(data)}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{
              duration: 0.4,
              ease: [0.4, 0, 0.2, 1],
              staggerChildren: 0.05
            }}
            className="w-full"
          >
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
                {data.map((item: any, index: number) => (
                  <motion.tr
                    key={`${JSON.stringify(item)}-${index}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.3,
                      delay: index * 0.05,
                      ease: [0.4, 0, 0.2, 1]
                    }}
                    onClick={() => onRowClick?.(item)}
                    className={cn(
                      onRowClick && "cursor-pointer",
                      "hover:bg-muted/50 transition-colors"
                    )}
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
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          </motion.div>
        </AnimatePresence>
      )}

      {pagination && pagination.totalPages && pagination.totalPages > 1 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          className="absolute bottom-0 right-1/2 translate-x-1/2"
        >
          <Pagination
            page={pagination.page}
            limit={pagination.limit}
            total={pagination.total || 0}
            onPageChange={(pagination) => onPaginationChange?.(pagination as PaginationType)}
          />
        </motion.div>
      )}
    </div>
  );
}