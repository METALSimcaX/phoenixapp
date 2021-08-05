import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './modules/auth/auth.component';
import { AuthGuardService as AuthGuard } from './guards/auth-guard.service';
import { StatisticComponent } from './modules/statistic/statistic.component';
import { SettingsComponent } from './modules/settings/settings.component';

const routesConfig: Routes = [
	{ path: 'login', component: AuthComponent },
	{ path: '', loadChildren: () => import('./modules/dashboard/dashboard.module').then(m => m.DashboardModule), canLoad: [AuthGuard] },
	//{ path: '', component: AuthComponent },
	{ path: '**', redirectTo: 'dashboard' },
	{ path: 'city/dashboard', component: StatisticComponent },
    { path: 'city/settings', component: SettingsComponent }
	//{ path: 'dashboard', loadChildren: () => import('./modules/dashboard/dashboard.module').then(m => m.DashboardModule), canLoad: [AuthGuard] } 
];

/*const _routesConfig: Routes = [
	{ path: '', component: AuthComponent },
	{ path: 'app', loadChildren: () => import('./modules/dashboard/dashboard.module').then(m => m.DashboardModule), canLoad: [AuthGuard] },
	{ path: '**', redirectTo: '' }
];*/

@NgModule({
	declarations: [],
	imports: [
		CommonModule,
		RouterModule.forRoot(routesConfig)
	],
	exports: [RouterModule]
})
export class AppRoutingModule
{}
