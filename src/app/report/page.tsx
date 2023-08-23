import {
  Button,
  VStack,
  Heading,
  Text,
  SimpleGrid,
} from "@/src/components/chakra";
import Link from "next/link";

const YEARS = ["2021", "2022", "2023"];
export default async function Report() {
  return (
    <VStack spacing={8} width={"100%"}>
      <Heading>Report</Heading>
      <VStack spacing={8}>
        <SimpleGrid column={1} spacing={8}>
          <Text>Access aggregated data per year</Text>
        </SimpleGrid>
        <SimpleGrid column={4} spacing={8}>
          {YEARS.map((year) => (
            <Button key={year} as={Link} href={`/report/${year}`}>
              {year}
            </Button>
          ))}
        </SimpleGrid>
      </VStack>
    </VStack>
  );
}
