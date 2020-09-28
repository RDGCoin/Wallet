import { Injectable } from '@angular/core';
import { ethers } from 'ethers';

@Injectable({
  providedIn: 'root'
})
export class GlobalsService {
  ethersProvider: ethers.providers.BaseProvider;
  loaderProgress: string;
  userWallet: ethers.Wallet;
  userAddress: string;

  constructor() {
    this.loaderProgress = '';
   }
}
