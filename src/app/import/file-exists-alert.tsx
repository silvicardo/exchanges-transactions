"use client";

import { ImportFieldValues } from "@/src/app/import/form-options";
import { useEffect, useState, useTransition } from "react";
import { hasCsvFile } from "@/src/app/import/actions";
import { Alert, AlertIcon, AlertTitle } from "@/src/components/chakra";

export const FileExistsAlert = ({
  exchange,
  filename,
  year,
}: Omit<ImportFieldValues, "file">) => {
  const [path, setPath] = useState<string>("");
  const [alreadyExists, setAlreadyExists] = useState(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setAlreadyExists(false);
    startTransition(async () => {
      const { hasFoundMatch, path } = await hasCsvFile({
        exchange,
        filename,
        year,
      });
      setAlreadyExists(hasFoundMatch);
      setPath(path);
    });
  }, [exchange, filename, year]);

  if (isPending || !path) {
    return null;
  }
  if (alreadyExists) {
    return (
      <Alert status="warning">
        <AlertIcon />
        <AlertTitle>File already exists at path: {path} </AlertTitle>
      </Alert>
    );
  }
  return (
    <Alert status={"info"}>
      <AlertIcon />
      <AlertTitle>No file for path: {path}</AlertTitle>
    </Alert>
  );
};
