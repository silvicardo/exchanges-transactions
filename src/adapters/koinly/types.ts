import { CurrencyName } from "@prisma/client";

export type KoinlyUniversal = {
  Date: string;
  "Sent Amount": number;
  "Sent Currency": CurrencyName;
  "Received Amount": number;
  "Received Currency": CurrencyName;
  "Fee Amount"?: number;
  "Fee Currency"?: CurrencyName;
  "Net Worth Amount"?: number;
  "Net Worth Currency"?: string;
  Label?: string;
  Description?: string;
  TxHash?: string;
};

/*
Koinly Date	Pair	Side	Amount	Total	Fee Amount	Fee Currency	Order ID	Trade ID
2018-01-01 14:25 UTC	BTC-USD	Buy	1	1000	5	USD
2018-01-01 14:45 UTC	BTC-USD	Sell	1	900	3	USD
* The first sample row in this file contains a trade of 1000 USD to 1 BTC with a fee of 5 USD on top. In other words: you are buying 1 BTC for 1000 USD + fee.
*
The second row contains a sale of 1 BTC for 900 USD with a fee of 3 USD on top. In other words, you sold 1 BTC for 900 USD + fee.
 */

export type KoinlyTrades = {
  "Koinly Date": string;
  Pair: `${CurrencyName}-${CurrencyName}`;
  Side: "Buy" | "Sell";
  Amount: number;
  Total: number;
  "Fee Amount"?: number;
  "Fee Currency"?: CurrencyName;
  "Order ID"?: string;
  "Trade ID"?: string;
};
