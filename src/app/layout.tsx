import { Inter } from "next/font/google";
import { Providers } from "./providers";
import { Navbar } from "@/src/components/navbar";
import { Container } from "@/src/components/chakra";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Crypto Transactions Manager",
  description: "In House tool to store and manage crypto transactions",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <Navbar />
          <Container as={"main"} maxW={"container.xl"} pt={12}>
            {children}
          </Container>
        </Providers>
      </body>
    </html>
  );
}
