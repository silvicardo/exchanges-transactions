"use client";

import { Stack as LibStack } from "@chakra-ui/react";
export default function Stack({
  children,
  ...props
}: React.ComponentProps<typeof LibStack>) {
  return (
    <LibStack {...props}>
      <>{children}</>
    </LibStack>
  );
}
