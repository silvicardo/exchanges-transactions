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
              <Td>{name}</Td>
              <Td isNumeric>€ {total.toFixed(2)}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
}
