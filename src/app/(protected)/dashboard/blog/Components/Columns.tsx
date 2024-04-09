"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BlogType } from "@utils/types";
import Link from "next/link";
import { toast } from "sonner";
import { useSession } from "@/zustand/useSession";
import { deleteBlogById } from "@app/_actions/blog";
import formatVNDate from "@utils/functions/formatVNDate";

export const columns_headers = [
  { accessKey: "title", name: "Tiêu đề" },
  { accessKey: "description", name: "Mô tả" },
  { accessKey: "created_at", name: "Ngày tạo" },
  { accessKey: "writer", name: "Tác giả" },
  { accessKey: "actions", name: "Hành động" },
];

export const columns: ColumnDef<BlogType>[] = [
  {
    accessorKey: "title",
    header: "Tiêu đề",
    cell: ({ row }) => {
      const data = row.original;

      return (
        <div className="line-clamp-2 max-w-60 overflow-ellipsis lg:line-clamp-3 lg:w-32">
          {data.title}
        </div>
      );
    },
  },
  {
    accessorKey: "description",
    header: "Mô tả",
    cell: ({ row }) => {
      const data = row.original;

      return (
        <div className="line-clamp-2 max-w-52 overflow-ellipsis lg:line-clamp-3 lg:w-32">
          {data.description}
        </div>
      );
    },
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => {
      return (
        <div className="flex w-32 items-center justify-center border-none">
          <Button
            variant="outline"
            className="border-none"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Ngày tạo
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      const date = new Date(row.getValue("created_at"));
      const formatted = formatVNDate(date);

      return <div className="w-32 text-center">{formatted}</div>;
    },
  },
  {
    accessorKey: "writer",
    header: "Tác giả",
  },
  {
    id: "actions",
    header: () => {
      return <div className="w-full text-center">Hành động</div>;
    },
    cell: ({ row }) => {
      const data = row.original;
      const session = useSession();

      async function removeHandler(blog: BlogType) {
        toast.promise(
          async () => {
            if (!session.session)
              throw new Error("Không thể xác định phiên đăng nhập.");
            await deleteBlogById({
              blog: blog,
              actor: {
                actorId: session.session.id,
                actorName: session.session.name,
              },
            });
          },
          {
            success: "Xóa bài viết thành công",
            loading: "Đang xóa bài viết...",
            error: (error: any) => {
              return error.message;
            },
          }
        );
      }

      return (
        <div className="flex w-full items-center justify-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Hành động</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(data.id)}
              >
                Sao chép ID bài viết
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href={"/dashboard/blog/" + data.id}>
                  Chỉnh sửa bài viết
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => removeHandler(data)}>
                Xóa bài viết
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
