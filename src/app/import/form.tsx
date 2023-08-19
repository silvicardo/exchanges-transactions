"use client";

import { useForm } from "react-hook-form";
import { SimpleGrid, Button, Select } from "@/src/components/chakra";
import {
  EXCHANGE_FILENAME_OPTIONS,
  EXCHANGE_OPTIONS,
  ImportFieldValues,
  YEAR_OPTIONS,
} from "@/src/app/import/form-options";
import { useEffect, useTransition } from "react";
import { importExchangeData } from "@/src/app/import/actions";
import { zodResolver } from "@hookform/resolvers/zod";
import { clientValidationSchema } from "@/src/app/import/client-validation";
import { useToast } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { DropzoneField } from "@/src/app/import/dropzone-field";
import { FileExistsAlert } from "@/src/app/import/file-exists-alert";

const prepareFormData = (data: ImportFieldValues) => {
  const formData = new FormData();
  formData.set("year", data.year);
  formData.set("exchange", data.exchange);
  formData.set("filename", data.filename);
  formData.set("file", data.file);
  return formData;
};
export const Form = () => {
  let [isPending, startTransition] = useTransition();
  const router = useRouter();
  const toast = useToast();
  const {
    control,
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ImportFieldValues>({
    shouldUseNativeValidation: true,
    // @ts-ignore
    resolver: zodResolver(clientValidationSchema),
    defaultValues: {
      year: "2023",
      exchange: "YOUNG_PLATFORM",
      filename: "buy_sell_swap",
    } as ImportFieldValues,
  });

  const exchangeName = watch("exchange");
  const filename = watch("filename");
  const year = watch("year");

  useEffect(() => {
    if (
      !(EXCHANGE_FILENAME_OPTIONS[exchangeName] as readonly string[]).includes(
        filename
      )
    ) {
      setValue("filename", EXCHANGE_FILENAME_OPTIONS[exchangeName][0]);
    }
  }, [exchangeName, filename, setValue]);

  return (
    <form
      onSubmit={handleSubmit((data) => {
        startTransition(async () => {
          const result = await importExchangeData(prepareFormData(data));

          if (!result.success) {
            toast({
              title: "Import Failed!",
              description: result.error,
              status: "error",
              duration: 9000,
              isClosable: true,
            });
          } else {
            toast({
              title: "File imported! 🎉",
              description: result.message,
              status: "success",
              duration: 3000,
              isClosable: true,
            });
            reset();
          }
        });
      })}
    >
      <SimpleGrid column={1} spacing={4}>
        <SimpleGrid columns={3} spacing={4}>
          <Select {...register("year")}>
            {YEAR_OPTIONS.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </Select>

          <Select {...register("exchange")}>
            {EXCHANGE_OPTIONS.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </Select>

          <Select {...register("filename")}>
            {EXCHANGE_FILENAME_OPTIONS[exchangeName].map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </Select>
        </SimpleGrid>
        <DropzoneField control={control} name={"file"} />
        <FileExistsAlert
          year={year}
          exchange={exchangeName}
          filename={filename}
        />
        <Button
          isLoading={isSubmitting || isPending}
          size={"lg"}
          type="submit"
          width={"full"}
        >
          Submit File
        </Button>
      </SimpleGrid>
    </form>
  );
};
