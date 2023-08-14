"use client";

import { VStack as LibVStack } from "@chakra-ui/react";
export default function VStack({
  children,
  ...props
}: React.ComponentProps<typeof LibVStack>) {
  return (
    <LibVStack {...props}>
      <>{children}</>
    </LibVStack>
  );
}
