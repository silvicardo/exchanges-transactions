import { KoinlyUniversal } from "../../types";
import { CryptoComExchangeDustConversion } from "@prisma/client";

export const handle = (
  dustConversion: CryptoComExchangeDustConversion
): KoinlyUniversal => {
  return {
    Date: dustConversion.createTime as unknown as string,
    "Sent Amount": dustConversion.dustAmount,
    "Sent Currency": dustConversion.dustCurrency!,
    "Received Amount": dustConversion.toAmount!,
    "Received Currency": dustConversion.toCurrency!,
    "Fee Amount": 0,
    "Fee Currency": dustConversion.toCurrency!,
    Label: `dustConversion: ${dustConversion.dustCurrency} > ${dustConversion.toCurrency}}`,
    Description: `DUST CONVERSION ${dustConversion.dustCurrency}  - Id: ${dustConversion.conversionId}`,
  };
};
