import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class DrawerService {

	//readonly URL: string = 'http://localhost:8080/drawer';
	//readonly URL_DENOMINATION: string = 'http://localhost:8080/denomination';

	URL: string = '';
	URL_DENOMINATION: string = '';
	URL_SUFFIX: string = '/drawer';
	URL_DENOMINATION_SUFFIX: string = '/denomination';
	ipsw = ""

	constructor(private _httpClient: HttpClient, private _router: Router) {
		this.URL = localStorage.getItem("ipsw") + this.URL_SUFFIX;
		this.URL_DENOMINATION = localStorage.getItem("ipsw") + this.URL_DENOMINATION_SUFFIX;
	}

	createDrawer(formDrawer: any): Observable<any> {
		return this._httpClient.post(`${this.URL}/create`, formDrawer);
	}

	openDrawer(formDrawer: any): Observable<any> {
		return this._httpClient.post(`${this.URL}/open`, formDrawer);
	}

	getDrawers(centro: String): Observable<any> {
		return this._httpClient.post(`${this.URL}/list`, centro);
	}

	getDrawersMonto(centro: String): Observable<any> {
		return this._httpClient.post(`${this.URL}/list_monto`, centro);
	}

	getDrawersClosed(centro: String): Observable<any> {
		return this._httpClient.post(`${this.URL}/closedDrawersInCenter`, centro);
	}

	setLocalDrawers(drawers: any): void {
		localStorage.setItem("localDrawers", JSON.stringify(drawers));
	}

	createLocalDrawer(drawer: any): void {
		localStorage.setItem("currentDrawer", JSON.stringify(drawer));
	}

	createLocalAperture(drawer: any): void {
		localStorage.setItem("currentDrawerAperture", JSON.stringify(drawer));
	}

	setCenter(centro: any): void {
		localStorage.setItem("centro", centro);
	}

	createLocalClosedDrawer(drawer: any): void {
		localStorage.setItem("closedDrawer", JSON.stringify(drawer));
	}

	setStep(step: any, drawer_id: any): void {
		localStorage.setItem("current_step_" + drawer_id, step);
	}

	setCash(cash: any, drawer_id: any): void {
		localStorage.setItem("cash_" + drawer_id, cash);
	}

	setDrawerAperture(data: any, drawer_id: any): void {
		localStorage.setItem("drawer_aperture_" + drawer_id, JSON.stringify(data));
	}

	getDenominations(): Observable<any> {
		return this._httpClient.get(`${this.URL_DENOMINATION}/list`);
	}

	closeDrawer(drawer: any): Observable<any> {
		return this._httpClient.post(`${this.URL}/close`, drawer);
	}

	registerCash(data: any): Observable<any> {
		return this._httpClient.post(`${this.URL}/register_cash`, data);
	}

	createLocalDenominations(denominations: any): void {
		localStorage.setItem("denominations", JSON.stringify(denominations));
	}

	getBanks() {
		return this._httpClient.get(`${this.URL}/getBanks`);
	}

	registerDeposit(deposit: any): Observable<any> {
		return this._httpClient.post(`${this.URL}/deposit`, deposit);
	}

	existAperture(): boolean
	{
		let apertureId = localStorage.getItem('currentDrawer');
		let current_aperture = JSON.parse(localStorage.getItem('currentDrawerAperture'));
		apertureId = apertureId ? JSON.parse(localStorage.getItem('currentDrawer')).estatus : 'C';

		if (apertureId === 'A')
		{
			if(current_aperture != undefined){
				var today = new Date().setHours(0,0,0,0);
				var apertureDate = new Date(current_aperture.fecha).setHours(0,0,0,0);
				if(today > apertureDate){
					return false;
				}

				return true;
			}
			return true;
		}

		return false;
	}

}
