"use client";
import React from "react";
import {
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { isDate } from "lodash";
import { format } from "date-fns";

type BaseDataEntry = {
  id: number;
};

export default function DataTable<K extends BaseDataEntry = BaseDataEntry>({
  data,
  caption,
}: {
  caption: string;
  data: K[];
}) {
  const getRow = React.useCallback((row: K[][number]) => {
    return (
      <Tr key={row.id as number}>
        {Object.entries(row).map(([name, value]) => {
          if (value === null) {
            return (
              <Td key={`${row.id}-${name}-null`} textAlign={"center"}>
                -
              </Td>
            );
          }
          if (!name.toLowerCase().includes("id") && typeof value === "number") {
            return (
              <Td key={`${row.id}-${name}`} isNumeric>
                {value.toString()}
              </Td>
            );
          }
          if (isDate(value)) {
            return (
              <Td key={`${row.id}-${name}`}>
                {format(new Date(value), "dd-MM-yyyy")}
              </Td>
            );
          }
          return <Td key={`${row.id}-${name}`}>{value.toString()}</Td>;
        })}
      </Tr>
    );
  }, []);
  return (
    <TableContainer>
      <Table variant="simple">
        <TableCaption>{caption}</TableCaption>
        <Thead>
          <Tr>
            {Object.keys(data[0] ?? {}).map((key) => (
              <Th key={key}>{key}</Th>
            ))}
          </Tr>
        </Thead>
        <Tbody>{data.map(getRow)}</Tbody>
      </Table>
    </TableContainer>
  );
}
