import { Component } from '@angular/core';
import { GlobalsService } from './globals.service';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
})
export class AppComponent {
	title = 'Wallet';
	constructor(public globals: GlobalsService) {}
}
