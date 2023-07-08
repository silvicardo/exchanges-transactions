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
import { ExchangeQueryResult } from "./query-func";

export default function ListTable<
  K extends ExchangeQueryResult = ExchangeQueryResult
>({ data }: { data: K }) {
  const getRow = React.useCallback((row: K[number]) => {
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
          if (typeof value == "boolean") {
            return <Td key={`${row.id}-${name}`}>{value.toString()}</Td>;
          }
          if (!name.toLowerCase().includes("id") && typeof value === "number") {
            return (
              <Td key={`${row.id}-${name}`} isNumeric>
                {value.toString()}
              </Td>
            );
          }
          if (value instanceof Date) {
            return <Td key={`${row.id}-${name}`}>{value.toLocaleString()}</Td>;
          }
          return <Td key={`${row.id}-${name}`}>{value.toString()}</Td>;
        })}
      </Tr>
    );
  }, []);
  return (
    <TableContainer>
      <Table variant="simple">
        <TableCaption>EUR deposits</TableCaption>
        <Thead>
          <Tr>
            {Object.keys(data[0]).map((key) => (
              <Th key={key}>{key}</Th>
            ))}
          </Tr>
        </Thead>
        <Tbody>{data.map(getRow)}</Tbody>
      </Table>
    </TableContainer>
  );
}
