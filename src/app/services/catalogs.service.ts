import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
​
@Injectable({
	providedIn: 'root'
})
export class CatalogsService
{
	private _URL: string;
	private _mandante: number;
	private _payjoyApiKey: string;
​
	constructor(private _httpClient: HttpClient)
	{
		this._mandante = environment.mandante;
		this._URL = `${localStorage.getItem("ipsw")}`;
		this._payjoyApiKey = '6JgJoq7tmdoyx4W-M9vlzHpmANtxB289';
	}
​
	findCredentialInfo(username: string)
	{
		return this._httpClient.get(`${this._URL}/credentials/find/${username}`);
	}
​
	findCredentialInfoBy(username: string)
	{
		return this._httpClient.get(`${this._URL}/credentials/find/${username}`);
	}
​
	allPaymentMethods()
	{
		return this._httpClient.get<any[]>(`${this._URL}/payment-methods/`);
	}
​
	materialsByServiceCenter(center: string)
	{
		return this._httpClient.get(`${this._URL}/materials/list/all/${center}`);
	}
​
	allClients()
	{
		return this._httpClient.get(`${this._URL}/clients/`);
	}
​
	findClientById(clientId: string)
	{
		return this._httpClient.get(`${this._URL}/clients/find/${clientId}`);
	}
​
	getCountryList()
	{
		return this._httpClient.get(`${this._URL}/countries/`);
	}
​
	getMaterialWithPrice(centerId: string)
	{
		return this._httpClient.get(`${this._URL}/materials/price/${centerId}`);
	}
​
	getPriceListByCenter(centerId: string)
	{
		return this._httpClient.get(`${this._URL}/materials/price/all/${centerId}`);
	}
​
	getCenterName(centerId: string)
	{
		return this._httpClient.get(`${this._URL}/centers/find/${centerId}`);
	}
​
	/**
	 * @deprecated Ya no se va a usar
	 * @description Devuelve los datos del cliente a traves de un contrado SL
	 * @param financingId SL de financiamiento
	 * @method GET
	 * @location Spring Web Service
	 * @returns Observable<Object>
	 */
	getFinancingClient(financingId: string)
	{
		return this._httpClient.get(`${this._URL}/client/financing/${financingId}`);
	}
​
	/**
	 * @description Realiza el guardado de una venta ZVT de financiamiento en SAP S4 HANA
	 * @param financingInfo Objeto con los datos del registro de abono a su cuenta
	 * @method POST
	 * @location Spring Web Service
	 * @returns Observable<Object>
	 */
	saveFinancingSAP(financingInfo: any)
	{
		return this._httpClient.post(`${this._URL}/sale/financing/new`, financingInfo);
	}
​
	/**
	 * @description Realiza el guardado de un abono por via de abono: MacroPay Financing o PayJoy
	 * @param paidInfo - { paidDetails: Object ,method: List }
	 * @returns Observable
	 */
	savePaidAccount(paidInfo: { paidDetails: any, method: any[] })
	{
		return this._httpClient.post(`${this._URL}/sale/paid-account/new`, paidInfo);
	}

