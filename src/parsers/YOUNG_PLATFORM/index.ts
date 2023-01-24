import { convertCSVtoJSON } from "../../../convertCSVtoJSON";
import { BuySellSwapInput, parseBuySellSwap } from "./buySellSwap";

export const parsers = {
  "2021": {
    buy_sell_swap: async () => {
      const converted = await convertCSVtoJSON<BuySellSwapInput>(
        "2021/YOUNG_PLATFORM/buy_sell_swap.csv"
      );
      return converted.map(parseBuySellSwap);
    },
  },
  "2022": {
    buy_sell_swap: async () => {
      const converted = await convertCSVtoJSON<BuySellSwapInput>(
        "2022/YOUNG_PLATFORM/buy_sell_swap.csv"
      );
      return converted.map(parseBuySellSwap);
    },
  },
  "2023": {
    buy_sell_swap: async () => {
      const converted = await convertCSVtoJSON<BuySellSwapInput>(
        "2023/YOUNG_PLATFORM/buy_sell_swap.csv"
      );
      return converted.map(parseBuySellSwap);
    },
  },
} as const;
