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
}
