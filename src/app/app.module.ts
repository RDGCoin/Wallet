import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RecoverComponent } from './recover/recover.component';
import { CreateComponent } from './create/create.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SwapComponent } from './swap/swap.component';
import { CreateConfirmComponent } from './create-confirm/create-confirm.component';
import { ToastrModule } from 'ngx-toastr';
import { NgxSpinnerModule } from 'ngx-spinner';
import { GlobalsService } from './globals.service';
import { WalletService } from './services/wallet.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
	declarations: [
		AppComponent,
		LoginComponent,
		RecoverComponent,
		CreateComponent,
		DashboardComponent,
		SwapComponent,
		CreateConfirmComponent,
	],
	imports: [BrowserModule, AppRoutingModule, NgxSpinnerModule, ToastrModule.forRoot(), FormsModule, ReactiveFormsModule],
	providers: [WalletService, GlobalsService],
	bootstrap: [AppComponent],
})
export class AppModule {}
