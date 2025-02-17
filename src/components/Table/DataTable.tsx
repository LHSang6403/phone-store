"use client";

import { useState } from "react";
import {
  ColumnDef,
  flexRender,
  SortingState,
  VisibilityState,
  ColumnFiltersState,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTablePagination } from "./Pagination";
import { cn } from "@/lib/utils";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  isPaginationEnabled?: boolean;
  isCollumnVisibilityEnabled?: boolean;
  isSearchEnabled?: boolean;
  searchAttribute?: string;
  searchPlaceholder?: string;
  isBorder?: boolean;
  isSeparator?: boolean;
  defaultPageSize?: number;
  columns_headers?: {
    accessKey: string;
    name: string;
  }[];
  className?: string;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  isPaginationEnabled = true,
  isCollumnVisibilityEnabled = true,
  isSearchEnabled = true,
  searchAttribute = "name",
  searchPlaceholder = "Tìm kiếm...",
  isBorder = true,
  isSeparator = true,
  defaultPageSize = 10,
  columns_headers,
  className = "",
}: DataTableProps<TData, TValue>) {
  // const [sorting, setSorting] = useState<SortingState>([
  //   {
  //     id: "created_at",
  //     desc: true,
  //   },
  // ]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const table = useReactTable({
    data,
    columns,
    initialState: {
      pagination: {
        pageSize: defaultPageSize,
      },
    },
    state: {
      // sorting,
      columnFilters,
      columnVisibility,
    },
    // onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <>
      {/* Filters */}
      <div className="mb-2 flex items-center justify-between gap-2 md:mb-4 md:gap-4">
        {isSearchEnabled && (
          <Input
            placeholder={searchPlaceholder}
            value={
              (table.getColumn(searchAttribute)?.getFilterValue() as string) ??
              ""
            }
            onChange={(event) =>
              table
                .getColumn(searchAttribute)
                ?.setFilterValue(event.target.value)
            }
            className="max-w-52 border border-[#E5E7EB]"
          />
        )}

        {/* Column visibility */}
        {isCollumnVisibilityEnabled && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto outline-none ring-0">
                Chọn cột
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {columns_headers?.find(
                        (col_hed) => col_hed.accessKey === column.id
                      )?.name ?? column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {/* Table */}
      <div
        className={cn(
          `w-full rounded-md ${isBorder ? "border" : "border-none"}`,
          className
        )}
      >
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className={`${isSeparator ? "" : "border-none"}`}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 w-full text-center"
                >
                  Không có dữ liệu
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {isPaginationEnabled && (
        <div className="my-4">
          <DataTablePagination table={table} />
        </div>
      )}
    </>
  );
}
