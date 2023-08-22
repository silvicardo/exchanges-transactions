"use client";

import { Button } from "@/src/components/chakra";
import { useTransition } from "react";
import { convertToKoinlyUniversal } from "@/src/app/convert/koinly/actions";
import { useToast } from "@chakra-ui/react";

export const Cta = ({
  exchangeName,
}: Parameters<typeof convertToKoinlyUniversal>[0]) => {
  const toast = useToast();

  const [isPending, startTransition] = useTransition();
  return (
    <Button
      isLoading={isPending}
      onClick={() => {
        startTransition(async () => {
          const result = await convertToKoinlyUniversal({ exchangeName });
          if (!result.success) {
            toast({
              title: "Conversion Failed!",
              description: result.error,
              status: "error",
              duration: 9000,
              isClosable: true,
            });
          }
          toast({
            title: "Conversion Success! 🎉",
            description: result.message,
            status: "success",
            duration: 3000,
            isClosable: true,
          });
        });
      }}
    >
      Convert {exchangeName} to Koinly
    </Button>
  );
};
