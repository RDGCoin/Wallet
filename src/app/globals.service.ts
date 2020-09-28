import { Injectable } from '@angular/core';
import { ethers } from 'ethers';
import { User } from './models/user.model';

@Injectable({
  providedIn: 'root'
})
export class GlobalsService {
  ethersProvider: ethers.providers.BaseProvider;
  loaderProgress: string;
  userWallet: ethers.Wallet;
  userAddress: string;
  user: User

  constructor() {
    this.loaderProgress = '';
   }
}