	/**
	 * @description Realiza el guardado de un abono por via de abono: MacroPay Financing o PayJoy; con estatus PENDIENTE (PROCESSED = FALSE)
	 * @param paidInfo - { paidDetails: Object ,method: List }
	 * @returns Observable
	 */
	savePendingPaid(paidInfo: { header: any, detail: any, method: any })
	{
		return this._httpClient.post(`${this._URL}/sale/paid-account/pending`, paidInfo);
	}
​
	/**
	 * @url DEV-PRIV: http://192.168.162.12:8001 | PROD-PUB: http://201.149.90.163:8001 | QA-PRIV: http://192.168.162.23:8001
	 * @proxy `/getstock`
	 * @param center_id 
	 * @returns Observable
	 */
	getStockByCenter(center_id: string)
	{
		return this._httpClient.get(`${environment.urlStock}/getstock/getstock?sap-client=${this._mandante}&plant=${center_id}`);
	}
​
	/**
	 * @url DEV-PRIV: http://192.168.162.12:8001 | PROD-PUB: http://201.149.90.163:8001 | QA-PRIV: http://192.168.162.23:8001
	 * @proxy `/getstock`
	 * @param centerId 
	 * @param materialId 
	 * @returns Observable
	 */
	getStockByMaterial(centerId: string, materialId: string)
	{
		return this._httpClient.get(`${environment.urlStock}/getstock/getstock?sap-client=${this._mandante}&plant=${centerId}&material=${materialId}`);
	}
​
	/**
	 * @description Devuelve a un material por centro y material de filtrado
	 * @url DEV-PRIV: http://192.168.162.12:8001 | PROD-PUB: http://201.149.90.163:8001 | QA-PRIV: http://192.168.162.23:8001
	 * @proxy `/getstock`
	 * @param centerId 
	 * @param imei 
	 * @returns Observable
	 */
	getMaterialByIMEI(centerId: string, imei: string)
	{
		return this._httpClient.get(`${environment.urlStock}/getstock/getstock?sap-client=${this._mandante}&plant=${centerId}&imei=${imei}`);
	}
​
	/**
	 * @description Este servicio apunta a la URL de https://servicios.grupomacro.mx:4444
	 * @url https://servicios.grupomacro.mx:4444
	 * @proxy `/ApiMacropay`
	 * @param ticketSL - Codigo de Financiamiento de abonar
	 * @returns Observable
	 */
	getAbonoMP(ticketSL: string): any
	{
		return this._httpClient.get(`${environment.urlInfoAbono}/ApiMacropay/public/index.php/api/${environment.urlInfoAbonoComp}/${ticketSL}`);
	}
​
	/**
	 * @description Devuelve una lista de tickets de financiamiento pendientes
	 * @url http://10.1.2.109:8001
	 * @proxy `/api`
	 * @param centerId 
	 * @param dateFilter 
	 * @returns Observable
	 */
	getAllTicketMP(centerId: string, dateFilter: string = '')
	{
		return this._httpClient.post(`${environment.urlReanudarFin}/api/TickectSap`, { peticion: "ConsultarTicketSap", centroSap: centerId, fecha: dateFilter });
	}
​
	/**
	 * @description Notifica al WebService de MacroPay sobre si realizo un pago de una reanudación de ticket
	 * @url http://10.1.2.109:8001
	 * @proxy `/api`
	 * @param ticket 
	 * @param saleDocument 
	 * @returns Observable
	 */
	confirmPaymentMP(ticket: string, saleDocument: string)
	{
		return this._httpClient.post(`${environment.urlReanudarFin}/api/ConfirmarPagoSap`, { peticion: "DocumentosPagosSap", ticket: ticket, docventa: saleDocument, bstkd: ticket.substring(2)});
	}
​
	/**
	 * @description Realizar el registro de un pago a financiamiento con el WS de MacroPay
	 * @url `PROD:` https://www.appcredito.macropay.com.mx | `DEV:` https://www.testappcredito.macropay.com.mx
	 * @proxy `/record-customer-payment`
	 * @param financingParams
	 * @returns Observable
	 */
	saveFinancingPayment(financingParams: any)
	{
		var httpOptions = new HttpHeaders({
			'Content-Type': 'application/json',
			'Authorization': 'Basic '+btoa(`${environment.authUserMP}:${environment.authPassMP}`)
		});
​
		return this._httpClient.get(`${environment.urlSaveAbono}/record-customer-payment`, { headers: httpOptions, params: financingParams });
	}
​
	/**
	 * @description Metodo para obtener los pagos de financiamiento y producto registrado para este
	 * @url https://partner.payjoy.com/v1
	 * @proxy PROD: `/v1` | DEV; `/api/partner`
	 * @param financingParams - customerLocator: phoneNumber|deviceTag|IMEI
	 * @returns Observable
	 */
	getPayJoyPayments(clientContract: string)
	{
		var apiParam = {
			key: this._payjoyApiKey,
			customerLocator: clientContract
		};

		return this._httpClient.get(`${environment.urlPayjoy}/partner/v1/lookup-customer.php`, { params: apiParam });
	}
​
	/**
	* @description Metodo para registrar el pago del financiamiento
	* @url https://partner.payjoy.com/v1
	* @proxy PROD: `/v1` | DEV; `/api/partner`
	* @param financingParams - { financeOrderId: clientContract, amount: paymentAmount }
	* @returns Observable
	*/
	setPJPayment(financingParams: any)
	{
		var apiParam = { 
			key: this._payjoyApiKey, 
			financeOrderId: financingParams.financeOrderId, 
			amount: financingParams.amount, 
			merchantId: '195804', 
			salesClerkId: '24748',
			currency: 'MXN'
		};

		return this._httpClient.get(`${environment.urlPayjoy}/partner/v1/record-customer-payment.php`, { params: apiParam });
	}
​
	/**
	* @description Metodo para obtener los datos del cliente en financiamiento
	* @url https://partner.payjoy.com/v1
	* @proxy PROD: `/v1` | DEV; `/api/partner`
	* @param financingParams - { start, end, id }
	* @returns Observable
	*/
	getPJClientInfo(financingParams: { id: any, time: number })
	{
		let starttime = financingParams.time - 10;
		let endtime= financingParams.time + 10;
		let apiParam = { 
			key: this._payjoyApiKey, 
			endtime: endtime.toString(),
			starttime: starttime.toString(),
			filter: `financeOrder.id:${financingParams.id}`
		};

		return this._httpClient.get(`${environment.urlPayjoy}/partner/v1/list-transactions.php`, { params: apiParam });
	}
​
	
