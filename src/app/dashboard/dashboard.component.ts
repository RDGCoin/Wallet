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
	form: FormGroup;
	private baseUrl = 'https://api.exchangeratesapi.io/latest';
	public RDGCOIN: { buy: string; sell: string };
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
		this.RDGCOIN = { buy: '', sell: '' };
		this.addresses = [];
		this.form = this.fb.group({
			address: ['', [Validators.required, CustomValidators.rangeLength([42, 42])]],
			value: ['', [Validators.required, CustomValidators.gte(0)]],
		});
		this.formWhitelist = this.fb.group({ address: ['', [Validators.required, CustomValidators.rangeLength([42, 42])]] });
	}

	smallAddress: string;

	ngOnInit(): void {
		this.smallAddress = this.globals.userWallet.address.substr(0, 6) + '...' + this.globals.userWallet.address.substr(38);
		const url = `${this.baseUrl}?base=${environment.baseCurrencyCode}&symbols=${environment.otherCurrencyCodes.join(',')}`;
		this.http
			.get(url, { observe: 'response' })
			.toPromise()
			.then((response) => {
				if (response.ok && response.status === 200) {
					const quote = Number(response.body['rates'][environment.otherCurrencyCodes[0]]);
					this.RDGCOIN.buy = 'R$ ' + (this.globals.prices.RDGCOIN.buy * quote).toFixed(2);
					this.RDGCOIN.sell = 'R$ ' + (this.globals.prices.RDGCOIN.sell * quote).toFixed(2);
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

	async sendEther() {
		const address = this.form.controls.address.value;
		const value = this.form.controls.value.value;
		this.walletService.transferETH(address, value);
	}

	async sendRDGCoin() {
		const address = this.form.controls.address.value;
		const value = this.form.controls.value.value;
		this.walletService.transfer(address, value);
  }

  async sendWhitelist() {
    this.walletService.sendWhitelist(this.addresses);
  }
}
