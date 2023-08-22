import {
  Button,
  VStack,
  Heading,
  Text,
  SimpleGrid,
} from "@/src/components/chakra";
import Link from "next/link";

export default async function Convert() {
  return (
    <VStack spacing={8} width={"100%"}>
      <Heading>Convert</Heading>
      <VStack spacing={8}>
        <SimpleGrid column={1} spacing={8}>
          <Text>
            Export your data from your exchange accounts and wallets to external
            tools universal formats.
          </Text>
        </SimpleGrid>
        <SimpleGrid column={4} spacing={8}>
          <Button as={Link} href={"/convert/koinly"}>
            Koinly
          </Button>
        </SimpleGrid>
      </VStack>
    </VStack>
  );
}
