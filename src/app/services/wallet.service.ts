import { Injectable } from '@angular/core';
import { ethers } from 'ethers';
import { environment } from 'src/environments/environment';
import { GlobalsService } from '../globals.service';
import { LocalStorageKeysEnum } from '../models/local-storage-keys.enum';

@Injectable({
	providedIn: 'root',
})
export class WalletService {
	constructor(public globals: GlobalsService) {}

	getLocalStorage(key: LocalStorageKeysEnum) {
		return JSON.parse(localStorage.getItem(key));
	}

	setLocalStorage(key: LocalStorageKeysEnum, data: any) {
		localStorage.setItem(key, JSON.stringify(data));
	}

	removeLocalStorage(key: LocalStorageKeysEnum) {
		localStorage.removeItem(key);
	}

	clearLocalStorage() {
		localStorage.clear();
	}

	create() {
		return ethers.Wallet.createRandom();
	}

	restore(mneumonic: string) {
		return ethers.Wallet.fromMnemonic(mneumonic);
	}

	async store(wallet: any, password: string) {
		const options = {
			scrypt: {
				N: 1 << environment.scryptDiff,
			},
		};
		const encrypted = await wallet.encrypt(password, options);
		this.setLocalStorage(LocalStorageKeysEnum.wallet, encrypted);
	}

	getFromStorage() {
		return this.getLocalStorage(LocalStorageKeysEnum.wallet);
	}

	decrypt(encryptedWallet, password: string) {
		return ethers.Wallet.fromEncryptedJson(encryptedWallet, password, (progress) => {
			this.globals.loaderProgress = (progress * 100).toFixed(2);
		});
	}

	loadContracts() {}
}
