import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LocalStorageKeysEnum } from '../models/local-storage-keys.enum';
import { WalletService } from '../services/wallet.service';

@Component({
	selector: 'app-create',
	templateUrl: './create.component.html',
	styleUrls: ['./create.component.scss'],
})
export class CreateComponent implements OnInit {
	form: FormGroup;

	private setting = {
		element: {
			dynamicDownload: null as HTMLElement,
		},
	};

	constructor(
		private fb: FormBuilder,
		private walletService: WalletService,
		private router: Router,
		private toastrService: ToastrService
	) {
		this.form = this.fb.group({
			mneumonic: ['', Validators.required],
		});
	}

	ngOnInit() {
		const wallet = this.walletService.create();
		this.walletService.setLocalStorage(LocalStorageKeysEnum.mneumonic, wallet.mnemonic.phrase);
		this.form.patchValue({
			mneumonic: wallet.mnemonic.phrase,
		});
	}

	copyToClipboard() {
		const selBox = document.createElement('textarea');
		selBox.style.position = 'fixed';
		selBox.style.left = '0';
		selBox.style.top = '0';
		selBox.style.opacity = '0';
		selBox.value = this.form.controls.mneumonic.value;
		document.body.appendChild(selBox);
		selBox.focus();
		selBox.select();
		document.execCommand('copy');
		document.body.removeChild(selBox);

		this.toastrService.success('Success', 'Address copied to clipboard!', {
			progressBar: true,
		});
	}

	confirmation() {
		this.router.navigate(['/create-confirm']);
	}

	downloadMneumonic() {
		this.dyanmicDownloadByHtmlTag({
			fileName: 'mneumonic',
			text: JSON.stringify(this.form.controls.mneumonic.value),
		});
		return;
	}

	private dyanmicDownloadByHtmlTag(arg: { fileName: string; text: string }) {
		if (!this.setting.element.dynamicDownload) {
			this.setting.element.dynamicDownload = document.createElement('a');
		}
		const element = this.setting.element.dynamicDownload;
		const fileType = arg.fileName.indexOf('.json') > -1 ? 'text/json' : 'text/plain';
		element.setAttribute('href', `data:${fileType};charset=utf-8,${encodeURIComponent(arg.text)}`);
		element.setAttribute('download', arg.fileName);

		var event = new MouseEvent('click');
		element.dispatchEvent(event);
	}
}
