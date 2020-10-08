// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  network: 'goerli',
  scryptDiff: 14,
  AddressRDG: '0x9A4ec1a77466eD32c486D9D6aC20406e70AAfC91',
  AddressRDGCoin: '0x25540378a74567129F09b3e6479D4f10ea8e5451',
  AddressSwap: '0x5683caa62810d52791bBc4daA923993854250c96',
  minimumGas: 0.001,
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
 import 'zone.js/dist/zone-error';  // Included with Angular CLI.
