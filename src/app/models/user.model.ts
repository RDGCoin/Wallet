import { ethers } from 'ethers';

export class User {

  contractRDG: ethers.Contract;
  contractRDGCOIN: ethers.Contract;
  contractSwap: ethers.Contract;

  balance: number;
  balanceRDG: number;
  whitelisted: boolean;
  eth: number;
  lowGas: boolean;
<<<<<<< HEAD
=======
  hasAdmin: boolean;
>>>>>>> 3354005d36dbecdda6fe7e25f787fd00d6d64a6b
}
