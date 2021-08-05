import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
   providedIn: 'root',
})
export class ClientService
{
	private _URL: string = '';

	constructor(private _httpClient: HttpClient)
	{
		this._URL = `${localStorage.getItem("ipsw")}/clients`;
	}

	create(data: any): Observable<any>
	{
		return this._httpClient.post(`${this._URL}/new`, data);
	}


}
