import {
  CurrencyName,
  PrismaClient,
  YoungPlatformMovement,
} from "@prisma/client";

type KoinlyUniversal = {
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

const convertDepositWithdrawFeeOrder = async (): Promise<KoinlyUniversal[]> => {
  const prisma = new PrismaClient();
  const deposits = await prisma.youngPlatformMovement.findMany({
    where: { txType: "DEPOSIT" },
  });
  const outsWithFees: YoungPlatformMovement[] =
    await prisma.youngPlatformMovement.findMany({
      where: {
        OR: [{ txType: "WITHDRAWAL" }, { txType: "FEE" }],
      },
      orderBy: { date: "asc" },
    });

  const outsWithFeesMap = outsWithFees.reduce<
    Record<string, Partial<Record<"FEE" | "WITHDRAWAL", KoinlyUniversal>>>
  >((acc, o) => {
    const date = o.date.toISOString();
    if (acc[date]) {
      if (o.txType === "WITHDRAWAL") {
        acc[date]["WITHDRAWAL"] = {
          Date: o.date.toISOString(),
          "Sent Amount": o.debit,
          "Sent Currency": o.currency,
          "Received Amount": o.credit,
          "Received Currency": o.currency,
          "Fee Amount": 0,
          "Fee Currency": o.currency,
          Label: o.txType,
          Description: o.txType,
        };
      } else {
        acc[date]["FEE"] = {
          Date: o.date.toISOString(),
          "Sent Amount": 0,
          "Sent Currency": o.currency,
          "Received Amount": o.credit,
          "Received Currency": o.currency,
          "Fee Amount": o.debit,
          "Fee Currency": o.currency,
          Label: o.txType,
          Description: o.txType,
        };
      }
    } else {
      if (o.txType === "WITHDRAWAL") {
        acc[date] = {
          WITHDRAWAL: {
            Date: o.date.toISOString(),
            "Sent Amount": o.debit,
            "Sent Currency": o.currency,
            "Received Amount": o.credit,
            "Received Currency": o.currency,
            "Fee Amount": 0,
            "Fee Currency": o.currency,
            Label: o.txType,
            Description: o.txType,
          },
        };
      } else {
        acc[date] = {
          FEE: {
            Date: o.date.toISOString(),
            "Sent Amount": 0,
            "Sent Currency": o.currency,
            "Received Amount": o.credit,
            "Received Currency": o.currency,
            "Fee Amount": o.debit,
            "Fee Currency": o.currency,
            Label: o.txType,
            Description: o.txType,
          },
        };
      }
    }
    return acc;
  }, {}) as Record<
    string,
    Required<Record<"FEE" | "WITHDRAWAL", KoinlyUniversal>>
  >;

  const unifiedOuts = Object.values(outsWithFeesMap).map<KoinlyUniversal>(
    ({ WITHDRAWAL, FEE }) => ({
      Date: WITHDRAWAL.Date,
      "Sent Amount": WITHDRAWAL["Sent Amount"],
      "Sent Currency": WITHDRAWAL["Sent Currency"],
      "Received Amount": WITHDRAWAL["Received Amount"],
      "Received Currency": WITHDRAWAL["Received Currency"],
      "Fee Amount": FEE["Fee Amount"],
      "Fee Currency": FEE["Fee Currency"],
      Label: WITHDRAWAL["Label"],
      Description: WITHDRAWAL["Description"],
    })
  );

  console.log(unifiedOuts);

  prisma.$disconnect();
  const kDeps = deposits.map((o) => ({
    Date: o.date.toISOString(),
    "Sent Amount": o.debit,
    "Sent Currency": o.currency,
    "Received Amount": o.credit,
    "Received Currency": o.currency,
    "Fee Amount": 0,
    "Fee Currency": o.currency,
    Label: "Deposit",
    Description: "Deposit",
  }));
  return kDeps;
};

convertDepositWithdrawFeeOrder();
