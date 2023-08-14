"use client";

import { HStack as LibHStack } from "@chakra-ui/react";
export default function HStack({
  children,
  ...props
}: React.ComponentProps<typeof LibHStack>) {
  return (
    <LibHStack {...props}>
      <>{children}</>
    </LibHStack>
  );
}
