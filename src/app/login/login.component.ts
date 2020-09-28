import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ethers } from 'ethers';
import { CustomValidators } from 'ngx-custom-validators';
import { Router } from '@angular/router';
import { WalletService } from '../services/wallet.service';
import { GlobalsService } from '../globals.service';
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  form: FormGroup;

	constructor(
		private fb: FormBuilder,
		private walletService: WalletService,
		private spinner: NgxSpinnerService,
		private router: Router,
		private toastrService: ToastrService,
		public globals: GlobalsService
	) {}

	ngOnInit(): void {
		this.form = this.fb.group({
			password: ['', [Validators.required, CustomValidators.rangeLength([6, 32])]],
		});
	}

	async signin() {
		try {
			this.globals.ethersProvider = ethers.getDefaultProvider(environment.network);
			this.spinner.show();
			const password = this.form.controls.password.value;
			const encryptWallet = this.walletService.getFromStorage();
			if (!encryptWallet) {
				const toastr = this.toastrService.error('Error', 'Wallet do not exists, create or restore one!', {
					progressBar: true,
				});
				if (toastr)
					toastr.onHidden.subscribe(() => {
						this.spinner.hide();
					});
				return;
			}
			const wallet = await this.walletService.decrypt(encryptWallet, password);
			this.globals.userWallet = new ethers.Wallet(wallet.privateKey, this.globals.ethersProvider);
			this.globals.userAddress = wallet.address;
			this.globals.loaderProgress = '';
			await this.walletService.loadContracts();
			this.spinner.hide();
      this.globals.loaderProgress = '';
      this.router.navigate(['/dashboard']);
		} catch (err) {
			console.error(err);
			const toastr = this.toastrService.error('Error', 'Error to log in!', {
				progressBar: true,
			});
			if (toastr)
				toastr.onHidden.subscribe(() => {
					this.spinner.hide();
				});
		}
	}
}
