"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import formatCurrency from "@utils/functions/formatCurrency";
import type { ProductType } from "@utils/types/index";

export default function Product({ data }: { data: ProductType }) {
  const router = useRouter();

  return (
    <div
      onClick={() => router.push(`/product/${data.id}`)}
      className="z-10 h-full w-48 overflow-hidden rounded-[12px] rounded-br-[28px] rounded-tl-[28px] border border-accent bg-background from-[#9633ed51] via-[#f22b9c4c] to-[#fd7c3654] text-foreground/90 transition duration-300 ease-in-out hover:scale-[1.02] hover:cursor-pointer hover:border-none hover:bg-background/80 hover:bg-gradient-to-r hover:text-foreground hover:shadow-xl sm:h-fit sm:w-full"
    >
      <div className="h-36 w-48 sm:h-fit sm:w-full">
        <Image
          alt={data.name}
          src={
            process.env.NEXT_PUBLIC_SUPABASE_URL +
            "/storage/v1/object/public/public_files/" +
            data.images[0]
          }
          className="!w-full"
          width={200}
          height={200}
        />
      </div>
      <div className="h-fit w-full px-4 pb-3 pt-1">
        <h3 className="sm:text-md line-clamp-1 overflow-ellipsis text-center font-medium">
          {data.brand}
        </h3>
        <h2 className="line-clamp-1 overflow-ellipsis text-lg font-semibold">
          {data.name}
        </h2>
        <div className="flex w-full flex-row items-center justify-between">
          <div className="flex flex-row items-center text-yellow-500">
            <p className="text-sm">{data.rate}</p>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-3.5 w-3.5"
            >
              <path
                fill-rule="evenodd"
                d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
          <p className="text-md">{formatCurrency(data.price)}</p>
        </div>
      </div>
    </div>
  );
}
