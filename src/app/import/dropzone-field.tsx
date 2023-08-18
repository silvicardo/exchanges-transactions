"use client";
import React, { useMemo } from "react";
import { useDropzone } from "react-dropzone";
import { useController } from "react-hook-form";
import { Text, SimpleGrid } from "@/src/components/chakra";
import { FieldValues } from "react-hook-form/dist/types/fields";
import { FieldPath } from "react-hook-form/dist/types";
import { ControllerProps } from "react-hook-form/dist/types/controller";

const baseStyle: React.CSSProperties = {
  flex: 1,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "20px",
  borderWidth: 2,
  borderRadius: 2,
  borderColor: "#eeeeee",
  borderStyle: "dashed",
  backgroundColor: "#fafafa",
  color: "#bdbdbd",
  outline: "none",
  transition: "border .24s ease-in-out",
};

const focusedStyle: React.CSSProperties = {
  borderColor: "#2196f3",
};

const acceptStyle: React.CSSProperties = {
  borderColor: "#00e676",
};

const rejectStyle: React.CSSProperties = {
  borderColor: "#ff1744",
};

export function DropzoneField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>(props: Omit<ControllerProps<TFieldValues, TName>, "render">) {
  const { field } = useController(props);
  const { isFocused, isDragAccept, isDragReject, getRootProps, getInputProps } =
    useDropzone({
      accept: { "text/csv": [".csv"] },
      maxFiles: 1,
      multiple: false,
      onDrop: (acceptedFiles) => {
        field.onChange(acceptedFiles[0]);
      },
    });
  const style = useMemo(
    () => ({
      ...baseStyle,
      ...(isFocused ? focusedStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {}),
    }),
    [isFocused, isDragAccept, isDragReject]
  );

  return (
    <SimpleGrid column={1} spacing={4}>
      <div {...getRootProps({ style })}>
        <input
          {...getInputProps({
            onChange: (e) => field.onChange(e.target.files?.[0]),
          })}
        />
        <p>Drag &lsquo;n&lsquo; drop your file here, or click to select one</p>
      </div>
      <div style={{ textAlign: "center" }}>
        {field.value && <Text>File : {field.value.name}</Text>}
      </div>
    </SimpleGrid>
  );
}
