import {
  Button,
  VStack,
  Heading,
  Text,
  SimpleGrid,
} from "@/src/components/chakra";
import Link from "next/link";
export default async function YearlyReport({
  params: { year },
}: {
  params: { year: string };
}) {
  return (
    <VStack spacing={8} width={"100%"}>
      <Heading>Report {year}</Heading>
      <VStack spacing={8}>
        <SimpleGrid column={4} spacing={8}></SimpleGrid>
      </VStack>
    </VStack>
  );
}
