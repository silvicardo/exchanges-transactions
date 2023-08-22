import { handle as handleCryptoComExchange } from "@/src/adapters/koinly/universal/CRYPTO_COM_EXCHANGE";
import { handle as handleYoungPlatform } from "@/src/adapters/koinly/universal/YOUNG_PLATFORM";

export const koinlyUniversal = {
  cryptoComExchange: handleCryptoComExchange,
  youngPlatform: handleYoungPlatform,
};
