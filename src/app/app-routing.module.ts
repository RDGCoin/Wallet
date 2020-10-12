import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateConfirmComponent } from './create-confirm/create-confirm.component';
import { CreateComponent } from './create/create.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { RecoverComponent } from './recover/recover.component';
import { SwapComponent } from './swap/swap.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'recover', component: RecoverComponent },
  { path: 'create', component: CreateComponent },
  { path: 'create-confirm', component: CreateConfirmComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'swap', component: SwapComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
