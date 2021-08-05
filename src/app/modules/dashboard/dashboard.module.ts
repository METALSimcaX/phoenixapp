import { PaymentModule } from './../payment/payment.module';
import { RouterModule, Routes } from '@angular/router';
import { NavHeaderModule } from '../../components/nav-header/nav-header.module';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ToastrModule } from 'ngx-toastr';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { SidemenuModule } from '../../components/sidemenu/sidemenu.module';
import { DASHBOARD_ROUTES } from './dashboard.routes';
import { ViaticoModule } from '../viatico/viatico.module';
import { StatisticModule } from '../statistic/statistic.module';
import { PendingPaymentModule } from '../pending-payment/pending-payment.module';

const NEST_ROUTES: Routes = [
	{ path: '', component: DashboardComponent, children: DASHBOARD_ROUTES },
];

@NgModule({
	declarations: [
		DashboardComponent
	],
	imports: [
		CommonModule,
		RouterModule.forChild(NEST_ROUTES),
		BsDropdownModule,
		ToastrModule,
		CollapseModule,
		SidemenuModule,
		NavHeaderModule,
		PaymentModule,
		ViaticoModule,
		StatisticModule,
		PendingPaymentModule
	],
	exports: [RouterModule]
})
export class DashboardModule { }
