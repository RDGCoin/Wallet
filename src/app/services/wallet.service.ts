import { Injectable } from '@angular/core';
import { ethers } from 'ethers';
import { environment } from 'src/environments/environment';
import { GlobalsService } from '../globals.service';
import { LocalStorageKeysEnum } from '../models/local-storage-keys.enum';

import * as ERC20Contract from '../../../build/contracts/Token.json';
import * as SwapContract from '../../../build/contracts/TokenSwap.json';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Injectable({
	providedIn: 'root',
})
export class WalletService {
	constructor(public globals: GlobalsService, private spinner: NgxSpinnerService, private toastrService: ToastrService) {}

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

	async loadContracts() {
		this.globals.user.contractRDGCOIN = new ethers.Contract(environment.AddressRDGCoin, ERC20Contract.abi, this.globals.userWallet);
		this.globals.user.contractRDG = new ethers.Contract(environment.AddressRDG, ERC20Contract.abi, this.globals.userWallet);
		this.globals.user.contractSwap = new ethers.Contract(environment.AddressSwap, SwapContract.abi, this.globals.userWallet);
		this.readBalance();
		this.setTransferListener();
		this.globals.user.whitelisted = await this.globals.user.contractSwap.whitelisted(this.globals.userWallet.address);
	}

	setTransferListener() {
		this.globals.user.contractRDGCOIN.on('Transfer', (from, to) => {
			if (from == this.globals.userWallet.address || to == this.globals.userWallet.address) this.readBalance();
		});
		setInterval(() => {
			this.readBalance();
		}, 10000);
	}

	private async readBalance() {
<<<<<<< HEAD
		const [balanceRDGCoin, balanceRDG, eth] = await Promise.all([
			this.globals.user.contractRDGCOIN.balanceOf(this.globals.userWallet.address),
			this.globals.user.contractRDG.balanceOf(this.globals.userWallet.address),
			this.globals.ethersProvider.getBalance(this.globals.userWallet.address),
=======
    const adminRole = "0x0000000000000000000000000000000000000000000000000000000000000000"
		const [balanceRDGCoin, balanceRDG, eth, admin] = await Promise.all([
			this.globals.user.contractRDGCOIN.balanceOf(this.globals.userWallet.address),
			this.globals.user.contractRDG.balanceOf(this.globals.userWallet.address),
      this.globals.ethersProvider.getBalance(this.globals.userWallet.address),
      this.globals.user.contractSwap.hasRole(adminRole, this.globals.userWallet.address)
>>>>>>> 3354005d36dbecdda6fe7e25f787fd00d6d64a6b
		]);
		this.globals.user.balance = Number(ethers.utils.formatEther(balanceRDGCoin));
		this.globals.user.balanceRDG = Number(ethers.utils.formatUnits(balanceRDG, 8));
		this.globals.user.eth = Number(ethers.utils.formatEther(eth));
<<<<<<< HEAD
		this.globals.user.lowGas = eth.lte(ethers.utils.parseEther(environment.minimumGas.toFixed(18)));
=======
    this.globals.user.lowGas = eth.lte(ethers.utils.parseEther(environment.minimumGas.toFixed(18)));
    this.globals.user.hasAdmin = admin;
>>>>>>> 3354005d36dbecdda6fe7e25f787fd00d6d64a6b
	}

	transfer(address: string, value: number) {
		this.processCall(this.globals.user.contractRDGCOIN.transfer(address, ethers.utils.parseEther(value.toFixed(18))));
	}

	transferETH(address: string, value: number) {
		this.processCall(
			this.globals.userWallet.sendTransaction({
				to: address,
				value: ethers.utils.parseEther(value.toFixed(18)),
			})
		);
	}

	approveRDG() {
		this.processCall(
			this.globals.user.contractRDG.approve(
				environment.AddressSwap,
				ethers.utils.parseEther(this.globals.user.balanceRDG.toFixed(18))
			)
		);
	}

	swapRDG() {
		this.processCall(this.globals.user.contractSwap.swap(ethers.utils.parseUnits(this.globals.user.balanceRDG.toFixed(8), 8)));
	}

<<<<<<< HEAD
=======
  async sendWhitelist(addresses: string[]) {
    this.processCall(this.globals.user.contractSwap.whitelistAdd(addresses));
  }

>>>>>>> 3354005d36dbecdda6fe7e25f787fd00d6d64a6b
	processCall(call: any, resolve = () => {}, errAns = () => {}) {
		this.globals.loaderProgress = '';
		this.spinner.show();
		let loader = 0;
		const interval = setInterval(() => {
			loader += ((100 - loader) * 3 * Math.random()) / (5 + loader);
			if (loader > 99.9) loader = 99.99;
			this.globals.loaderProgress = loader.toFixed(2);
		}, 100);
		call.then(
			(tx) => {
				tx.wait().then((receipt) => {
					this.spinner.hide();
					clearInterval(interval);
					this.toastrService.success(
						'Successo',
						'Transação ' + receipt.transactionHash + ' completada no bloco ' + receipt.blockNumber,
						{
							progressBar: true,
						}
					);
					resolve();
				}),
					(err) => {
						clearInterval(interval);
						this.showErr(err);
						errAns();
					};
			},
			(err) => {
				clearInterval(interval);
				this.showErr(err);
				errAns();
			}
		);
	}

	showErr(err: any) {
		console.warn(err);
		this.globals.loaderProgress = '';
		const toastr = this.toastrService.error('Erro', 'Erro na transação: ' + err, {
			progressBar: true,
		});
		if (toastr)
			toastr.onHidden.subscribe(() => {
				this.spinner.hide();
			});
	}
}
