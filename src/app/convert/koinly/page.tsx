import { VStack, Heading, Text, SimpleGrid } from "@/src/components/chakra";
import { Cta } from "@/src/app/convert/koinly/cta";

export default async function Koinly() {
  return (
    <VStack spacing={8} width={"100%"}>
      <Heading>Convert for Koinly</Heading>
      <VStack spacing={8}>
        <SimpleGrid column={1} spacing={8}>
          <Text>
            Export your data from your exchange accounts and wallets in koinly
            universal format.
          </Text>
        </SimpleGrid>
        <Cta exchangeName={"cryptoComExchange"} />
        <Cta exchangeName={"youngPlatform"} />
      </VStack>
    </VStack>
  );
}
