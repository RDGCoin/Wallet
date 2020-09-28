import { Component } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CustomValidators } from 'ngx-custom-validators';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { LocalStorageKeysEnum } from '../models/local-storage-keys.enum';
import { WalletService } from '../services/wallet.service';

@Component({
	selector: 'app-create-confirm',
	templateUrl: './create-confirm.component.html',
	styleUrls: ['./create-confirm.component.scss'],
})
export class CreateConfirmComponent {
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
			,
			CustomValidators.rangeLength([6, 32]),
			CustomValidators.equalTo(password),
		]);

		this.form = this.fb.group({
			mneumonic: ['', Validators.required],
			password: password,
			confirmPassword: confirmPassword,
		});
	}

	async confirm() {
		try {
			this.spinner.show();

			this.model = Object.assign({}, this.model, this.form.value);
			const localMneumonic = this.walletService.getLocalStorage(LocalStorageKeysEnum.mneumonic);

			if (localMneumonic !== this.model.mneumonic) {
				const toastr = this.toastrService.error('Erro', 'Mneumonico Inválido!', {
					progressBar: true,
				});
				if (toastr) {
					toastr.onHidden.subscribe(() => {
						this.spinner.hide();
					});
					return;
				}
			}

			const wallet = this.walletService.restore(this.model.mneumonic);
			await this.walletService.store(wallet, this.model.password);

			const toastr = this.toastrService.success('Successo', 'Carteira criada!', {
				progressBar: true,
			});

			if (toastr) {
				toastr.onHidden.subscribe(() => {
					this.walletService.removeLocalStorage(LocalStorageKeysEnum.mneumonic);
					this.spinner.hide();
					this.router.navigate(['/']);
				});
			}
		} catch (err) {
			const toastr = this.toastrService.error('Erro', 'Erro ao criar a carteira!', {
				progressBar: true,
			});

			if (toastr)
				toastr.onHidden.subscribe(() => {
					this.walletService.removeLocalStorage(LocalStorageKeysEnum.mneumonic);
					this.spinner.hide();
				});
		}
	}
}
