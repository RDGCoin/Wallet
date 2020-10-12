import { Injectable } from '@angular/core';
import { ethers } from 'ethers';
import { environment } from 'src/environments/environment';
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

  prices: {RDGCOIN: {buy: number, sell: number}};

  constructor() {
    this.loaderProgress = '';
    this.user = new User();
    this.prices = {RDGCOIN: {buy: environment.RDGCoinBuy, sell: environment.RDGCoinSell}};
   }
}
