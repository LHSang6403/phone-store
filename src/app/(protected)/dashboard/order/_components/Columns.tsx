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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type {
  OrderType,
  ProductWithDescriptionAndStorageType,
  ProductWithQuantity,
} from "@utils/types";
import formatCurrency from "@utils/functions/formatCurrency";
import { toast } from "sonner";
import { updateStateOrder } from "@app/_actions/order";
import { PrintDialog } from "@/app/(protected)/dashboard/order/_components/PrintDialog";
import { useMemo, useCallback, useState } from "react";
import { printGHNOrder } from "@/app/_actions/GHNShipment";
import { ShipmentState } from "@utils/types/index";
import { useSession, SessionState } from "@/zustand/useSession";
import formatVNDate from "@/utils/functions/formatVNDate";

export const columns_headers = [
  { accessKey: "index", name: "STT" },
  { accessKey: "products", name: "Sản phẩm" },
  { accessKey: "price", name: "Giá tiền" },
  { accessKey: "state", name: "Tình trạng" },
  { accessKey: "ship", name: "Giao hàng" },
  { accessKey: "created_at", name: "Ngày tạo" },
  { accessKey: "customer_name", name: "Khách hàng" },
  { accessKey: "actions", name: "Hành động" },
];

export const columns: ColumnDef<OrderType>[] = [
  {
    accessorKey: "index",
    header: () => {
      return <div>STT</div>;
    },
    cell: ({ row }) => {
      const data = row.index + 1;

      return <div className="text-center">{data}</div>;
    },
  },
  {
    accessorKey: "products",
    header: "Sản phẩm",
    cell: ({ row }) => {
      const data = row.original;
      const products = data.products;

      const productsWithQuantities = useMemo(() => {
        const productQuantities: ProductWithQuantity[] = [];
        products?.forEach((product: ProductWithDescriptionAndStorageType) => {
          const existingProduct = productQuantities.find(
            (p) => p.product.product.id === product.product.id
          );

          if (existingProduct) {
            existingProduct.quantity += 1;
          } else {
            productQuantities.push({ product: product, quantity: 1 });
          }
        });

        return productQuantities;
      }, [products]);

      return (
        <div className="line-clamp-5 w-36 overflow-ellipsis md:w-auto">
          {productsWithQuantities.map((prod, index) => (
            <span key={index}>
              {prod.product.product.name} (x{prod.quantity})
              {index !== data.products.length - 1 && ", "}
            </span>
          ))}
        </div>
      );
    },
  },
  {
    accessorKey: "customer_name",
    header: "Khách hàng",
    cell: ({ row }) => {
      const data = row.original;

      return <div className="text-left">{data.customer_name}</div>;
    },
  },
  {
    accessorKey: "price",
    header: "Giá tiền",
    cell: ({ row }) => {
      const data = row.original;

      return <div className="">{formatCurrency(data.total_price)}</div>;
    },
  },
  {
    accessorKey: "state",
    header: () => {
      return <div className="ml-3 text-left">Tình trạng</div>;
    },
    cell: ({ row }) => {
      const data = row.original;
      const session = useSession() as SessionState;

      const handleUpdateState = useCallback(
        (newState: ShipmentState) => {
          toast.promise(
            async () => {
              if (!session.session)
                throw new Error("Không xác định phiên đăng nhập.");

              const result = await updateStateOrder({
                order: data,
                state: newState,
                actor: {
                  actorId: session.session?.id,
                  actorName: session.session?.name,
                },
              });

              if (result.error) throw new Error(result.error);
            },
            {
              loading: "Đang cập nhật đơn hàng...",
              success: "Cập nhật đơn hàng thành công!",
              error: (error: any) => {
                return error.message;
              },
            }
          );
        },
        [data, session.session]
      );

      return (
        <Select
          disabled={data.state !== "Đang chờ"}
          defaultValue={data.state ?? "Không rõ"}
          onValueChange={(value: ShipmentState) => {
            handleUpdateState(value);
          }}
        >
          <SelectTrigger className="w-28 border-none">
            <SelectValue placeholder="Chọn tình trạng" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Tình trạng</SelectLabel>
              <SelectItem value="Đang chờ">Đang chờ</SelectItem>
              <SelectItem value="Đang giao">Đang giao</SelectItem>
              <SelectItem value="Đã giao">Đã giao</SelectItem>
              <SelectItem value="Đã hủy">Đã hủy</SelectItem>
              <SelectItem value="Đã trả hàng">Đã trả hàng</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      );
    },
  },
  {
    accessorKey: "ship",
    header: "Giao hàng",
    cell: ({ row }) => {
      const data = row.original;

      return <div className="">{data.shipment_name}</div>;
    },
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => {
      return (
        <div className="center w-32 border-none">
          <Button
            className="border-none"
            variant="outline"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Ngày tạo
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      const data = row.original;
      const date = new Date(data.created_at);

      return <div className="w-32 text-center">{formatVNDate(date)}</div>;
    },
  },
  {
    id: "actions",
    header: () => {
      return <div className="w-full text-center">Hành động</div>;
    },
    cell: ({ row }) => {
      const data = row.original;
      const session = useSession() as SessionState;

      const [isPrintOpen, setIsPrintOpen] = useState(false);
      const [printResult, setPrintResult] = useState("");

      const handlePrint = useCallback(
        async ({
          label_code,
          size,
        }: {
          label_code: string;
          size: "A5" | "80x80" | "52x70";
        }) => {
          const print = await printGHNOrder({
            order_codes: [label_code],
            size: size,
          });

          setPrintResult(print.data);
        },
        []
      );

      const handleCancelOrder = useCallback(() => {
        toast.promise(
          async () => {
            if (!session.session)
              throw new Error("Không xác định phiên đăng nhập.");

            const result = await updateStateOrder({
              order: data,
              state: "Đã hủy",
              actor: {
                actorId: session.session?.id,
                actorName: session.session?.name,
              },
            });

            if (result.error) throw new Error(result.error);
          },
          {
            loading: "Đang cập nhật đơn hàng...",
            success: "Cập nhật đơn hàng thành công!",
            error: (error: any) => {
              return error.message;
            },
          }
        );
      }, [data, session.session]);

      return (
        <div className="center w-full">
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
                Sao chép ID đơn hàng
              </DropdownMenuItem>
              <DropdownMenuItem
                disabled={data.state !== "Đang chờ"}
                onClick={() => {
                  handleCancelOrder();
                }}
              >
                Hủy đơn
              </DropdownMenuItem>
              <DropdownMenuItem
                disabled={data.shipment_name == "GHTK"} // because do not have api for this
                onClick={() => {
                  setIsPrintOpen(!isPrintOpen);
                  handlePrint({
                    label_code: data.shipment_label_code!,
                    size: "A5",
                  });
                }}
              >
                In khổ A5
              </DropdownMenuItem>
              <DropdownMenuItem
                disabled={data.shipment_name == "GHTK"}
                onClick={() => {
                  setIsPrintOpen(!isPrintOpen);
                  handlePrint({
                    label_code: data.shipment_label_code!,
                    size: "80x80",
                  });
                }}
              >
                In khổ 80x80
              </DropdownMenuItem>
              <DropdownMenuItem
                disabled={data.shipment_name == "GHTK"}
                onClick={() => {
                  setIsPrintOpen(!isPrintOpen);
                  handlePrint({
                    label_code: data.shipment_label_code!,
                    size: "52x70",
                  });
                }}
              >
                In khổ 52x70
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <PrintDialog
            content={printResult.toString()}
            isOpen={isPrintOpen}
            onOpenChange={(value) => {
              setIsPrintOpen(value);
            }}
          />
        </div>
      );
    },
  },
];
