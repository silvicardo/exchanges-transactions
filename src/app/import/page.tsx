import { Form } from "@/src/app/import/form";
import {
  VStack,
  Heading,
  Text,
  Box,
  SimpleGrid,
} from "@/src/components/chakra";

export default async function Import() {
  return (
    <VStack spacing={8} width={"100%"}>
      <Heading>Import</Heading>
      <Box flex={1}>
        <SimpleGrid column={1} spacing={8}>
          <Text>
            Import your data from your exchange accounts and wallets to get a
            complete overview of your crypto portfolio.
          </Text>
          <Form />
        </SimpleGrid>
      </Box>
    </VStack>
  );
}
