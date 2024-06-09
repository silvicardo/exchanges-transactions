import { YoungPlatformMovement } from "@prisma/client";
import { KoinlyUniversal } from "@/src/adapters/koinly/types";


export const handle = (t: [YoungPlatformMovement, YoungPlatformMovement]): KoinlyUniversal => {

  //Dust conversion always has two movements
  //One is the credit which is the received amount in YNG
  //The other is the debit which is the sent amount in YNG
  const yngCreditMovement = t.find(m => +m.credit > 0);
  const currencyDebitMovement = t.find(m => +m.debit > 0);
  if(!yngCreditMovement || !currencyDebitMovement) {
    throw new Error("Dust conversion movements are not correct");
  }
  return ({
  Date: yngCreditMovement.date.toISOString(),
  "Sent Amount": currencyDebitMovement.debit,
  "Sent Currency": currencyDebitMovement.currency,
  "Received Amount": yngCreditMovement.credit,
  "Received Currency": yngCreditMovement.currency,
  "Fee Amount": 0,
  "Fee Currency": yngCreditMovement.currency,
  Label: "DUST_CONVERSION",
  Description: `DUST_CONVERSION - ${currencyDebitMovement.currency}-YNG move Ids: ${currencyDebitMovement.moveId}-${yngCreditMovement.moveId}`,
});
}
