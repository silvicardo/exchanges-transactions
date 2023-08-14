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
import { usePathname } from "next/navigation";
import Link from "next/link";
import qs from "qs";

type Props = {
  caption: string;
  dataKeyHead: string;
  data: Record<string, number>;
  amountSymbol: string;
  linkSearchParams?: Record<string, string>;
};
export default function AmountsTable({
  data,
  dataKeyHead,
  caption,
  amountSymbol,
  linkSearchParams = {},
}: Props) {
  const pathname = usePathname();
  return (
    <TableContainer>
      <Table variant="simple">
        <TableCaption>{caption}</TableCaption>
        <Thead>
          <Tr>
            <Th>{dataKeyHead}</Th>
            <Th isNumeric>Total</Th>
          </Tr>
        </Thead>
        <Tbody>
          {Object.entries(data).map(([name, total]) => (
            <Tr key={name}>
              <Td>
                {total > 0 ? (
                  <Link
                    href={`${pathname}/${name}${qs.stringify(linkSearchParams, {
                      addQueryPrefix: true,
                    })}`}
                  >
                    {name}
                  </Link>
                ) : (
                  name
                )}
              </Td>
              <Td isNumeric>
                {amountSymbol} {total.toFixed(2)}
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
}