	makePhoneRecharge(rechargeRequest): any
	{
		return this._httpClient.post(`${this._URL}/mercurio/recarga_tae`,rechargeRequest);
	}
​
	getServices(){
		return this.services;
	}
​
	getCompanies(){
		return this.companies;
	}
​
	services = [
		{
			"id":1,
			"nombre":"Telmex",
			"imagen":"telmex.png"
		},
		{
			"id":2,
			"nombre":"CFE",
			"imagen":"cfe.png"
		},
		{
			"id":3,
			"nombre":"Totalplay",
			"imagen":"totalplay.png"
		},
		{
			"id":4,
			"nombre":"IZZI",
			"imagen":"izzi.png"
		},
		{
			"id":5,
			"nombre":"Dish",
			"imagen":"dish.png"
		},
		{
			"id":6,
			"nombre":"Japay",
			"imagen":"japay.png"
		}
	]
​
	companies = [
		{
		   "id":1,
		   "nombre":"TAE",
		   "imagen":"telcel.png",
		   "montos":[
			  {codigo: "A010" , valor: 10},
			  {codigo: "A020" , valor: 20},
			  {codigo: "A030" , valor: 30},
			  {codigo: "A050" , valor: 50},
			  {codigo: "A080" , valor: 80},
			  {codigo: "A100" , valor: 100},
			  {codigo: "A150" , valor: 150},
			  {codigo: "A200" , valor: 200},
			  {codigo: "A300" , valor: 300},
			  {codigo: "A500" , valor: 500}
		   ]
		},
		{
		   "id":64,
		   "nombre":"Amigo Sin Límite",
		   "imagen":"telcel.png",
		   "montos":[
			{codigo: "SL020" , valor: 20},
			{codigo: "SL030" , valor: 30},
			{codigo: "SL050" , valor: 50},
			{codigo: "SL080" , valor: 80},
			{codigo: "SL100" , valor: 100},
			{codigo: "SL150" , valor: 150},
			{codigo: "SL200" , valor: 200},
			{codigo: "SL300" , valor: 300},
			{codigo: "SL500" , valor: 500}
		   ]
		},
		{
		   "id":67,
		   "nombre":"Internet Amigo",
		   "imagen":"telcel.png",
		   "montos":[
			{codigo: "INT10" , valor: 10},
			{codigo: "INT30" , valor: 30},
			{codigo: "INT50" , valor: 50},
			{codigo: "INT80" , valor: 80},
			{codigo: "INT100" , valor: 100},
			{codigo: "INT150" , valor: 150},
			{codigo: "INT200" , valor: 200},
			{codigo: "INT300" , valor: 300},
			{codigo: "INT500" , valor: 500}
		   ]
		},
		{
		   "id":98,
		   "nombre":" Paquete Ilimitado 30",
		   "imagen":"telcel.png",
		   "montos":[
			{codigo: "ILIM30" , valor: 15}
		   ]
		}
	];

	getSalesmanListByCenter(centerId: string)
	{
		return this._httpClient.get(`${this._URL}/salesman/center/${centerId}`);
	}
​
}