import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class PromotionService
{
	private _URL: string;

	constructor(private _httpClient: HttpClient)
	{
		this._URL = `${localStorage.getItem("ipsw")}/promotions`;
	}

	promotionsByCenter(centerId: string)
	{
		return this._httpClient.get(`${this._URL}/store/${centerId}`);
	}

	promotionsByMaterial(centerId: string, materialId: string)
	{
		return this._httpClient.get(`${this._URL}/store/${centerId}/material/${materialId}`);
	}

	promoConditionsByCenter(centerId: string)
	{
		return this._httpClient.get(`${this._URL}/store/${centerId}/condition`);
	}

	materialPromoPreCond(centerId: string)
	{
		return this._httpClient.get(`${this._URL}/store/${centerId}/precondition`);
	}

	requiredCondition(centerId: string)
	{
		return this._httpClient.get(`${this._URL}/store/${centerId}/required/condition`);
	}

	discountPromotion(centerId: string)
	{
		return this._httpClient.get(`${this._URL}/store/${centerId}/discount/promotion`);
	}
}
