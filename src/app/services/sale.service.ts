import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class SaleService 
{
	private _URL: string = '';

	constructor(private _httpClient: HttpClient) 
	{
		this._URL = `${localStorage.getItem("ipsw")}/sale`;
	}

	create(data: any): Observable<any> 
	{
		return this._httpClient.post(`${this._URL}/new`, data);
	}

	createSafe(data: any): Observable<any> 
	{
		return this._httpClient.post(`${this._URL}/new_sale`, data);
	}

	processPendingSale(data: any): Observable<any> 
	{
		return this._httpClient.post(`${this._URL}/process_pending_sale`, data);
	}

	getSalesOfAperture(data: any): Observable<any> 
	{
		return this._httpClient.post(`${this._URL}/getSales`, data);
	}

	getSalesWithFilter(filter: any): Observable<any> 
	{
		return this._httpClient.post(`${this._URL}/getSalesFilter`, filter);
	}

	getPaidPending(): Observable<any>
	{
		return this._httpClient.get(`${this._URL}/paid-account/all`);
	}

	updatePaidPending(saleId: any, dataReplace: any): Observable<any>
	{
		return this._httpClient.put(`${this._URL}/paid-account/${saleId}`, dataReplace);
	}

}
