"use client";

import React from "react";
import { downloadCsvAttempt } from "@/src/app/actions/downloadCsv";
import { Button } from "@/src/components/chakra";

export function DownloadForm({
  stringifiedData,
  fileName,
  ctaText,
}: {
  stringifiedData: string;
  fileName: string;
  ctaText: string;
}) {
  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();

        const response = await downloadCsvAttempt(
          new FormData(e.target as HTMLFormElement)
        );
        const blob = new Blob([response.data], {
          type: "text/csv",
        });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.style.display = "none";
        a.href = url;
        a.download = `${fileName}.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      }}
    >
      <input type={"hidden"} name={"jsondata"} value={stringifiedData} />
      <Button type={"submit"}>{ctaText}</Button>
    </form>
  );
}
