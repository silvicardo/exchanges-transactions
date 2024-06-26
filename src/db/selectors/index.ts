import { selectors as youngPlatformSelectors } from "./YOUNG_PLATFORM";
import { selectors as cryptoComExchangeSelectors } from "./CRYPTO_COM_EXCHANGE";
import { selectors as cryptoComAppSelectors } from "./CRYPTO_COM_APP";
import { selectors as bitpandaSelectors } from "./BITPANDA";
import { selectors as bitpandaProSelectors } from "./BITPANDA_PRO";
import { selectors as nexoSelectors } from "./NEXO";
import { selectors as nexoProSelectors } from "./NEXO_PRO";
import { selectors as ledgerSelectors } from "./LEDGER";
import { selectors as coinbaseSelectors } from "./COINBASE";

export const selectors = {
  youngPlatform: youngPlatformSelectors,
  cryptoComExchange: cryptoComExchangeSelectors,
  cryptoComApp: cryptoComAppSelectors,
  bitpanda: bitpandaSelectors,
  bitpandaPro: bitpandaProSelectors,
  nexo: nexoSelectors,
  nexoPro: nexoProSelectors,
  ledger: ledgerSelectors,
  coinbase: coinbaseSelectors,
};
