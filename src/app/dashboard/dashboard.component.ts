import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { GlobalsService } from '../globals.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'src/environments/environment';
import { map, tap, catchError } from 'rxjs/operators';

@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
	private baseUrl = 'https://api.exchangeratesapi.io/latest';
	public RDGCOIN: { buy: string; sell: string };

	constructor(
		public globals: GlobalsService,
		private toastrService: ToastrService,
		private modalService: NgbModal,
		private http: HttpClient
	) {
		this.RDGCOIN = { buy: '', sell: '' };
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
}
