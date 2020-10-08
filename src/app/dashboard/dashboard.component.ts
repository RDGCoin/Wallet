import { Component, OnInit } from '@angular/core';
import { ethers } from 'ethers';
import { ToastrService } from 'ngx-toastr';
import { GlobalsService } from '../globals.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
	constructor(public globals: GlobalsService, private toastrService: ToastrService, private modalService: NgbModal) {}

	smallAddress: string;

	ngOnInit(): void {
		this.smallAddress = this.globals.userWallet.address.substr(0, 6) + '...' + this.globals.userWallet.address.substr(38);
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
