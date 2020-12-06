// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  network: 'ropsten',
  etherscanUrl: 'https://ropsten.etherscan.io/',
  scryptDiff: 14,
  AddressRDG: '0x85A5C96b93dAF494F8dCa56c41D4594560b2882b',
  AddressRDGCoin: '0x4f6C0Fc5a4D753A26D8023D52DA298f0A806A9bF',
  AddressSwap: '0x11B197f994d2E9fF5250031635aEd39ADc3117FA',
  minimumGas: 0.001,
  RDGCoinBuy: 4,
  RDGCoinSell: 3.7,
  baseCurrencyCode: 'USD',
  otherCurrencyCodes: ['BRL'],
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
 import 'zone.js/dist/zone-error';  // Included with Angular CLI.
