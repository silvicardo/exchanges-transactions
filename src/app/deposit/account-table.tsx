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
import Link from "next/link";

type Props = {
  accounts: Record<string, number>;
};
export default function AccountTable({ accounts }: Props) {
  return (
    <TableContainer>
      <Table variant="simple">
        <TableCaption>EUR deposited by exchange</TableCaption>
        <Thead>
          <Tr>
            <Th>Account Name</Th>
            <Th isNumeric>Total</Th>
          </Tr>
        </Thead>
        <Tbody>
          {Object.entries(accounts).map(([name, total]) => (
            <Tr key={name}>
              <Td>
                <Link href={`/deposit/${name}`}>{name}</Link>
              </Td>
              <Td isNumeric>€ {total.toFixed(2)}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
}
