"use client";

import { Skeleton as LibSkeleton } from "@chakra-ui/react";
export default function Skeleton({
  children,
  ...props
}: React.ComponentProps<typeof LibSkeleton>) {
  return (
    <LibSkeleton {...props}>
      <>{children}</>
    </LibSkeleton>
  );
}
