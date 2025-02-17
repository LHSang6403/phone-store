"use client";

import { motion } from "framer-motion";

export default function AlternateTitle({
  brand,
  name,
}: {
  brand: string;
  name: string;
}) {
  return (
    <motion.div
      initial={{ y: 16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ ease: "easeInOut", duration: 0.5 }}
      className="fixed left-10 top-16 z-40 mt-1 w-fit rounded-md border bg-background px-2 opacity-85 sm:left-4 xl:left-6 xl:top-6"
    >
      <h1 className="line-clamp-1 max-w-full overflow-ellipsis bg-gradient-to-r from-cpurple via-cpink to-corange bg-clip-text text-center text-base font-medium text-foreground/90 md:max-w-full md:text-lg">
        {brand} {name}
      </h1>
    </motion.div>
  );
}
