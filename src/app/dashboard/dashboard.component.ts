import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { GlobalsService } from '../globals.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'src/environments/environment';
import { CustomValidators } from 'ngx-custom-validators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { WalletService } from '../services/wallet.service';

@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
	private exchangeRateApi = 'https://api.exchangeratesapi.io/latest';
	private coinMarketCapApi = 'https://pro-api.coinmarketcap.com';
	public RDGCOIN: { buy: number; sell: number };
	public ETH: number = 0;
	public USD_BRL: number = 0;
	formRDG: FormGroup;
	formETH: FormGroup;
	formWhitelist: FormGroup;
	addresses: string[];

	constructor(
		public globals: GlobalsService,
		private walletService: WalletService,
		private toastrService: ToastrService,
		private modalService: NgbModal,
		private http: HttpClient,
		private fb: FormBuilder
	) {
		this.RDGCOIN = { buy: 0, sell: 0 };
		this.addresses = [];
		this.formRDG = this.fb.group({
			address: ['', [Validators.required, CustomValidators.rangeLength([42, 42])]],
			value_rdg: ['', [Validators.required, CustomValidators.gte(0)]],
			value_reais: ['', [CustomValidators.gte(0)]],
		});
		this.formETH = this.fb.group({
			address: ['', [Validators.required, CustomValidators.rangeLength([42, 42])]],
			value_eth: ['', [Validators.required, CustomValidators.gte(0)]],
			value_reais: ['', [CustomValidators.gte(0)]],
		});
		this.formWhitelist = this.fb.group({
		  address: ['', [Validators.required, CustomValidators.rangeLength([42, 42])]]
		});
	}

	smallAddress: string;

	ngOnInit(): void {
		this.smallAddress = this.globals.userWallet.address.substr(0, 6) + '...' + this.globals.userWallet.address.substr(38);

		// Exchange Rates API
		this.http.get(`${this.exchangeRateApi}?base=${environment.baseCurrencyCode}&symbols=${environment.otherCurrencyCodes.join(',')}`, { observe: 'response' })
			.toPromise()
			.then((response) => {
				if (response.ok && response.status === 200) {
					this.USD_BRL = Number(response.body['rates'][environment.otherCurrencyCodes[0]]);
					this.RDGCOIN.buy = this.globals.prices.RDGCOIN.buy * this.USD_BRL;
					this.RDGCOIN.sell = this.globals.prices.RDGCOIN.sell * this.USD_BRL;
				}
			});

		// CoinMarketCap API
		this.http.get(`${this.coinMarketCapApi}/v1/cryptocurrency/quotes/latest?symbol=ETH`, {
				observe: 'response',
				headers: {
					'X-CMC_PRO_API_KEY': '1107c837-515b-4721-9cf1-049124a29a7c',
					'Access-Control-Allow-Origin': '*'
				}
			})
			.toPromise()
			.then((response) => {
				console.log(response);
				if (response.ok && response.status === 200) {
					this.ETH = Number(response.body['data']['ETH']['quote']['USD']['price']) * this.USD_BRL;
				}
			});
	}

	open(content: any) {
		this.modalService.open(content, { ariaLabelledBy: 'qrcodeModal', centered: true });
	}

	copyToClipboard() {
		const selBox = document.createElement('textarea');
		selBox.style.position = 'fixed';
		selBox.style.left = '0';
		selBox.style.top = '0';
		selBox.style.opacity = '0';
		selBox.value = this.globals.userWallet.address;
		document.body.appendChild(selBox);
		selBox.focus();
		selBox.select();
		document.execCommand('copy');
		document.body.removeChild(selBox);

		this.toastrService.success('Successo', 'Endereço copiado!');
	}

	convertReaisToRdg() {
		const valorReais = parseFloat(this.formRDG.controls.value_reais.value);
		const valorRdg = valorReais / this.RDGCOIN.buy;
		this.formRDG.controls.value_rdg.setValue(valorRdg);
	}

	convertRdgToReais() {
		const valorRdg = parseFloat(this.formRDG.controls.value_rdg.value);
		const valorReais = (valorRdg * this.RDGCOIN.buy).toFixed(2);
		this.formRDG.controls.value_reais.setValue(valorReais);
	}

	convertReaisToEth() {
		const valorReais = parseFloat(this.formETH.controls.value_reais.value);
		const valorEth = valorReais / this.ETH;
		this.formETH.controls.value_eth.setValue(valorEth);
	}

	convertEthToReais() {
		const valorEth = parseFloat(this.formETH.controls.value_eth.value);
		const valorReais = (valorEth * this.ETH).toFixed(2);
		this.formETH.controls.value_reais.setValue(valorReais);
	}

	async sendEther() {
		const address = this.formETH.controls.address.value;
		const value = this.formETH.controls.value_eth.value;
		this.walletService.transferETH(address, value);
	}

	async sendRDGCoin() {
		const address = this.formRDG.controls.address.value;
		const value = this.formRDG.controls.value_rdg.value;
		this.walletService.transfer(address, value);
  }

  async sendWhitelist() {
    this.walletService.sendWhitelist(this.addresses);
  }

  approve(){
    this.walletService.approveRDG();
  }

  swap() {
    this.walletService.swapRDG();
  }
}
