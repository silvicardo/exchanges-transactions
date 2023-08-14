"use client";

import { SimpleGrid as LibSimpleGrid } from "@chakra-ui/react";
export default function SimpleGrid({
  children,
  ...props
}: React.ComponentProps<typeof LibSimpleGrid>) {
  return (
    <LibSimpleGrid {...props}>
      <>{children}</>
    </LibSimpleGrid>
  );
}
