import { Component, OnInit } from '@angular/core';
import { GlobalsService } from '../globals.service';
import { WalletService } from '../services/wallet.service';

@Component({
  selector: 'app-swap',
  templateUrl: './swap.component.html',
  styleUrls: ['./swap.component.scss']
})
export class SwapComponent implements OnInit {

  constructor(public globals: GlobalsService, private walletService: WalletService) { }

  ngOnInit(): void {
  }

  approve(){
    this.walletService.approveRDG();
  }

  swap() {
    this.walletService.swapRDG();
  }

}
