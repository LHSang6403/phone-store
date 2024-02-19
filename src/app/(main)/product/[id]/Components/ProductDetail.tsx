import Decoration from "./Decoration";
import Title from "./Title";
import ProductActions from "./ProductActions";
import ProductImages from "./ProductImages";
import type { ProductWithDescriptionAndStorageType } from "@utils/types/index";

export default function ProductDetail({
  product,
}: {
  product: ProductWithDescriptionAndStorageType;
}) {
  return (
    <div className="min-h-[90vh] h-fit pb-6 relative flex flex-row xl:flex-col">
      <div className="absolute w-[60%] h-[75%] -z-10 ml-12 xl:ml-6 sm:ml-0 rounded-2xl transform -skew-x-[20deg] bg-gradient-to-r from-foreground/5 to-hsl(222.2, 84%, 4%)"></div>
      <div className="w-1/2 xl:w-full h-fit pl-10 xl:p-0 sm:px-2">
        <ProductImages images={product.images} />
      </div>
      <div className="w-1/2 xl:w-[80%] lg:w-[90%] sm:w-full pt-28 xl:pt-10 lg:pt-0 px-6 xl:mx-auto flex flex-col gap-4">
        <ProductActions product={product} />
      </div>
      <Decoration />
      <Title brand={product.brand} name={product.name} />
    </div>
  );
}
