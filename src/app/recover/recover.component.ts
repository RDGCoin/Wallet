import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CustomValidators } from 'ngx-custom-validators';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { WalletService } from '../services/wallet.service';

@Component({
	selector: 'app-recover',
	templateUrl: './recover.component.html',
	styleUrls: ['./recover.component.scss'],
})
export class RecoverComponent {
	form: FormGroup;
	model: {
		mneumonic: string;
		password: string;
		confirmPassword: string;
	};

	constructor(
		private fb: FormBuilder,
		private router: Router,
		private toastrService: ToastrService,
		private spinner: NgxSpinnerService,
		private walletService: WalletService
	) {
		const password = new FormControl('', [Validators.required, CustomValidators.rangeLength([6, 32])]);
		const confirmPassword = new FormControl('', [
			Validators.required,
			CustomValidators.rangeLength([6, 32]),
			CustomValidators.equalTo(password),
		]);

		this.form = this.fb.group({
			mneumonic: ['', [Validators.required]],
			password: password,
			confirmPassword: confirmPassword,
		});
	}

	async restore() {
		try {
			this.spinner.show();
			this.model = Object.assign({}, this.model, this.form.value);

			const wallet = this.walletService.restore(this.model.mneumonic);
			await this.walletService.store(wallet, this.model.password);

			const toastr = this.toastrService.success('Successo', 'Carteira recuperada!', {
				progressBar: true,
			});

			if (toastr) {
				toastr.onHidden.subscribe(() => {
					this.spinner.hide();
					this.router.navigate(['/']);
				});
			}
		} catch {
			const toastr = this.toastrService.error('Erro', 'Erro ao recuperar a carteira!', {
				progressBar: true,
			});

			if (toastr) {
				toastr.onHidden.subscribe(() => {
					this.spinner.hide();
				});
			}
		}
	}
}
