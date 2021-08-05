import { SaleService } from './../../services/sale.service';
import { ClientService } from './../../services/client.service';
import { PaymentType } from './../../interfaces/payment-type.interface';
import { Observable } from 'rxjs';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { BsModalRef, ModalDirective } from 'ngx-bootstrap/modal'
import { CatalogsService } from 'src/app/services/catalogs.service';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { ToastrService } from "ngx-toastr";
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { DatePipe } from '@angular/common';
import { environment } from 'src/environments/environment';
import { PromotionService } from 'src/app/services/promotion.service';
import { ItemCart } from 'src/app/interfaces/item-cart.interface';
import { ItemFinancing } from 'src/app/interfaces/item-financing.interface';
import { GenericAlertService } from 'src/app/utils/generic-alert.service';
import { PromotionItem } from 'src/app/interfaces/promotion.interface';

import swal from "sweetalert2";
import * as moment from 'moment/moment';
import * as printerjs from 'print-js';
import { jsPDF } from "jspdf";
import html2canvas from 'html2canvas';
import { Container, Main, tsParticles } from 'tsparticles';
import { SalesmanService } from 'src/app/services/salesman.service';

enum SelectionType
{
	single = "single",
	multi = "multi",
	multiClick = "multiClick",
	cell = "cell",
	checkbox = "checkbox"
}

enum sizeContent
{
	SM = 'modal-sm',
	MD = 'modal-md',
	LG = 'modal-lg',
	XL = 'modal-xl',
};

enum typeMethods
{
	CONT = "contado",
	FIN = "financiamiento",
	RFIN = "reanudacion",
	SERV = "servicios",
	TAE = "tiempo aire"
}

@Component({
	selector: 'app-payment',
	templateUrl: './payment.component.html',
	styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit 
{
	// Variables de configuracion general en POS
	storeName: string;
	userName: string;
	userCenter: string;
	userSaleman: string;
	userSalemanName: string;
	apertureId: number;
	cajaId: number;
	ticketId: string;
	informationTicket: any;
	complementTicket: string;
	typeUsoCdfi: string;
	canShowPOS: boolean;
	private _functionPlatform: typeMethods;

	// ModalInstances
	modalRef: BsModalRef;
	modalTitle: string;
	modalSearchPlaceHolder: string;
	modalSize: string;

	// Array de datos
	stockList: any;
	private _notifyPromo: any[];
	cartItemList: any[];
	resourceDataTable: any[];
	originResourceData: any[];
	resourcePromotion: any[];
	paymentList: any[];
	materialList: any[];
	countryList: any[];
	typeCardMethods: any[];
	ticketFinList: any[];
	paymentSell: PaymentType[];
	columnDataTable: Array<string>;
	activePromos: any[];
	promotionList: PromotionItem[];
	private _promotionTemp: PromotionItem[];
	
	showAddButton: boolean;
	showSelectButton: boolean;
	blockAfterSale: boolean;
	amoutPay: any;
	formClient: FormGroup;
	paymentIdModal: string;
	paymentCardIdModal: number;
	paymentCardIdModalArr: any = {};
	amoutPayArr: any = {};
	private _dateTimeStartSale: string;

	// Config object for client default that will can sell
	activeClient: { clientName: string; clientNumber: string; clientRfc: string; clientEmail: string };

	entries: number = 10;
	selected: any[] = [];
	activeRow: any;
	SelectionType = SelectionType;
	phoneNumberForRecharge = "";
	phoneA = "";
	phoneB = "";

	current_drawer: any;
	company_selected: any;
	service_selected: any = null;
	monto_selected = "";
	recharge_step = 1;
	itemItsARecharge = false;
	service_step = 1;
	services = [];
	companies = [];
	private service_code = "";
	showConfetti: boolean;

	options = {
		background: {
			color: {
			value: "transparent"
			}
		},
		fullScreen: {
			enable: true,
			zIndex: -1
		},
		interactivity: {
			detectsOn: "window"
		},
		emitters: {
			position: {
			x: 50,
			y: 100
			},
			rate: {
			quantity: 10,
			delay: 0.25
			}
		},
		particles: {
			color: {
			value: ["#1E00FF", "#FF0061", "#E1FF00", "#00FF9E"]
			},
			move: {
			decay: 0.05,
			direction: "top",
			enable: true,
			gravity: {
				enable: true
			},
			outModes: {
				top: "none",
				default: "destroy"
			},
			speed: { min: 25, max: 50 }
			},
			number: {
			value: 0
			},
			opacity: {
			value: 1
			},
			rotate: {
			value: {
				min: 0,
				max: 360
			},
			direction: "random",
			animation: {
				enable: true,
				speed: 30
			}
			},
			tilt: {
			direction: "random",
			enable: true,
			value: {
				min: 0,
				max: 360
			},
			animation: {
				enable: true,
				speed: 30
			}
			},
			size: {
			value: 8
			},
			roll: {
			darken: {
				enable: true,
				value: 25
			},
			enable: true,
			speed: {
				min: 5,
				max: 15
			}
			},
			wobble: {
			distance: 30,
			enable: true,
			speed: {
				min: -7,
				max: 7
			}
			},
			shape: {
			type: [
				"circle",
				"square",
				"polygon",
				"character",
				"character",
				"character",
				"image",
				"image",
				"image"
			],
			options: {
				image: [
				{
					src: "https://particles.js.org/images/fruits/apple.png",
					width: 32,
					height: 32,
					particles: {
					size: {
						value: 16
					}
					}
				},
				{
					src: "https://particles.js.org/images/fruits/avocado.png",
					width: 32,
					height: 32,
					particles: {
					size: {
						value: 16
					}
					}
				},
				{
					src: "https://particles.js.org/images/fruits/banana.png",
					width: 32,
					height: 32,
					particles: {
					size: {
						value: 16
					}
					}
				},
				{
					src: "https://particles.js.org/images/fruits/berries.png",
					width: 32,
					height: 32,
					particles: {
					size: {
						value: 16
					}
					}
				},
				{
					src: "https://particles.js.org/images/fruits/cherry.png",
					width: 32,
					height: 32,
					particles: {
					size: {
						value: 16
					}
					}
				},
				{
					src: "https://particles.js.org/images/fruits/grapes.png",
					width: 32,
					height: 32,
					particles: {
					size: {
						value: 16
					}
					}
				},
				{
					src: "https://particles.js.org/images/fruits/lemon.png",
					width: 32,
					height: 32,
					particles: {
					size: {
						value: 16
					}
					}
				},
				{
					src: "https://particles.js.org/images/fruits/orange.png",
					width: 32,
					height: 32,
					particles: {
					size: {
						value: 16
					}
					}
				},
				{
					src: "https://particles.js.org/images/fruits/peach.png",
					width: 32,
					height: 32,
					particles: {
					size: {
						value: 16
					}
					}
				},
				{
					src: "https://particles.js.org/images/fruits/pear.png",
					width: 32,
					height: 32,
					particles: {
					size: {
						value: 16
					}
					}
				},
				{
					src: "https://particles.js.org/images/fruits/pepper.png",
					width: 32,
					height: 32,
					particles: {
					size: {
						value: 16
					}
					}
				},
				{
					src: "https://particles.js.org/images/fruits/plum.png",
					width: 32,
					height: 32,
					particles: {
					size: {
						value: 16
					}
					}
				},
				{
					src: "https://particles.js.org/images/fruits/star.png",
					width: 32,
					height: 32,
					particles: {
					size: {
						value: 16
					}
					}
				},
				{
					src: "https://particles.js.org/images/fruits/strawberry.png",
					width: 32,
					height: 32,
					particles: {
					size: {
						value: 16
					}
					}
				},
				{
					src: "https://particles.js.org/images/fruits/watermelon.png",
					width: 32,
					height: 32,
					particles: {
					size: {
						value: 16
					}
					}
				},
				{
					src: "https://particles.js.org/images/fruits/watermelon_slice.png",
					width: 32,
					height: 32,
					particles: {
					size: {
						value: 16
					}
					}
				}
				],
				polygon: [
				{
					sides: 5
				},
				{
					sides: 6
				}
				],
				character: [
				{
					fill: true,
					font: "Verdana",
					value: ["💩", "🤡", "🍀", "🍙", "🦄", "⭐️"],
					style: "",
					weight: 400
				}
				]
			}
			}
		}
	};

	@ViewChild('promotionModal', { static: true }) modalPromotions: ModalDirective;
	@ViewChild('dinamicModal', { static: false }) modalDirective: ModalDirective;
	@ViewChild('returnTicket', { static: false }) _modalTicketMP: ModalDirective;
	@ViewChild('tableWrapper') tableWrapper: any;
  	@ViewChild(DatatableComponent) table: DatatableComponent;
	@ViewChild('inputcodebar') inputCodeBar: ElementRef;

	constructor(
		private _catalogService: CatalogsService, 
		private _toastService: ToastrService, 
		private _clientService: ClientService, 
		private _saleService: SaleService,
		private _spinnerService: NgxSpinnerService,
		private _datePipe: DatePipe,
		private _promotionService: PromotionService,
		private _genericAlertService: GenericAlertService,
		private _salesmanService: SalesmanService)
	{
		this.canShowPOS = false;
	}

	async ngOnInit()
	{
		// INICIALIZACION DE VARIABLES CON DEFAULT VALUES
		this.showConfetti = false;
		this.modalSize = '';
		this.modalTitle = '';
		this.modalSearchPlaceHolder = '';
		this.cartItemList = [];
		this.columnDataTable = [];
		this.resourceDataTable = [];
		this.materialList = [];
		this.countryList = [];
		this.stockList = null;
		this.ticketFinList = [];
		this.activePromos = [];
		this.promotionList = [];
		this._notifyPromo = [];
		this._promotionTemp = [];
		this._functionPlatform = null;
		this.informationTicket = null;

		this._dateTimeStartSale = '';
		this.amoutPay = 0.00;
		this.paymentSell = [];
		this.showAddButton = false;
		this.showSelectButton = false;
		this.blockAfterSale = false;
		this.paymentIdModal = '1';
		this.paymentCardIdModal = 1;
		this.typeUsoCdfi = 'P01';
		this.typeCardMethods = [{ id: 1, nombre: 'Bancomer' }, { id: 2, nombre: 'Banamex' }, { id: 3, nombre: 'HSBC' }];

		let alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
		this.complementTicket = '';//`${alphabet[this._getRandomNumber(0, 25)].toUpperCase()}${this._getRandomNumber(1, 999)}`;
		this.ticketId = '';

		this._setCashboxInfo();
		this._initClientForm();
		this._setDefaultClient();
		this.ticketId = this._getTicketSale();

		// INICIALIZA PETICIONES ASINCRONAS
		let activeSessionSalesman = this._salesmanService.existActiveSalesman();
		
		if(!activeSessionSalesman)
		{
			let isAssignSalesman = await this._salesmanService.changeActiveSaleman(true, false, false); // console.warn("Return, ", isAssignSalesman);
			this.canShowPOS = isAssignSalesman;
		}
		else
		{
			this.canShowPOS = true;
		}

		if(!this.canShowPOS) return true;

		this._spinnerService.show();

		this.services = this._catalogService.getServices();
		this.companies = this._catalogService.getCompanies();

		this._requestCountries();
		this._processPromotions();

		if(this.userSaleman == null) this.userSaleman = '';

		this.current_drawer = JSON.parse(localStorage.getItem("currentDrawer"));

		try
		{
			let responseCenter: any = await this._catalogService.getCenterName(this.userCenter).toPromise();
			this.storeName = responseCenter.status === 'success' ? responseCenter.data.nombre:'Centro no registrado';
		}
		catch(errCenter)
		{
			this.storeName = '';
			console.warn('Ocurrió un error en la petición para obtener el nombre del centro: ', this.userCenter);
		}

		try
		{
			this.materialList = [];
			let responseMaterial: any = await this._catalogService.materialsByServiceCenter(this.userCenter).toPromise();
			
			if(responseMaterial)
			{
				console.log("RESPONSE MATERIALES POR CENTRO EXITO");
				let mat = [...responseMaterial];
				let priceList: any = await this._catalogService.getPriceListByCenter(this.userCenter).toPromise();
				console.log("PRICELIST. ", priceList.length);
				this.materialList = mat.map((e: any) => {
					let existPrice = priceList.find((m: any) => m[1] === e.materialId);
					return { ...e, price: (existPrice ? existPrice[0]:0) };
				});
			}
			else
			{
				this._genericAlertService.createToastAlert("Información", "No se encontraron materiales", "info");
			}
			console.log("MAT INIT _> ", this.materialList);
			this._spinnerService.hide();
		}
		catch(errMat: any)
		{
			this._spinnerService.hide();
			console.warn(`Ocurrió un error al obtener los materiales del centro: ${this.userCenter}`, errMat);
			this._genericAlertService.createToastAlert("Error", "Ocurrió un errror al solicitar la lista de materiales", "danger");
		}

		let _salesmanName = JSON.parse(localStorage.getItem("activeSalesman")).name;
		this._genericAlertService.createSweetAlert(`Ha iniciado sus credenciales de vendedor como ${_salesmanName}`, '', 'info');

		/*if(this.userSaleman == undefined || this.userSaleman == "")
		{
			swal.fire({ icon: 'warning', title: 'Atencion. Tu usuario no cuenta con id de vendedor \n tus ventas NO generaran comisión. \n Por favor contacta con tu gerente de zona.' })
		}*/
	}

	private _setCashboxInfo()
	{
		let _storageAuth = localStorage.getItem('authUser') ? JSON.parse(localStorage.getItem('authUser')):null;

		let activeSessionSalesman = this._salesmanService.existActiveSalesman();
		let objectSalesman = activeSessionSalesman ? JSON.parse(localStorage.getItem('activeSalesman')):false;
		this.userSaleman = objectSalesman ? objectSalesman.salesmanId:'';
		this.userSalemanName = objectSalesman ? `${objectSalesman.name}`:'Vendedor no registrado';

		let storageAuth = localStorage.getItem('authUser') ? JSON.parse(localStorage.getItem('authUser')):null;
		this.userName = storageAuth ? storageAuth.username:'';
		this.userCenter = localStorage.getItem('centro') ? localStorage.getItem('centro'):'';
		this.apertureId = localStorage.getItem('currentDrawerAperture') ? JSON.parse(localStorage.getItem('currentDrawerAperture')).id:0;
		//this.cajaId = localStorage.getItem('currentDrawerAperture') ? JSON.parse(localStorage.getItem('currentDrawerAperture')).caja:0;
		this.cajaId = localStorage.getItem('currentDrawer') ? JSON.parse(localStorage.getItem('currentDrawer')).caja:0;
	}

	private _setDefaultClient()
	{
		this.activeClient = { clientName: 'Publico General', clientEmail: 'mariana.tello@grupomacro.mx', clientNumber: environment.defaultClient, clientRfc: 'XAXA010101000' };
	}

	validateClientNumber(): boolean
	{
		let _defaultClient: any = environment.defaultClient;
		return (this.activeClient.clientNumber.trim() === _defaultClient.trim());
	}

	private _initClientForm()
	{
		this.formClient = new FormGroup({
			title: new FormControl('persona', [Validators.required]),
			name: new FormControl('', [Validators.required, Validators.maxLength(120)]),
			apellidopaterno: new FormControl(' '),
			apellidomaterno: new FormControl(' '),
			rfc: new FormControl('', [Validators.required, Validators.maxLength(30)]),
			email: new FormControl('', [Validators.required, Validators.maxLength(241)]),
			telefono: new FormControl('', [Validators.required, Validators.maxLength(15)]),
			street: new FormControl('', [Validators.required, Validators.maxLength(35)]),
			numcasa: new FormControl('', [Validators.required, Validators.maxLength(6)]),
			cp: new FormControl('', [Validators.required, Validators.maxLength(5)]),
			city: new FormControl('', [Validators.required, Validators.maxLength(35)]),
			region: new FormControl('', [Validators.required, Validators.maxLength(5)]),
		});
	}

	public onlyNumberKey(evt) {
        var ascii = (evt.which) ? evt.which : evt.keyCode
        if (ascii > 31 && (ascii < 48 || ascii > 57))
            return false;
        return true;
    }

	private _requestCountries()
	{
		console.log("LISTA DE PAISES");
		this._catalogService.getCountryList().subscribe((resp: any) => {
			console.log("LISTA DE PAISES EXITO");
			if(resp) this.countryList = [...resp];
		});
	}

	private async _requestStock()
	{
		try
		{
			var stock: any = await this._catalogService.getStockByCenter(this.userCenter).toPromise();
			console.log("REPONSE STOCK EN CENTRO ", stock.length);
			return (stock) ? { items: [...stock.items], imei: [...stock.imei] } : null;
		}
		catch(err: any)
		{
			console.error("[CATCH]: Error al obtener el stock del centro: ", this.userCenter);
			return null;
		}
	}

	private async _processPromotions()
	{
		try
		{
			let requiredCond: any = await this._promotionService.requiredCondition(this.userCenter).toPromise();
			var promotionCond: any= requiredCond.data.map((p: any) => ({ 
				promotion_id: p[0],
				name: p[1],
				condition_id: p[2],
				material_id: p[3],
				quantity: p[4],
				min_value: p[5],
				group_id: p[6], 
				group_type: p[7], 
				is_group: p[8]
			}));

			let discountPromo: any = await this._promotionService.discountPromotion(this.userCenter).toPromise();
			var materialPreCond = discountPromo.data.map((p: any) => ({
				condition_id: p[0], 
				material_id: p[1], 
				min_quantity: p[2], 
				bon_add_quantity: p[3], 
				material_quantity: parseInt(p[4]), 
				bon_esp_quantity: p[5], 
				type_scale: p[6], // A: DE - Igual y Mas de la cantidad | B:Hasta o C:Igual: Igual o menor a la cantidad solicita
				type_rappel: p[7], 
				unit_quantity: p[8], 
				value_by_porc: p[9], 
				value_by_direc: p[10],
				group_material: p[11].trim()
			}));

			let promoList: any = await this._promotionService.promotionsByCenter(this.userCenter).toPromise();
			console.log("X. ",promoList.data);
			
			let _promotionList = promoList.data.map((p: any) => {
				let required: any = promotionCond.filter((c: any) => c.condition_id === p[2]);
				required = this._processRequiredList(required);
				let discount: any = materialPreCond.filter((c: any) => c.condition_id === p[2]);

				return { promotion_id: p[0].trim(), name: p[1].trim(), condition_id: p[2].trim(), condition_1: p[4].trim(), condition_2: p[5].trim(), limit_use: p[6], min_value: p[7], distribution_channel: +p[8], required, discount, isActive: true }
			});

			this.promotionList = [];
			this._promotionTemp = [..._promotionList];

			console.log(this.promotionList, '-', this._promotionTemp);
		}
		catch(error)
		{
			console.error("No se pudieron procesar las promociones", error);
		}
	}

	private _processRequiredList(list: any)
	{
		var _newRequired = [];

		list.forEach((item: any) => {
			let {condition_id,group_id,promotion_id,quantity,group_type,is_group} = item;
			if(group_type === "MAT")
			{
				let existMat = _newRequired.find((m: any) => m.group === group_id)
				!existMat && _newRequired.push({ condition_id, group_id, promotion_id, quantity, group_type, material: [] });
			}
			
			if(group_type === "MGP" && is_group.trim() === 'X')
			{
				let existMat = _newRequired.find((m: any) => m.group === group_id)
				!existMat && _newRequired.push({ condition_id, group_id, promotion_id, quantity, group_type, material: [] });
			}
		});

		_newRequired.forEach((m: any) => {
			m.material = list.filter((i: any) => (i.group_id === m.group_id && i.material_id.trim() !== ''));
		});

		return _newRequired;
	}

	currencyFormatter(amount: any): string
	{
		let formatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
		return formatter.format(amount);
	}

	modalPayments(modalInstance: any)
	{
		this.showAddButton = false;
		this.showSelectButton = false;
		this.modalTitle = 'Metodos de pago';
		this.modalSize = sizeContent.LG;
		this.columnDataTable = ['nombre', 'sapId'];

		let request = this._catalogService.allPaymentMethods();
		this._createModal(modalInstance, this.columnDataTable, request);
	}

	selectCompany(company){
		console.log("SELECCIONADO",company);
		this.recharge_step = 2;
		this.company_selected = company;
		this._functionPlatform = typeMethods.TAE;
	}

	selectService(service,modal){
		this.service_step = 2;
		this.service_selected = service;
		this._functionPlatform = typeMethods.TAE;
	}

	finishService(service,modal){
		console.log("SELECCIONADO",service);
		this.service_selected = service;
		
		var item = {
			materialId: this._fillCeroToLeft(environment.mercurioCobro, 18),
			nombre: "PAGO DE SERVICIO " + service.nombre,
			price: 500,
			type: "ZSER"
		}
		this.addServiceToCart(item);
		modal.hide();
	}

	private product_selected:any;
	selectMonto(createRecharge,askPhone,concepto,monto){
		var item = {
			materialId: this._fillCeroToLeft(environment.tiempoAire, 18),
			nombre: "SERVICIO TIEMPO AIRE " + concepto,
			price: monto.valor,
			type: "ZSER",
			service: "TAE"
		}
		this.product_selected = monto;
		this.service_code = monto.codigo;
		this._functionPlatform = typeMethods.TAE;
		this.addServiceToCart(item,true);
		this.configComponentPos()
		createRecharge.hide();
	}

	backOneStep(){
		this.recharge_step -= 1;
	}

	backOneStepService(){
		this.service_step -= 1;
	}

	confirmPhone(modal){
		this._functionPlatform = typeMethods.TAE;
		console.log(this.phoneA)
		console.log(this.phoneB)
		if(this.phoneA != this.phoneB){
			console.log("SON DISTINTOS")
			this.phoneB = "";
			swal.fire({
				icon: 'warning',
				title: 'Los numeros celulares ingresados no coinciden',	
			})
		}else{
			modal.hide();
		}
	}

	createNewRecharge(){
		var today = Date.now();
		var rechargeRequest = {
			producto: this.service_code,
			telefono: this.phoneB,
			fecha: today
		}

		this._functionPlatform = typeMethods.TAE; //<-- DESCOMENTAR

		//makePhoneRecharge
	}

	createNewService(){
		this._sweetAlert("Completado", "Se finalizado la venta", "success");
		this.cleanSale();
	}

	columnDataTableEsp = [];
	modalClients(modalInstance: any)
	{
		this._clearInputModal();
		this.showAddButton = false;
		this.showSelectButton = true;
		this.modalTitle = 'Lista de Clientes';
		this.modalSearchPlaceHolder = 'ID Cliente, Nombre, RFC o Correo electrónico';
		this.modalSize = sizeContent.XL;
		this.columnDataTable = ["clientId","name","surname","rfc","email"];
		
		let request = this._catalogService.allClients();
		this._createModal(modalInstance, this.columnDataTable, request);
	}

	async modalReturnTicket(modalInstance: any)
	{
		try
		{
			console.log("OBTENER TODOS LOS TICKETS MP");
			this._spinnerService.show();
			let dateClient = moment().format('YYYYMMDD');
			let ticketList: any = await this._catalogService.getAllTicketMP(this.userCenter, dateClient).toPromise();

			/*let ticketList: any = [
				{
					"LT_HEADER": {
						"TICKET": "SL202100108839",
						"AUART": "ZVF",
						"PLANT": "9999",
						"UNAME": "INTERFACE-25",
						"BSTKD": "202100108839",
						"BSTKD2": "MP",
						"TIPOF": "MPF",
						"BUDAT": "2021-07-13",
						"VSTEL": "1074",
						"VKBUR": "1074",
						"BUKRS": "1000",
						"GJAHR": "2021",
						"CSEMANAL": "289",
						"CMENSUAL": "1156",
						"MESES": "6",
						"SALES_GRP": "231",
						"DZTERM": "ZF26",
						"DZLSCH": "8",
						"CURRENCY": "MXN",
						"CONEXCHRAT": 1,
						"KUNNR": "0001257521",
						"LT_ITEMS": [
							{
								"TICKET": "SL202100108839",
								"AUART": "ZVF",
								"POSNR": 10,
								"MATNR": "000000000000104867",
								"PLANT": "1074",
								"MENGE": 1,
								"KBETR": 5749,
								"SERIALNO": "356954842449017",
								"UII": "356954842449017",
								"ITCAT": "",
								"ENGANCHE": 1430.7,
								"INTERES": 3495.7,
								"IMPORTE_CUPON": 300
							}
						]
					}
				}
			];*/

			if(Array.isArray(ticketList))
			{
				let processList = [];
				this.ticketFinList = [...ticketList];

				this.ticketFinList.forEach(async (ticket: any) => {
					let {LT_HEADER} = ticket;
					let {LT_ITEMS} = LT_HEADER;
					let clientRequest: any = await this._catalogService.findClientById(this._fillCeroToLeft(LT_HEADER.KUNNR.trim(), 10)).toPromise().catch(e => {console.error(e)});
					console.log("-->", clientRequest);
					let name = clientRequest ? clientRequest.name:'No se encontro cliente';
					let totalFinancial = LT_ITEMS.reduce((total, current) => total += current.ENGANCHE, 0);
					this.ticketFinList.push({ header: { ...LT_HEADER }, detail: [...LT_ITEMS], extra: { name, items: LT_ITEMS.length, total: totalFinancial } });
				});

				this.ticketFinList = [...processList];
				this._spinnerService.hide();
				modalInstance.show();
			}
			else
			{
				let {respuesta} = ticketList;
				this._spinnerService.hide();
				this._sweetAlert('Información', respuesta.mensaje, 'info');
			}
		}
		catch(e: any)
		{
			this._spinnerService.hide();
			this._sweetAlert('Información', 'Ocurrió un error al obtener los Tickets de Financiamiento', 'info');
		}
	}

	async modalMaterials(modalInstance: any)
	{
		this._spinnerService.show();
		this._clearInputModal();
		this.showAddButton = true;
		this.showSelectButton = false;
		this.modalTitle = 'Materiales';
		this.modalSearchPlaceHolder = 'Nombre, Code, Material, Precio o Stock';
		this.modalSize = sizeContent.XL;
		this.columnDataTable = ['nombre', 'barCode', 'materialId', 'price', 'isLote', 'type'];

		let matList = [...this.materialList];

		this.resourceDataTable = matList.map((e: any) => {
			var objDefinition = {};
			this.columnDataTable.forEach((d: any) => { objDefinition[d] = e[d] });
			objDefinition['id'] = e.id;

			return objDefinition;
		});

		console.log("Start Stock");

		try
		{
			let _stock = await this._requestStock();
			
			if(_stock)
			{
				console.log("Validate Stock");
				this.resourceDataTable = this.resourceDataTable.map((a: any) => {
					var findId = _stock.items.find((x: any) => x.material === a.materialId);
					//console.warn(`${a.material} => `, findId);
					let amountMaterial: number = 0;
					let isDisponible: string = 'Disponible';
					
					if(a.type !== 'ZSER')
					{
						amountMaterial = findId ? (amountMaterial = findId.avQtyPlt):0;
						isDisponible = findId ? `Disponible: ${amountMaterial}`:'Agotado';
					}

					return { ...a, stock: isDisponible, amountMaterial };
				});
			}

			this.columnDataTable = ['nombre', 'barCode', 'materialId', 'price', 'stock'];
			this.originResourceData = [...this.resourceDataTable];

			console.log("--> ", this.resourceDataTable);

			this.table.recalculate();
			this._spinnerService.hide();
			this.modalDirective.show();
		}
		catch (err)
		{
			this._spinnerService.hide();
			this._sweetAlert("Error", "Ocurrió un error al procesar el stock relacionado a los materiales", "warning");
		}
	}

	modalNewClient(modalInstance: any)
	{
		modalInstance.show();
		this.formClient.reset();
	}

	modalNewRecharge(modalInstance: any)
	{
		this.recharge_step = 1;
		modalInstance.show();
	}

	modalAskPhone(modalInstance: any)
	{
		modalInstance.show();
	}

	modalNewService(modalInstance: any){
		modalInstance.show();
	}

	tempPayments = [
		{
		   "id":2,
		   "sapId":"1",
		   "nombre":"01 Efectivo"
		},
		{
		   "id":5,
		   "sapId":"4",
		   "nombre":"04 Tarjeta de Crédito"
		},
		{
		   "id":6,
		   "sapId":"5",
		   "nombre":"05 Monedero Electrónico"
		},
		{
		   "id":9,
		   "sapId":"8",
		   "nombre":"28 Tarjeta de Débito"
		}
	 ];
	modalPaymentSell(modalInstance: any)
	{
		this.paymentIdModal = '1';
		this.paymentCardIdModal = 1;
		let request = this._catalogService.allPaymentMethods();
		
		this.paymentList = this.tempPayments;
		modalInstance.show();
		/*request.subscribe((resp: any) => {
			if(resp)
			{
				this.paymentList = resp.filter(payment => !isNaN(payment.sapId));
				console.log("--> ", resp);
				modalInstance.show();
			}
		}, (err: any) => { console.error('Ocurrio un error al solitar la lista', err); });*/
	}

	modalPromotionActive()
	{
		this._spinnerService.show();
		let inputModal: any = document.getElementById('search-promo-input');
		inputModal.value = '';
		this.showAddButton = false;
		this.showSelectButton = false;
		this.modalTitle = 'Promociones del día';
		this.modalSearchPlaceHolder = 'Nombre o Material ID';
		this.modalSize = sizeContent.XL;
		this.columnDataTable = ['nombre', 'requerido', 'participan'];

		this.resourcePromotion = this.promotionList.map((p: any) => {
			let {name, discount, required} = p;
			let listMatDiscount: string[] = discount.map((m: any) => { 
				let {material_id} = m;
				let itemName: any = this.materialList.find((i: any) => i.materialId.trim() === material_id.trim());
				return (itemName ? itemName.nombre.trim():'Nombre no encontrado');
			});

			let requiredMat = [];
			required.forEach(({material}) => {
				requiredMat.push(...material.map(m => m.material_id));
			});

			return { nombre: name.trim(), requerido: requiredMat, participan: listMatDiscount.slice(0, 20).join(', ').toString() };
		});

		this.originResourceData = [...this.resourcePromotion];

		this.table.recalculate();
		this._spinnerService.hide();
		this.modalPromotions.show();
	}

	private _createModal(modalRef: any, dataResult: any[]|null, serviceInstance: Observable<any>): void
	{
		this._spinnerService.show();

		serviceInstance.subscribe((resp: any) => {
			this._spinnerService.hide();

			if(resp)
			{
				this.resourceDataTable = resp.map((e: any) => {
					var objDefinition = {};
					dataResult.forEach((d: any) => { objDefinition[d] = e[d] });
					objDefinition['id'] = e.id;

					return objDefinition;
				});

				this.originResourceData = [...this.resourceDataTable];
				this.table.recalculate();
				this.modalDirective.show();
			}
		}, (err: any) => { this._spinnerService.hide(); console.error('Ocurrio un error al solitar la lista', err); });
	}

	private _clearInputModal()
	{
		var inputModal: any = document.getElementById('search-modal-input');
		inputModal.value = '';
	}
	
	async addServiceToCart(item: any,itsMercurioService?: boolean)
	{
		console.log("ITEM SELECCIONADO",item)
		if(item)
		{
			if(!this.isAvailableStock(item))
			{
				console.log("Agotado: ", item.stock); return 0;
			}

			if(!this._isSameTypeEnter(item) && this.cartItemList.length > 0)
			{
				this._sweetAlert("Articulo", "El articulo ingresado no es el mismo tipo que se contiene en la venta", "info");
				return 1;
			}

			if(item.isLote)
			{
				this._sweetAlert("Articulo", "El articulo elegido es serializado, por favor ingrese el IMEI", "info");
				return 1;
			}

			if(item.type === 'ZSER')
			{
				if(itsMercurioService == undefined || itsMercurioService == false)
				{
					const { value: price } = await this.setPriceService();
					
					if(price)
					{
						item['price'] = +price;
					}
					else
					{
						return 0;
					}
				}
			}

			let _product = { ...item, havePromo: false, unique: this._getRandomNumber() };
			this.cartItemList.push(_product);

			if(itsMercurioService)
			{
				this._functionPlatform = this._beginConfigInterface(_product,"TAE");
			}
			else
			{
				this._functionPlatform = this._beginConfigInterface(_product);
			}

			(this._dateTimeStartSale.trim() === '') && (this._dateTimeStartSale = moment().format('YYYY-MM-DD HH:mm:ss'));
			console.log("-->", this.cartItemList);

			this._isValidMatPromo();
			//this._createToastAlert('Articulo', `Se añadio el articulo: ${item.nombre} a la compra`);
		}
	}

	private _isSameTypeEnter(article: any)
	{
		let {type} = article;
		let findSameType = this.cartItemList.find(e => e.type === type);

		return findSameType ? true:false;
	}

	addPaymentMethod(modalInstance: any)
	{
		let typeName = this.paymentList.find(p => p.sapId === this.paymentIdModal);
		
		let bankId = this.validateTypePayment() ? this.paymentCardIdModal:0;
		let payment: PaymentType = { id: this.paymentIdModal, type: typeName, bankId: bankId, amount: this.amoutPay };
		this.paymentSell.push(payment);
		this.amoutPay = 0.00;
		this.paymentIdModal = '1';
		this.paymentCardIdModal = 1;
		modalInstance.hide();
		console.log("PaymentMethodsList ", this.paymentSell);
	}

	validateTypePaymentCard(): boolean
	{
		return (this.paymentIdModal.trim() == '4' || this.paymentIdModal.trim() == '8');
	}

	addPaymentMethodV2(sapId) //<-- TODO HACER DINAMICO CON array[e.sapId]
	{
		let idUnletterP = (sapId.trim()).replace('P','');
		//console.log('--> ', sapId, '-', this.paymentCardIdModalArr[sapId], '-', this.paymentCardIdModalArr, ' - ', this.amoutPayArr[sapId]);

		/*if(this.paymentCardIdModalArr[sapId] === undefined)
		{
			//console.warn("No existe en paymentCardIdModalArr. ", (sapId.trim()).replace('P',''));
			let selectedBank: any = document.getElementById(`select-methods-card-${idUnletterP}`);
			this.paymentCardIdModalArr[sapId] = selectedBank.value;
		}*/

		//console.warn("Pass. ", this.paymentCardIdModalArr[sapId], '-', this.amoutPayArr[sapId]);

		let typeName = this.paymentList.find(p => p.sapId.trim() === idUnletterP);
		let bankId = this.canShowTerminalList(idUnletterP) ? this.paymentCardIdModalArr[sapId]:0; //this.validateTypePayment() ? this.paymentCardIdModalArr[sapId]:0;

		if(this.validateAmountPaymentV2(sapId))
		{
			return true;
		}

		if(this.canShowTerminalList(idUnletterP) && this.paymentCardIdModalArr[sapId] === undefined) //(this.validateTypePayment() && this.paymentCardIdModalArr[sapId] === undefined)
		{
			this._genericAlertService.createSweetAlert('Invalido', 'Es necesario elegir una terminal bancaria para agregar el pago por tarjeta de debito o credito!', 'info');
			return true;
		}

		if(this.paymentSell.find(p => p.id === idUnletterP)) //(this.paymentSell.find(payment => payment.id == this.paymentIdModal))
		{
			var temp = this.paymentSell.find(payment => payment.id === idUnletterP); //this.paymentSell.find(payment => payment.id === this.paymentIdModal)
			this.paymentSell.splice(this.paymentSell.indexOf(temp), 1); 
		}

		if(this.amoutPayArr[sapId] !== '0')
		{
			let payment: PaymentType = { id: idUnletterP, type: typeName, bankId: bankId, amount: this.amoutPayArr[sapId] }; //{ id:  this.paymentIdModal, type: typeName, bankId: bankId, amount: this.amoutPayArr[sapId] };
			this.paymentSell.push(payment);
			this.amoutPayArr[sapId] = "0";
		}
	}

	paymentListContains(id){
		return this.paymentSell.find( payment => payment.id == id);
	}

	entriesChange($event)
	{
		this.entries = $event.target.value;
	}

	filterTable($event)
	{
		let val = $event.target.value;

		this.resourceDataTable = this.originResourceData.filter((d) => {
			//console.log('X.', d)
			for(var key in d)
			{
				//console.log('a. ', key)
				if(d[key] != undefined){
					if((d[key].toString()).toUpperCase().indexOf(val) !== -1)
					{
						return true;
					}
				}else{
					return false;
				}
				
			}

			return false;
		});
	}

	onSelect(rowSelected)
	{
		/*if(rowSelected)
		{
			console.log('Select, ', rowSelected.selected);
			let {selected: item} = rowSelected;
			this.addServiceToCart(item);
		}*/
	}

	onActivate(eventRow)
	{
		if(eventRow.type === 'dblclick')
		{
			//console.log('Select, ', eventRow.row);
			let {row: item} = eventRow;
			
			if(item.hasOwnProperty('clientId'))
			{
				this.addClientToSale(item);
			}
			else
			{
				this.addServiceToCart({ ...item });
			}
		}
	}

	ngAfterViewChecked()
	{
		if(this.canShowPOS)
		{
			this.table.recalculate();
		}
	}

	private _createToastAlert(toastTitle: string, toastMessage: string, typeAlert: 'success'|'danger'|'info'|'warning'|'default' = 'info', timeSpoiler: number = 5000)
	{
		this._toastService.show(
			`<span class="alert-icon ni ni-bell-55" data-notify="icon"></span> <div class="alert-text"> 
			<span class="alert-title" data-notify="title">${toastTitle}</span> <span data-notify="message">${toastMessage}</span></div>`,
			"",
			{
				timeOut: timeSpoiler,
				closeButton: true,
				enableHtml: true,
				tapToDismiss: false,
				titleClass: "alert-title",
				positionClass: "toast-top-center",
				toastClass: `ngx-toastr alert alert-dismissible alert-${typeAlert} alert-notify`
			}
		);
	}

	calculateTotal(): any
	{
		let itemsNoPromo: any = this.cartItemList.filter(e => e.havePromo === false);
		itemsNoPromo = itemsNoPromo.reduce((total: number, currentValue: any) => total += currentValue.price, 0);
		let itemWithPromo: any = this.groupItemsCartByPromo();
		itemWithPromo = itemWithPromo.reduce((total: number, currentValue: any) => total += currentValue.price, 0);
		
		return itemsNoPromo + itemWithPromo;
	}

	calculatePaymentTicket(): any
	{
		return this.paymentSell.reduce((total:number, currentValue) => total += Number(currentValue.amount), 0);
	}

	calculatePayToTotal()
	{
		let total_sell = Number(this.calculateTotal());
		let total_payment =  Number(this.calculatePaymentTicket());
		let diff = Number(total_sell.toFixed(2)) - Number(total_payment.toFixed(2));

		return (diff < 0) ? 0:(diff.toFixed(2));
	}

	private _calculateDiscountTotal(): number
	{
		let _totalWithDiscount: number = this.calculateTotal();
		let _totalNeto = this.cartItemList.reduce((total: number, a: any) => total += a.price, 0);

		return +(_totalNeto - _totalWithDiscount).toFixed(2);
	}

	calculateCashChange(): number
	{
		let total_sell = Number(this.calculateTotal());
		let total_payment =  Number(this.calculatePaymentTicket());
		let diff = Number(total_sell.toFixed(2)) - Number(total_payment.toFixed(2));

		if(diff < 0)
		{
			return Math.abs(diff);
		}
		else
		{
			return 0;
		}
	}

	onChangeTypeTitle(typeChange: any)
	{
		//console.log('Changes.', typeChange);
		if(typeChange)
		{
			if(typeChange.trim() === 'persona')
			{
				this.formClient.controls['apellidopaterno'].setValue('');
				this.formClient.controls['apellidomaterno'].setValue('');
			}
			else
			{
				this.formClient.controls['apellidopaterno'].setValue('  ');
				this.formClient.controls['apellidomaterno'].setValue('  ');
			}
		}
	}

	validateAmountPayment(): boolean
	{
		let isValidAmount = false;

		if(this.paymentIdModal !== '1')
		{
			isValidAmount = +this.amoutPay > this.calculateTotal();
		}

		return isValidAmount;
	}

	validateAmountPaymentV2(sapId): boolean
	{
		let isValidAmount = false;
		let idUnletterP = (sapId.trim()).replace('P','');
		//console.warn("validateAmountPaymentV2, ", sapId, " - ", idUnletterP, '-', +this.amoutPayArr[sapId]);
		if(idUnletterP !== '1') //(this.paymentIdModal !== '1')
		{
			isValidAmount = +this.amoutPayArr[sapId] > this.calculatePayToTotal(); //this.calculateTotal();
		}

		return isValidAmount;
	}

	validPaymentEnabledButton(): boolean
	{
		if(this.amoutPay === null)
		{
			return false;
		}

		if(this.paymentIdModal == "1")
		{
			return (this.amoutPay > 0)
		}
		else
		{
			/*let total_sell = this.calculateTotal();
			let total_payment =  this.calculatePaymentTicket();
			let diff = Number(total_sell.toFixed(2)) - Number(total_payment.toFixed(2));
			return (this.amoutPay <= diff) && (this.amoutPay > 0)*/
			let noCash = this.paymentSell.reduce((total, e: any) => total+= (+e.type.sapId !== 1 ? e.amount:0), 0);
			let totalPaid = Number(Number(noCash).toFixed(2)) + Number(Number(this.amoutPay).toFixed(2));
			
			return (totalPaid <= this.calculateTotal() && totalPaid > 0);
		}
	}

	validPaymentEnabledButtonV2(sapId): boolean
	{
		if(this.amoutPayArr[sapId] == undefined)
		{
			return false;
		}

		if(this.paymentIdModal == "1")
		{
			return (this.amoutPayArr[sapId] >= 0)
		}
		else
		{
			let totalPaid = Number(Number(this.amoutPayArr[sapId]).toFixed(2));

			if(this.validateTypePayment())
			{
				if(this.paymentCardIdModalArr[sapId] == undefined)
				{
					return false;
				}
			}

			return (totalPaid <= this.calculatePayToTotal() && totalPaid >= 0);
		}
	}

	selectPaymentTyped(value: any)
	{ 
		//console.info("Example: ", value);
		if(value)
		{
			this.paymentIdModal = value;
		}
	}

	selectPaymentCardTyped(value: any)
	{
		if(value)
		{
			this.paymentCardIdModal = +value;
		}
	}

	private _existItemInCart(imei: string): boolean
	{
		return this.cartItemList.find(e => e.imei === imei) ? true:false;
	}

	async findByBarCodeOrImei(code: any)
	{
		if(code.trim() === '' || code === null) return '';

		this._spinnerService.show();
		let exist = this.materialList.find(m => m.barCode.trim() === code.trim());

		// Verifica que el codigo ingresado no sea un producto anteriormente agregado como un IMEI, solo si el carrito de venta tienen productos
		if(this.cartItemList.length > 0)
		{
			let existInCart = this._existItemInCart(code);

			if(existInCart)
			{
				this._spinnerService.hide();
				this.inputCodeBar.nativeElement.value = '';
				this._sweetAlert('Articulo', 'El IMEI ya se encuentra en la venta!', 'warning');
				return 1;
			}
		}
		
		// Si se encuentra el producto, se añada siempre y cuando no sea de tipo Serializado (Pertenezca a un lote)
		if(exist)
		{
			let textMessage = exist.isLote ? "El articulo elegido es serializado, por favor ingrese el IMEI":`Se añadio el articulo: ${exist.nombre} a la compra`;

			if(exist.type === 'ZMER')
			{
				try
				{
					let itemStock: any = await this._catalogService.getStockByMaterial(this.userCenter, exist.materialId).toPromise();
					let {avQtyPlt} = itemStock.items[0];

					if(parseInt(avQtyPlt) === 0)
					{
						this._genericAlertService.createSweetAlert(`Información`, `El producto escaneado no cuenta con Stock en la tienda. <br> <strong>NOTA:</strong> Verifique que no tenga transitos pendientes por recibir`, 'info');
						return true;
					}
				}
				catch(stockErr)
				{
					this._genericAlertService.createSweetAlert(`Información`, `El producto escaneado no cuenta con Stock en la tienda. <br> <strong>NOTA:</strong> Verifique que no tenga transitos pendientes por recibir`, 'info');
					return true;
				}
				finally
				{
					this._spinnerService.hide();
				}
			}

			if(!this._isSameTypeEnter(exist) && this.cartItemList.length > 0)
			{
				this._spinnerService.hide();
				this.inputCodeBar.nativeElement.value = '';
				this._sweetAlert("Articulo", "El articulo ingresado no es el mismo tipo que se permite en esta venta", "info");
				return 1;
			}

			this._spinnerService.hide();

			if(!exist.isLote)
			{
				if(exist.type === 'ZSER')
				{
					const { value: price } = await this.setPriceService();
					
					if(price)
					{
						exist['price'] = +price;
					}
					else
					{
						this._spinnerService.hide();
						return 0;
					}
				}
				
				this.cartItemList.push({ ...exist, havePromo: false, unique: this._getRandomNumber() });
				this._functionPlatform = this._beginConfigInterface(exist);
				(this._dateTimeStartSale.trim() === '') && (this._dateTimeStartSale = moment().format('YYYY-MM-DD HH:mm:ss'));

				this._isValidMatPromo();
			}

			//this._sweetAlert("Articulo", textMessage, "info");
		}
		else
		{
			// SI el producto no existe dentro de un codigo de barras, entonces se buscara como un IMEI
			try
			{
				let _existCode: any = await this._catalogService.getMaterialByIMEI(this.userCenter, code.trim()).toPromise();

				if(_existCode)
				{
					let {imei, items} = _existCode;
					let { dmbtr: priceByImei } = items[0];
					let _material = this.materialList.find(m => m.materialId === items[0].material);
					let price = (+priceByImei === 0) ? _material.price:(+priceByImei);
					console.log(`Price IMEI: ${priceByImei} - Price Evaluation: ${price} - OriginalPriceMat: ${_material.price}`)

					this._functionPlatform = this._beginConfigInterface(_material);
					this.cartItemList.push({ ..._material, charg: imei[0].charg, imei: imei[0].imei, price, havePromo: false, unique: this._getRandomNumber() });
					(this._dateTimeStartSale.trim() === '') && (this._dateTimeStartSale = moment().format('YYYY-MM-DD HH:mm:ss'));
					console.log("MAYBE IMEI. ", this.cartItemList);
					this._isValidMatPromo();
					//this._createToastAlert('Articulo', `Se añadio el articulo: ${_material.nombre} a la compra`);
				}
			}
			catch(e)
			{
				this._spinnerService.hide();
				this._createToastAlert('Articulo', `No encontro el articulo con código: ${code}`, 'danger');
			}
		}

		this._spinnerService.hide();
		this.inputCodeBar.nativeElement.value = '';
	}

	addClientToSale(clientInfo: any)
	{
		if(clientInfo)
		{
			let {surname, name, email, rfc, clientId} = clientInfo;
			let nombre_cliente: string = surname.trim() !== '' ? `${name} ${surname}`:name;

			this.activeClient.clientRfc = rfc;
			this.activeClient.clientEmail = email;
			this.activeClient.clientNumber = clientId;
			this.activeClient.clientName = nombre_cliente;

			this._createToastAlert('Cliente', `Se añadio a ${nombre_cliente.toUpperCase()} como el cliente de la venta`);
			this.modalDirective.hide();
		}
	}

	setPriceService()
	{
		let alertPrice = swal.fire({
			title: 'Venta',
			input: 'number',
			inputLabel: 'Costo del servicio',
			inputPlaceholder: 'Ingrese el precio del servicio',
			inputAttributes: {
				step:'0.01',
				value:'0.00'
			},
			inputValidator: (value) => {
				//console.log(value);
				if(!value) return 'Ingrese un monto para el servicio';

				if(+value <= 0) return 'El precio debe ser mayor a 0.00!';
			}
		});
		
		return alertPrice;
	}

	private _configPaymentOptions(clientContract: string)
	{
		let dinamicRequest;
		let beginTicket: string = clientContract.substr(0, 2);
		let endTicket: any = clientContract.substr(2, clientContract.length);

		if(beginTicket.toUpperCase() === 'SL' && !isNaN(endTicket))
		{
			dinamicRequest = this._catalogService.getAbonoMP(clientContract);
		}
		else
		{
			dinamicRequest = this._catalogService.getPayJoyPayments(clientContract);
		}

		return dinamicRequest;
	}

	sweetAlertPaymentBill(): any
	{
		swal.queue([{
			title: 'Abono Macropay',
			input: 'text',
			confirmButtonText: 'Buscar',
			text: 'Ingrese el número de financiamiento',
			inputValidator: result => !result && 'You need enter a valid ticket number',
			inputAttributes: { 
				style:"text-transform:uppercase" 
			},
			showLoaderOnConfirm: true,
			allowEnterKey: true,
			allowOutsideClick: false,
			preConfirm: (ticket: any) => {
				var requestPaymentOptions = this._configPaymentOptions(ticket.trim().toUpperCase());

				return requestPaymentOptions.toPromise().then(async (data: any) => {
					var optionsFinancy = {};
					var ticketRequest = ticket.trim().toUpperCase();

					if(!data.paymentOptions || data.paymentOptions == 0)
					{
						this._sweetAlert("Información", "No se encontrarón metodos de pago asociados al contrato", "info");
						return false;
					}

					let _amountList = [...data.paymentOptions];
					let _financeOrderId = data.financeOrder ? data.financeOrder.id:null;

					data.paymentOptions.forEach((e: any, index: number) => {
						optionsFinancy[e.type.trim()] = `${this._translatePaymentSL(e.type)}: ${e.amount} ${e.currency}`;
					});

					let _client_id: string = '0';
					let _clientName: string = 'Nombre no encontrado';
					let beginTicket: string = ticketRequest.substr(0, 2);
					let endTicket: any = ticketRequest.substr(2, ticketRequest.length);

					if(beginTicket.toUpperCase() === 'SL' && !isNaN(endTicket))
					{
						let {datacredito} = data;
						_clientName = datacredito.nombrecliente;
					}
					else
					{
						let {financeOrder} = data;

						try
						{
							let _response: any = await this._catalogService.getPJClientInfo({ id: financeOrder.id, time: financeOrder.time }).toPromise();
							let {0: search} = _response.transactions;
							_client_id = financeOrder.id;
							_clientName = search.customer.name;
						}
						catch(err)
						{
							console.warn('Error detected to find client PJ: ', err);
						}
					}
					
					swal.insertQueueStep({
						html: `
							<div class="form-group">
								<label for="customerName" class="form-control-label float-left">Nombre del cliente </label>
								<input id="customerName" name="customerName" value="${_clientName}" type="text" class="form-control" disabled="disabled">
							</div>
							<div class="form-group">
								<label for="referenceTicket" class="form-control-label float-left">Confirmar financiamiento </label>
								<input id="referenceTicket" name="referenceTicket" placeholder="ID de Financiamiento" type="text" class="form-control">
							</div>`,
						input: 'radio',
						allowEnterKey: true,
						allowOutsideClick: false,
  						inputOptions: optionsFinancy,
						inputValidator: (value) => {
							var _financiamientoID: any =  document.getElementById('referenceTicket');
							// Valida que hay un ID en el input
							if(!_financiamientoID.value) return 'Ingrese el ID de Financiamiento';
							// Valida que el ID ingresado sea diferente de vacio y que sea igual ticket anteriormente ingresado
							if(_financiamientoID.value != '' && _financiamientoID.value.toUpperCase() !== ticketRequest) return 'El ID ingresado no concuerda con el registrado!';
							// Valida que se seleccione un pago para la cuenta disponible
							if(!value) return 'Necesita elegir un metodo de abono para la cuenta!'
						},
						preConfirm: (payValue: any) => {
							let totalPayment = _amountList.find(p => p.type === payValue);
							var financyID: any = document.getElementById('referenceTicket');
							financyID = financyID.value.toUpperCase();
							
							this.cartItemList.push({
								id: 0,
								havePromo: false,
								client_id: _client_id,
								client: _clientName,
								materialId: this._fillCeroToLeft(environment.abonoFinancing, 18),
								nombre: "Abono Macropay Financing",
								barCode: "2050000000072",
								type: "ZFIN",
								lote: false,
								price: totalPayment.amount,
								SL: financyID,
								orderId: _financeOrderId
							});

							this._functionPlatform = typeMethods.FIN;
							this.activeClient.clientName = _clientName;
							(this._dateTimeStartSale.trim() === '') && (this._dateTimeStartSale = moment().format('YYYY-MM-DD HH:mm:ss'));

							console.log("X-->", this.cartItemList);
						}
					});
				}).catch((reason: any) => {
					console.warn('E -> ', reason);
					swal.insertQueueStep({ icon: 'error', title: 'El ticket ingresado para el abono no es valido!' })
				});
			}
		}])
	}

	private _translatePaymentSL(text: string): string
	{
		let _translateTitle: string = '';

		switch(text)
		{
			case 'full': _translateTitle = 'Liquidación'; break;
			case 'week': _translateTitle = 'Semana'; break;
			case 'month': _translateTitle = 'Mensualidad'; break;
			case 'negotiation': _translateTitle = 'Negociación'; break;
			case 'duebalance': _translateTitle = 'Al día'; break;
			default: _translateTitle = 'Unknown'; break;
		}

		return _translateTitle;
	}

	private _sweetAlert(titleInfo: string, textInfo: string, iconType: 'info'|'success'|'warning' = 'info')
	{
		return swal.fire({
			title: titleInfo,
			text: textInfo,
			icon: iconType,
			buttonsStyling: false,
			customClass: { confirmButton: "btn btn-"+iconType }
		});
	}

	getIsShowColName({ row, column, value })
	{
		if(column.materialId =='materialId')
		{
			return { 'hide': true };
		}	
	}

	convertNotNaNColumn(columnValue: any)
	{
		var valueConvert = columnValue;
		
		if(columnValue.toString().trim() !== '')
		{
			valueConvert = isNaN(columnValue) ? columnValue:parseInt(columnValue);
		}

		return valueConvert;
	}

	createNewClient(modalInstance: any)
	{
		let {title, name, apellidopaterno, apellidomaterno, rfc, email, street, numcasa, cp, city, region} = this.formClient.value;
		
		if(!this._isValidRFC(rfc.trim()))//(!this._validRfc(rfc.trim()))
		{
			this._createToastAlert("RFC", "El RFC no cumple con los requisitos necesarios para ser valido", "info");
			return 0;
		}

		this._spinnerService.show();
		let _postalCode: string = (cp).toString();
		if(_postalCode.length === 4){ _postalCode = this._fillCeroToLeft(_postalCode, 5); }
		//let info_client = { title: "Sr", name: "Joana", surname: "Canul", street: "PROL IGNACIO GUTIERREZ 119", country: "MX", cp: 86500, city: "CARDENAS", region: "TAB", rfc: "XAXX010101000", email: "alma.doris@gmail.com" };
		console.log("NUEVO CLIENTE PAYLOAD ", { title, name, surname: `${apellidopaterno} ${apellidopaterno}`, rfc, email, cp: _postalCode, street: `${numcasa} ${street}`, city, region })
		this._clientService.create({ title, name, surname: `${apellidopaterno} ${apellidomaterno}`, rfc, email, cp: _postalCode, street: `${numcasa} ${street}`, city, region }).subscribe((result: any) => {
			console.log("RESPONSE NUEVO CLIENTE ", result);

			if(result.status === 'success')
			{
				this.formClient.reset();
				modalInstance.hide();
				this._spinnerService.hide();
				this._createToastAlert('Nuevo Cliente', 'Se ha creado un nuevo cliente', 'success');
			}
			else
			{
				let {data} = result;
				var message: string = '';
				this._spinnerService.hide();
				data.forEach(e => { message += ((message.trim() === '') ? e:`<br>${e}` ) });
				this._createToastAlert('Campos requeridos', message, 'info');
			}
		}, (err: any) => {
			console.error('ERROR NUEVO CLIENTE ', err);
			this.formClient.reset();
			this._spinnerService.hide();
			this._createToastAlert('Error', 'Ocurrió un error al crear el cliente', 'danger');
		});
	}

	existsLastTicket(): boolean 
	{
		let existPrint: boolean = false;
		let lastTicketHtml: any = localStorage.getItem('lastPrint');

		(lastTicketHtml != null && lastTicketHtml.trim() != '') && (existPrint = true);

		return existPrint;
	}

	printLastTicket()
	{
		let lastTicketHtml: any = localStorage.getItem('lastPrint');

		if(lastTicketHtml != null && lastTicketHtml.trim() != '')
		{
			printerjs({ printable: lastTicketHtml, type: 'raw-html' });
		}
		else
		{
			this._sweetAlert("Advertencia", "No se encontro registro de algun ticket anterior", "info");
		}
	}

	private _generateTicketStructure(ticket: string, setPrint: boolean = false)
	{	
		this.blockAfterSale = true;
		let _salesmanName = JSON.parse(localStorage.getItem('activeSalesman')).name;

		this.informationTicket = {
			ticket: this.ticketId,
			SL: ticket,
			typeTicket: this._functionPlatform,
			clientName: this.activeClient.clientName,
			salesman: _salesmanName,// this.userSalemanName,
			caja: this.cajaId,
			shop: this.storeName,
			detail: [...this.groupItemsCart()],
			detailPromo: [...this.groupItemsCartByPromo()],
			total: this.calculateTotal(),
			changes: this.calculateCashChange(),
			discount: this._calculateDiscountTotal(),
			tae_request: this.tae_request,
			tae_response: this.tae_response
		};
		
		console.warn(`Print -> ${setPrint} - `, this.informationTicket);
		
		if(setPrint)
		{
			var htmlToPrint: string = document.getElementById('ticketcomp').innerHTML;
			printerjs({ printable: htmlToPrint, type: 'raw-html' });
			localStorage.setItem('lastPrint', '');
			localStorage.setItem('lastPrint', htmlToPrint);
		}
	}

	createNewSale(modal?: any)
	{
		console.log(this._functionPlatform);

		this.blockAfterSale = true; // Bloquea el boton de terminar venta
		
		if(modal != undefined){ modal.hide(); }

		switch(this._functionPlatform)
		{
			case typeMethods.CONT: this._executeCashing(); break;
			case typeMethods.FIN: this._executeFinancing(); break;
			case typeMethods.RFIN: this._executeContinueFinancy(); break;
			case typeMethods.TAE: this._executeTAE(); break;
			default: this._genericAlertService.createSweetAlert("Advertencia", "El estado de pago no es permitido", "warning");
		}
	}

	private tae_request:any = null;
	private tae_response:any = null;
	
	private _executeTAE()
	{
		this._spinnerService.show();
		var dateString = this._datePipe.transform(new Date, 'dd/MM/yyyy HH:mm:ss')
		var timestampString = this._datePipe.transform(new Date, 'HHmmss')
		//console.log(this.company_selected);console.log(this.product_selected);console.log(dateString);
		var taeRequest = {
			product:this.product_selected.codigo,
			date_sale: dateString,
			phone:this.phoneB,
			folio:this.current_drawer.centro + timestampString,
			date_start: dateString,
			centro:this.current_drawer.centro,
			cost:this.product_selected.valor
		}
		console.log("SOLICITAR RECARGA PAYLOAD",taeRequest);
		
		this._catalogService.makePhoneRecharge(taeRequest).subscribe((response:any) => {
			console.log("RESPONSE RECARGA TAE",response)
			this._spinnerService.hide();
			if(response.Confirmacion == "00"){
				this.tae_request  = taeRequest;
				this.tae_response = response;
				console.log("entra en 00",this.tae_response);
				this._executeCashingSafe();
			}else{
				this.cleanSale();
				this._sweetAlert('Error', response.Descripcion , 'warning');
			}
		},(err)=>{
			this.cleanSale();
			console.log("ERROR CREAR RECARGA TAE", err)
			this._spinnerService.hide();
			this._sweetAlert('Error', 'Ocurrió un error al procesar la recarga' , 'warning');
		})
	}

	private _executeCashing()
	{
		this._spinnerService.show();
		var saleHeader = this.processNewSale();

		console.log("CREAR VENTA PAYLOAD ", saleHeader);
		
		this._saleService.create(saleHeader).subscribe((response: any) => {
			console.log("RESPONSE CREAR VENTA ", response);

			this._spinnerService.hide();

			if(response.status === 'success')
			{
				let { ticketId: insertedTicketId } = response.data;
				this.ticketId = insertedTicketId;

				this._generateTicketStructure(saleHeader.header.ticket);
				this._sweetAlert("Venta", "Se finalizado la venta", "success").then((resp: any) => {
					this._generateTicketStructure(saleHeader.header.ticket, true);
					//this._autoSaveFile('ticketcomp', 208, `${saleHeader.header.ticket}Copia`);
					setTimeout(_=> { this.cleanSale() }, 2000);
				});
			}
			else
			{
				let {0: message} = response.data;
				
				this.blockAfterSale = false;
				this._genericAlertService.createSweetAlert("Venta", message, "warning");
			}
		}, (err: any) => {
			console.log("ERROR CREAR VENTA ", err);

			this.cleanSale();
			this._spinnerService.hide();
			this._genericAlertService.createSweetAlert('Error', 'Ocurrió un error al procesar la venta' , 'warning');
		});
	}

	private _executeCashingSafe()
	{
		this._spinnerService.show();
		var saleHeader = this.processNewSale();

		console.log("CREAR VENTA PAYLOAD ", saleHeader);
		this._saleService.createSafe(saleHeader).subscribe((response: any) => {
			console.log("RESPONSE CREAR VENTA ", response);

			this._spinnerService.hide();
			if(response.status === 'success' || response.status === 'pending')
			{
				this._generateTicketStructure(saleHeader.header.ticket);
				this._sweetAlert("Venta", "Se finalizado la venta", "success").then((resp: any) => {
					this._generateTicketStructure(saleHeader.header.ticket, true);
					setTimeout(_=> { this.cleanSale() }, 2000);
				});
			}
			else
			{
				let {0: message} = response.data;
				this._sweetAlert("Venta", message, "warning");
			}
		}, (err: any) => {
			console.log("ERROR CREAR VENTA ", err);

			this.cleanSale();
			this._spinnerService.hide();
			this._sweetAlert('Error', 'Ocurrió un error al procesar la venta' , 'warning');
		});
	}

	private _executeContinueFinancy()
	{
		this._spinnerService.show();
		var saleHeader = this._processContinueFinancing();
		var {ticket} = saleHeader.header;
		console.log('Información de Venta para reanudar. ', saleHeader);
		
		this._saleService.create(saleHeader).subscribe((response: any) => {
			console.log("RESPONSE CREAR REANUDAR VENTA ", response);
			if(response.status)
			{
				let {data} = response;

				if(!Array.isArray(data))
				{
					console.log("docId; ", data.docId);
					this._spinnerService.hide();
					this._generateTicketStructure(ticket);
					this._catalogService.confirmPaymentMP(ticket, (data.docId !== 'S')?data.docId : "").subscribe((response: any) => {
						console.log("Confirmacion Enviada del SL ", ticket);
					}, (err: any) => {
						console.log("Ocurrio un error al enviar la confirmacion. ", err);
					})
					this._sweetAlert("Completado", "Se finalizado la reanudación de la venta", "success").then((resp: any) => {
						this._generateTicketStructure(ticket, true);
						setTimeout(_=> { this.cleanSale() }, 2000);
					});
				}
				else
				{
					let {0: message} = data;
					this.cleanSale();
					this._spinnerService.hide();
					this._sweetAlert("Venta", message, "warning");
				}
			}
		}, (err: any) => {
			this.cleanSale();
			this._spinnerService.hide();
			this._sweetAlert('Error', 'Ocurrió un error al reanudar la venta' , 'warning');
		});
	}

	private _processContinueFinancing(): { header: any, detail: any, method: any, promotion: any }
	{		
		let { 0: itemFinancy } = this.cartItemList;
		let yearExecute = moment().format('YYYY').toString();
		let distChannel = '04', typeSale = 'ZVF';
		let _salesmanId = JSON.parse(localStorage.getItem('activeSalesman')).salesmanId;
		let payment_methods = this._processPaymentMethods(itemFinancy.h.TICKET);
		let paymenthGreat = this._getGreaterAmountPayment(payment_methods).paymentMethodId;

		let header = {
			ticket: itemFinancy.h.TICKET,
			auart: typeSale,
			vtweg: distChannel,
			plant: this.userCenter.toString(),
			uname: this.userName.toString(),
			bstkd: itemFinancy.h.BSTKD,
			bstkd2: 'MP',
			salesgrp: _salesmanId.toString(), // this.userSaleman.toString(),
			salesclerkid: '',
			budat: itemFinancy.h.BUDAT,
			vstel: this.userCenter.toString(),
			vkbur: this.userCenter.toString(),
			bukrs: '1000',
			gjahr: yearExecute,
			dzterm: itemFinancy.h.DZTERM.toString(),
			dzlsch: paymenthGreat,
			currency: 'MXN',
			conexchrat: '1.00000',
			usocfdi: '',
			kunnr: this._fillCeroToLeft(+itemFinancy.h.KUNNR, 10),
			guid: '',
			csemanal: itemFinancy.h.CSEMANAL,
			cmensual: itemFinancy.h.CMENSUAL,
			meses: itemFinancy.h.MESES,
			tipof: 'MPF',
			infofina: '',
			docventa: '',
			docentrega: '',
			docfactura: '',
			docfinanzas: '',
			docliqenganche: '',
			fecha: '',
			hora: '',
			docub: '',
			docdeliv: '',
			docmat: '',
			docmatentrega: '',
			docrec: '',
			forward: '',
			tracking: '',
			origenvta: 'MPSS',
			apertura: this.apertureId.toString(),
			startsale: this._dateTimeStartSale,
			endsale: moment().format('YYYY-MM-DD HH:mm:ss'),
			processed: true
		};

		let item_sale = [];
		
		itemFinancy.h.LT_ITEMS.forEach((e: any, index: number) => {
			item_sale.push({
				ticket: e.TICKET,
				auart: typeSale,
				posnr: this._fillCeroToLeft(+e.POSNR, 6),
				matnr: this._fillCeroToLeft(+e.MATNR, 18),
				plant: this.userCenter.toString(),
				menge: 1,
				kbetr: e.KBETR,
				serialno: e.SERIALNO,
				uii: e.UII,
				itcat: '',
				enganche: e.ENGANCHE,
				interes: e.INTERES,
				importecupon: e.IMPORTE_CUPON,
				charg: e.CHARG,
				currency: '',
				origenvta: 'MPSS',
				promotionid: null
			});
		});

		//let promotion = this.cartItemList.filter((p: any) => p.havePromo).map((e: any) => (e.promoCode));
		//promotion = promotion.filter((v, i) => promotion.indexOf(v) === i).map((id: any) => ({ promotionId: id, ticketId: itemFinancy.h.TICKET }));

		return { header, detail: item_sale, method: payment_methods, promotion: [] };
	}

	private _executeFinancing()
	{
		this._spinnerService.show();
		var {isPJ, parameters: paramsRequest} = this._processFinancingPayment();

		let payment_methods: any = [];
		this.paymentSell.forEach((e: any) => {
			payment_methods.push({ ticketId: this.ticketId, paymentMethodId: e.id, amount: Number(e.amount), bankId: e.bankId })
		});
		console.log("PAYMENT_METHODS",payment_methods);
		let payMethodFin = this._getGreaterAmountPayment(payment_methods).paymentMethodId;

		console.log("Payment. ",paramsRequest,'-', this.ticketId,'-',payMethodFin);
		
		if(isPJ) // PayJoy
		{
			this._catalogService.setPJPayment(paramsRequest).subscribe((response: any) => {
				console.log("save payment payjoy", response);
				if(response.valid && response.payment)
				{
					this._spinnerService.hide();

					let requestPaid = this._processPaidAccount(true); //this._processRecordPaid();
					this._catalogService.savePendingPaid(requestPaid).subscribe((data: any) => {
						console.log("Se ha registrado el abono en el POS de PJ. ", data);
					}, (err) => { console.error('Ocurrio un error al registar el abono en el POS de PJ. ', err) });
					
					this._generateTicketStructure(paramsRequest.financeOrderId);
					this._sweetAlert("Venta", `Se realizado el pago de PayJoy`).catch((resp: any) => {
						this._generateTicketStructure(paramsRequest.financeOrderId, true);
						setTimeout(_=> { this.cleanSale() }, 2000);
					});
				}
				else
				{
					this.cleanSale();
					this._spinnerService.hide();
				}

			}, (err: any) => {
				this.cleanSale();
				this._spinnerService.hide();
				this._sweetAlert("Error", "Ocurrió un error al realizar el abono", "warning");
			});
		}
		else // MacroPay
		{
			this._catalogService.saveFinancingPayment(paramsRequest).subscribe((response: any) => {
				console.log(response);
	
				if(response.valid)
				{
					this._saveFinancingSale(paramsRequest, this.ticketId, payMethodFin);
				}
				else
				{
					this.cleanSale();
					this._spinnerService.hide();
					this._sweetAlert("Información", "El abono enviado no puedo realizarse, vuelva a intentarlo mas tarde", "info");
				}
			}, (err: any) => {
				this.cleanSale();
				this._spinnerService.hide();
				this._sweetAlert('Error', 'Ocurrió un error al procesa su pago de financiamiento', 'warning');
			});
		}
	}

	private _saveFinancingSale(financingInfo: any, _ticket: string, _paymentMethod: string, _typeTransacc: 'MP'|'PJ' = 'MP')
	{
		var ticketSL = financingInfo.financeOrderId;
		var ticketNotSL = ticketSL.substr(2, ticketSL.length);
		var headerTransacc = _typeTransacc === 'MP' ? 'MACROPAY':'PAYJOY';

		let recordFinancing = {
			customer: '', // no se llena
			companyCode: '', // no se llena
			fiDocument: '', // no se llena
			fiscalYear: '', // no se llena
			postingDate: '', // no se llena
			cashPayment: financingInfo.amount,
			plant: this.userCenter,
			referenceData: _ticket,
			textCab: `PAGO ${headerTransacc}`,
			ticketFinan: ticketSL,
			ticket: _ticket,
			bstkd: ticketNotSL,
			bstkd2: _typeTransacc,
			dzlsch: _paymentMethod
		};

		this._generateTicketStructure(ticketSL);

		this._catalogService.saveFinancingSAP(recordFinancing).subscribe((record: any) => {
			this._spinnerService.hide();

			if(record.status === 'success')
			{
				let requestPaid = this._processPaidAccount(true); //this._processRecordPaid();
				
				this._catalogService.savePendingPaid(requestPaid).subscribe((responses: any) => {
					var { ticketId: generateTicketId } = responses.data
					this.ticketId = generateTicketId;
					console.log("Se ha registrado el abono en el POS. ", responses, ' - ', generateTicketId, ' - ', this.ticketId);

					this._generateTicketStructure(ticketSL);
					this._sweetAlert("Pago", "Se ha realizado el abono a la cuenta", "success").then((resp: any) => {
						this._generateTicketStructure(ticketSL, true);
						setTimeout(_=> { this.cleanSale() }, 2000);
					});
				}, (err) => { console.error('Ocurrio un error al registar el abono en el POS. ', err) });
			}
			else
			{
				this.cleanSale();
				this._sweetAlert("Pago", "No se puedo realizar el abono", "info");
			}
		}, (err: any) => {
			let requestPaid = this._processPaidAccount(false); //this._processRecordPaid();
			
			this._catalogService.savePendingPaid(requestPaid).subscribe((responses: any) => {
				var { ticketId: generateTicketId } = responses.data
				this.ticketId = generateTicketId;
				console.log("[ERROR] Abono guardado como pendiente", responses, ' - ', generateTicketId, ' - ', this.ticketId);

				this._generateTicketStructure(ticketSL);
				this._sweetAlert("Pago", "Se ha realizado el abono a la cuenta, posteriormente será procesado", "success").then((resp: any) => {
					this._generateTicketStructure(ticketSL, true);
					setTimeout(_=> { this.cleanSale() }, 2000);
				});
			}, (err) => { console.error('[ERROR] Oucrrió un error al guardar el abono como pendiente', err) });

			this._spinnerService.hide();//this._sweetAlert("Error", "Ocurrió un error al registrar el abono en SAP", "warning");
		});

	}

	private _getTicketSale(): string
	{
		let timeStampTicket = moment().format('YYMMDDHHmmss');
		timeStampTicket = `${this.userCenter.trim()}${timeStampTicket}`;

		return `${this.complementTicket}${timeStampTicket}`; //'2107231658073001';
	}

	onRadioCfdi(checkedType: any)
	{
		//console.log('-->', checkedType);
		this.typeUsoCdfi = checkedType;
	}

	/**
	 * @description Devuelve una lista de metodos de pago relacionados a un Ticket de venta, agrupando los pagos de efectivo para sacar diferencia al total de la venta
	 * @param headerTicket Numero de ticket registrado en el POS, abono o financiamiento.
	 * @returns Array
	 */
	private _processPaymentMethods(headerTicket: string): Array<{ ticketId: any, paymentMethodId: any, amount: any, bankId: any }>
	{
		let paymentOptions = [];
		let existCashPayment = this.paymentSell.find(p => p.id.trim() === '1');

		if(existCashPayment)
		{
			let {id, bankId} = existCashPayment;
			let saleTotal = this.calculateTotal();
			let noCash = this.paymentSell.reduce((total: number, e: any) => total+= (+e.type.sapId !== 1 ? +e.amount:0), 0);
			paymentOptions.push({ ticketId: headerTicket, paymentMethodId: id, amount: (saleTotal - noCash), bankId: +bankId });
		}
		
		this.paymentSell.filter(e => e.id !== '1').forEach((e: any) => {
			paymentOptions.push({ ticketId: headerTicket, paymentMethodId: e.id, amount: +e.amount, bankId: +e.bankId });
		});

		return paymentOptions;
	}

	processNewSale()
	{
		let yearExecute = moment().format('YYYY').toString();
		let dateClient = moment().format('YYYYMMDD');

		let payment_methods = this._processPaymentMethods(this.ticketId);
		let distChannel = '01', typeSale = 'ZVM';
		let isZSER = this.cartItemList.find(e => e.type == 'ZSER');
		let _salesmanId = JSON.parse(localStorage.getItem('activeSalesman')).salesmanId;
		let paymenthGreat = this._getGreaterAmountPayment(payment_methods).paymentMethodId;

		console.log("authUser",localStorage.getItem('authUser'))
		console.log("authUserObj",JSON.parse(localStorage.getItem('authUser')))
		console.log("userSaleman. ", _salesmanId)

		if(isZSER)
		{
			typeSale = 'ZVS';
			distChannel = '03';
		}

		let header = {
			ticket: this.ticketId,
			auart: typeSale,
			vtweg: distChannel,
			plant: this.userCenter.toString(),
			uname: this.userName.toString(),
			bstkd: this.ticketId,
			bstkd2: 'MP',
			salesgrp: _salesmanId.toString(), //this.userSaleman.toString(),
			salesclerkid: '',
			budat: dateClient,
			vstel: this.userCenter.toString(),
			vkbur: this.userCenter.toString(),
			bukrs: '1000',
			gjahr: yearExecute,
			dzterm: 'ZGM1',
			dzlsch: paymenthGreat,
			currency: 'MXN',
			conexchrat: '1.00000',
			usocfdi: this.typeUsoCdfi,
			kunnr: this.activeClient.clientNumber.toString(),
			guid: '',
			csemanal: '0.00',
			cmensual: '0.00',
			meses: '',
			tipof: '',
			infofina: '',
			docventa: '',
			docentrega: '',
			docfactura: '',
			docfinanzas: '',
			docliqenganche: '',
			fecha: '',
			hora: '',
			docub: '',
			docdeliv: '',
			docmat: '',
			docmatentrega: '',
			docrec: '',
			forward: '',
			tracking: '',
			origenvta: 'MPSS',
			apertura: this.apertureId.toString(),
			startsale: this._dateTimeStartSale,
			endsale: moment().format('YYYY-MM-DD HH:mm:ss'),
			processed: true
		};

		let item_sale = [];
		
		this.cartItemList.forEach((e: ItemCart, index: number) => {
			item_sale.push({
				ticket: this.ticketId,
				auart: typeSale,
				posnr: this._fillCeroToLeft(((index + 1) * 10), 6),
				matnr: e.materialId,
				plant: this.userCenter.toString(),
				menge: 1,
				kbetr: (e.promoPrice ? +e.promoPrice.toFixed(3):e.price), // e.price,
				serialno: (e.imei ? e.imei:''),
				uii: (e.imei ? e.imei:''),
				itcat: '',
				enganche: '0.00',
				interes: '0.00',
				importecupon: '0.00',
				charg: (e.charg ? e.charg:''),
				currency: '',
				origenvta: 'MPSS',
				promotionid: (e.hasOwnProperty('havePromo') ? e.promoCode:'')
			});
		});

		let promotion = this.cartItemList.filter((p: any) => p.havePromo).map((e: any) => (e.promoCode));
		promotion = promotion.filter((v, i) => promotion.indexOf(v) === i).map((id: any) => ({ promotionId: id, ticketId: this.ticketId }));

		return { header, detail: item_sale, method: payment_methods, promotion };
	}

	private _processPaidAccount(isProcessed: boolean): { header: any, detail: any, method: any, promotion: any }
	{
		let dateClient = moment().format('YYYYMMDD');
		let yearExecute = moment().format('YYYY').toString();
		let distChannel = '04', typeSale = 'ZVT';

		let {paidDetails, method} = this._processRecordPaid();
		let paymenthGreat = this._getGreaterAmountPayment(method).paymentMethodId;
		let _salesmanId = JSON.parse(localStorage.getItem('activeSalesman')).salesmanId;
		let clientKunnr = paidDetails.agreementType == 'PJ' ? '000000000':this._fillCeroToLeft(paidDetails.agreementId, 10);

		let header = {
			ticket: paidDetails.ticketId,
			auart: typeSale,
			vtweg: distChannel,
			plant: paidDetails.centerId,
			uname: this.userName.toString(),
			bstkd: paidDetails.financingId,
			bstkd2: paidDetails.agreementType,
			salesgrp: _salesmanId.toString(), // this.userSaleman.toString(),
			salesclerkid: _salesmanId.toString(), // this.userSaleman.toString(),
			budat: dateClient,
			vstel: paidDetails.centerId,
			vkbur: paidDetails.centerId,
			bukrs: '1000',
			gjahr: yearExecute,
			dzterm: 'ZF13',
			dzlsch: paymenthGreat,
			currency: 'MXN',
			conexchrat: '1.00000',
			usocfdi: '',
			kunnr: clientKunnr,
			guid: '',
			csemanal: '0',
			cmensual: '0',
			meses: '0',
			tipof: 'MPF',
			infofina: '',
			docventa: '',
			docentrega: '',
			docfactura: '',
			docfinanzas: '',
			docliqenganche: '',
			fecha: '',
			hora: '',
			docub: '',
			docdeliv: '',
			docmat: '',
			docmatentrega: '',
			docrec: '',
			forward: '',
			tracking: '',
			origenvta: 'MPSS',
			apertura: this.apertureId.toString(),
			startsale: this._dateTimeStartSale,
			endsale: moment().format('YYYY-MM-DD HH:mm:ss'),
			processed: isProcessed
		};

		let item_sale = [];
		
		item_sale.push({
			ticket: paidDetails.ticketId,
			auart: typeSale,
			posnr: this._fillCeroToLeft('1', 6),
			matnr: this._fillCeroToLeft(paidDetails.materialId, 18),
			plant: paidDetails.centerId,
			menge: 1,
			kbetr: paidDetails.amount,
			serialno: '000000',
			uii: '000000',
			itcat: '',
			enganche: '0.00',
			interes: '0.00',
			importecupon: '0.00',
			charg: '000000',
			currency: '',
			origenvta: 'MPSS',
			promotionid: null
		});

		//let promotion = this.cartItemList.filter((p: any) => p.havePromo).map((e: any) => (e.promoCode));
		//promotion = promotion.filter((v, i) => promotion.indexOf(v) === i).map((id: any) => ({ promotionId: id, ticketId: this.ticketId }));

		return { header, detail: item_sale, method: method, promotion: [] };
	}

	/**
	 * @description Devuelve un objeto con los datos de abono a pagar: PJ o MP, junto con los metodos de pagos relacionados a la venta.
	 * @return Object: { paidDetails: any, method: any }
	 */
	private _processRecordPaid(): { paidDetails: { ticketId: string, financingId: string, centerId: string, agreementId: string, agreementType: string, clientName: string, paidDate: string, materialId: string, amount: any }, method: any }
	{
		let {0: details} = this.cartItemList;
		var amount: any = +details.price;
		amount = Number(amount.toFixed(2));

		var typePaid = (details.orderId) ? 'PJ':'MP';
		var datePaid = moment().format('YYYY-MM-DD');

		let recordForPaid = { 
			ticketId: this.ticketId,
			financingId: details.SL,
			centerId: this.userCenter,
			agreementId: details.client_id,
			agreementType: typePaid,
			clientName: details.client,
			paidDate: datePaid,
			materialId: details.materialId,
			amount
		};

		let payment_methods = this._processPaymentMethods(this.ticketId);

		return { paidDetails: recordForPaid, method: payment_methods };
	}

	private _processFinancingPayment()
	{
		let paymentReq, isPJ: boolean;
		let {0: cash} = this.cartItemList;

		let amount: any = +cash.price;
		amount = Number(amount.toFixed(2));
		let financeOrderId = cash.SL;
		let _salesmanId = JSON.parse(localStorage.getItem('activeSalesman')).salesmanId;

		if(cash.orderId)
		{
			isPJ = true;
			paymentReq = { financeOrderId: cash.orderId, amount: amount };
		}
		else
		{
			isPJ = false;
			paymentReq = {
				key: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjb25la3RhIjoiYWJvTjBNNENSMCJ9.Jz4o7jefKNbCFOum4RKnG78Sy3yAn-y0tBDLhXIxPH8",
				financeOrderId,
				merchantId: this.userCenter,
				salesClerkId: this._fillCeroToLeft(_salesmanId, 10), // (+this.userSaleman).toString(), 10),
				amount,
				currency: "MXN",
				caja: "000004"
			};
		}

		return { isPJ, parameters: paymentReq };
	}

	groupItemsCart()
	{
		let groupItems = [];
		let filterNoPromo = this.cartItemList.filter(e => !e.havePromo);

		filterNoPromo.forEach((m: ItemCart) => {
			var matProcess = { ...m, quantity: 1 };

			if(!m.isLote)
			{
				var existPreviousMat = groupItems.find(e => e.materialId === m.materialId);

				if(!existPreviousMat)
				{
					var quantityMat = filterNoPromo.filter(x => x.materialId === m.materialId);
					var quantityPrice = quantityMat.reduce((total, current) => total+=current.price, 0);
					matProcess = { ...m, quantity: quantityMat.length, price: quantityPrice };
					groupItems.push(matProcess);
				}
			}
			else
			{
				matProcess['imei'] = m.imei;
				groupItems.push(matProcess)
			}
		});

		return groupItems;
	}

	groupItemsCartByPromo()
	{
		let groupItems = [], filterOnlyPromo = this.cartItemList.filter(e => e.havePromo);

		filterOnlyPromo.forEach((p: any) => {
			let {promoCode, promoName, promoID} = p;
			let existPromo = groupItems.find((g: any) => (g.promoCode === promoCode && g.promoID === promoID));
			
			if(existPromo)
			{
				existPromo.group.push({ ...p });
			}
			else
			{
				groupItems.push({ promoCode, promoID, promoName, group: [{ ...p }], quantity: 0, price: 0 });
			}
		});

		groupItems.forEach((p: any) => {
			p.price = p.group.reduce((total: number, e: any) => total += (e.promoPrice ? e.promoPrice:e.price), 0);
		});

		return groupItems;
	}

	private _getGreaterAmountPayment(paymentList: any[])
	{
		let paymentObject: any = null;
		let greatAmount: any = Math.max.apply(Math, paymentList.map((o) => (o.amount)));
		//console.log("-->", greatAmount, '',  paymentList.find(e => +e.amount === +greatAmount));
		if(paymentList.length === 1)
		{
			paymentObject = paymentList[0];
		}
		else
		{
			paymentObject = paymentList.find(e => +e.amount === +greatAmount);
		}

		return paymentObject;
	}

	cleanSale()
	{
		this._setDefaultClient();
		this.activePromos = [];
		this.cartItemList = [];
		this.promotionList = [];
		this.amoutPay = 0.00;
		this.paymentSell = [];
		this.showAddButton = false;
		this.blockAfterSale = false;
		this.paymentIdModal = '1';
		this.paymentCardIdModal = 1;
		this.ticketId = this._getTicketSale();
		this._functionPlatform = null;
		this.informationTicket = null;
		this.recharge_step = 1;
		this.service_selected = null;
		this.company_selected = null;
		this.phoneA = "";
		this.phoneB = "";
		this._dateTimeStartSale = '';
		this.amoutPayArr = {};
		this.paymentCardIdModalArr = {};
		this.product_selected = null;
		this._notifyPromo = [];
		this.amoutPayArr = {};
		this.paymentCardIdModalArr = {};
		this.typeUsoCdfi = 'P01';
	}

	validateTypePayment(): boolean
	{
		return (this.paymentIdModal.trim() == '4' || this.paymentIdModal.trim() == '8');
	}

	canShowTerminalList(paymentTypeId: string): boolean
	{
		return (paymentTypeId.trim() === '4' || paymentTypeId.trim() === '8');
	}

	isAvailableStock(info: any): boolean
	{
		return (info.stock !== "Agotado") ? true:false;
	}

	public startFinancingSale(financing: { header: any, detail: any[], extra: any })
	{
		console.log('Reanudar ticket. ', financing);
		if(financing)
		{
			this._spinnerService.show();
			this._functionPlatform = typeMethods.RFIN;

			financing.detail.forEach(async (e: ItemFinancing) => {
				let _matLote: any = '';
				console.log('->', this.materialList, '-', this._fillCeroToLeft(e.MATNR, 18));
				let _existsMat = this.materialList.find((m: any) => m.materialId ==  this._fillCeroToLeft(e.MATNR, 18));
				let _matName = _existsMat ? _existsMat.nombre:'Material no registrado en el centro';

				try
				{
					if(e.UII.trim() !== '')
					{
						_matLote = await this._catalogService.getMaterialByIMEI(this.userCenter, e.UII).toPromise();
						_matLote = _matLote ? _matLote.imei[0].charg:'';
					}
				}
				catch(error)
				{
					_matLote = '';
				}
				
				e['CHARG'] = _matLote;
				
				let itemCart = {
					"id": 0,
					"havePromo": false,
					"materialId": e.MATNR,
					"nombre": _matName,
					"barCode": e.MATNR,
					"type": "ZFIN",
					"isLote": false,
					"price": (e.ENGANCHE > 0) ? e.ENGANCHE : e.KBETR,
					//"imei": e.SERIALNO,
					"uii": e.UII,
					"SL": e.TICKET,
					"h": financing.header,
					"d": e
				};

				(_matLote != '') && (itemCart['imei'] = e.SERIALNO)

				this.cartItemList.push(itemCart);
			});

			this._modalTicketMP.hide();
			this._spinnerService.hide();
			this._isValidMatPromo(); // Valida que exist alguna promoción
			(this._dateTimeStartSale.trim() === '') && (this._dateTimeStartSale = moment().format('YYYY-MM-DD HH:mm:ss'));
		}
	}

	private _beginConfigInterface(material: any, mercurioService?: String): typeMethods
	{
		let _typeConfig: typeMethods;
		let { type: typeMat } = material;

		console.log("TYPE_MAT",typeMat);

		switch(typeMat)
		{
			case "ZSER": {
				console.log("TYPE_MAT_VALUE",mercurioService);
				if(mercurioService == undefined){
					_typeConfig = typeMethods.CONT
				}
				if(mercurioService == "TAE"){
					_typeConfig = typeMethods.TAE;
				}
			} 
			case "ZMER": _typeConfig = typeMethods.CONT;
			case "ZFIN": _typeConfig = typeMethods.FIN;
			default: _typeConfig = typeMethods.CONT;
		}
		
		return _typeConfig;
	}

	configComponentPos(): { input: boolean, material: boolean, find: boolean, client: boolean, ticket: boolean, abono: boolean, tae: boolean, terceros: boolean, apartado: boolean, devolucion: boolean, lastPrint: boolean }
	{
		let confBtn = { input: false, material: false, find: false, // LVL1 
			client: false, ticket: false, abono: false, tae: false, // LVL2 
			terceros: false, apartado: false, devolucion: false, lastPrint: false }; // LVL3 

		switch (this._functionPlatform)
		{
			case typeMethods.FIN: case typeMethods.RFIN:
				confBtn = { input: true, material: true, find: true,
					client: true, ticket: true, abono: true, tae: true, 
					terceros: true, apartado: true, devolucion: true, 
					lastPrint: true }; break;
			case typeMethods.CONT:
				confBtn = { input: false, material: false, find: false,
					client: false, ticket: true, abono: true, tae: true, 
					terceros: true, apartado: true, devolucion: true, 
					lastPrint: true }; break;
			case typeMethods.SERV:
				confBtn = { input: false, material: false, find: false,
					client: false, ticket: true, abono: true, tae: true, 
					terceros: true, apartado: true, devolucion: true, 
					lastPrint: true }; break;
			case typeMethods.TAE:
				if(this.product_selected != undefined){
					confBtn = { input: true, material: true, find: false,
						client: false, ticket: true, abono: true, tae: true, 
						terceros: true, apartado: true, devolucion: true, 
						lastPrint: true }; break;
				}
				
			default:
				confBtn = { ...confBtn }; break;
		}

		return confBtn;
	}

	closeRecharge(createRecharge){
		createRecharge.hide();
		this.phoneB = "";
	}

	closePhoneModal(createAskPhone){
		createAskPhone.hide();
		this.phoneB = "";
	}

	openPaymentOption(evt, paymentOption, paymentId)
	{
		this.paymentIdModal = paymentId;
		console.log("pago seleccionado",this.paymentIdModal)
		var i, tabcontent, tablinks;
		tabcontent = document.getElementsByClassName("tabcontent");

		for (i = 0; i < tabcontent.length; i++)
		{
		  tabcontent[i].style.display = "none";
		}
		
		tablinks = document.getElementsByClassName("list-group-item");

		for (i = 0; i < tablinks.length; i++)
		{
		  //tablinks[i].className = tablinks[i].className.replace(" active", "");
		  tablinks[i].classList.remove("active");
		}

		document.getElementById(paymentOption).style.display = "block";
		evt.currentTarget.className += " active";

		setTimeout(_ => {
			document.getElementById(`amountpayment-${paymentId}`).focus();
		}, 500);
	}

	/**
	 * Metodo para validar el RFC
	 * @param rfc 
	 * @returns `Boolean` - Devuelve el RFC si es valido, en caso contrario un falso
	 */
	private _isValidRFC(rfc: string): boolean
	{
		let _isValid = false;
		var rfcEnter = rfc.toUpperCase().trim();
		let regExp = /^([A-ZÑ&]{3,4}) ?(?:- ?)?(\d{2}(?:(?:0[1-9]|1[0-2])(?:0[1-9]|1[0-9]|2[0-8])|(?:0[469]|11)(?:29|30)|(?:0[13578]|1[02])(?:29|3[01]))|(?:0[048]|[2468][048]|[13579][26])0229) ?(?:- ?)?([A-Z\d]{2})([A\d])$/;
		var regExpInstance = new RegExp(regExp);
		var matchArray = rfcEnter.match(regExpInstance);
		_isValid = (matchArray == null) ? false:true;

		return _isValid;
	}

	/**
	 * @description Añade a un numero o cadena la cantidad de ceros hacia la izquierda solicitados, tomando en cuenta la posiciones de la entrada; ejemplo: `1023` con 6 posiciones -> `001023`
	 * @param nr String
	 * @param n Number
	 * @param str Any
	 * @returns String - retorna el valor con 0 a la izquierda
	 */
	private _fillCeroToLeft(nr: any, n: number, str: any = null)
	{
		return Array(n-String(nr).length+1).join(str||'0')+nr;
	}

	private _isValidMatPromo()
	{
		if(this.promotionList.length === 0)
		{
			let filterPromo: number = 0;

			switch(this._functionPlatform)
			{
				case typeMethods.CONT: filterPromo = 1; break;
				case typeMethods.RFIN: filterPromo = 4; break;
				default: console.log("No aplica promociones"); break;
			}

			this.promotionList = this._promotionTemp.filter((p) => p.distribution_channel === filterPromo);
			console.log("PL["+filterPromo+"]. ", this.promotionList);
		}

		if(this.promotionList.length > 0)
		{
			this.promotionList.forEach((promo: any) => {
				let {promotion_id,name,condition_id,condition_1,condition_2,required,discount,limit_use} = promo;
				//console.log("--> ", promotion_id, '-', this.activePromos);
				let existPromo = this.activePromos.find(p => (p.promotion_id.toString() === promotion_id.toString() && p.isActive === true));

				console.warn("PROMO: ", name, ' - R. ', required, '- G. ', discount, '--> ', existPromo);

				if(!existPromo)
				{
					console.warn("StartEval");
					var _listRequired: any = [];
					var isValidRequired: boolean = false;
					required.forEach((p: any) => { _listRequired.push(...p.material) });
					_listRequired = _listRequired.map((i: any) => i.material_id);
					let _filterMatNoPromo = this.cartItemList.filter(e => e.havePromo === false); // Filtra la lista de materiales en el carrito para solo devolver materiales sin promocion aplicada
					var _itemsCart = _filterMatNoPromo.map(m => { return m.materialId; });
					var existSomeone = _listRequired.some((p: any) => _itemsCart.includes(p));

					if(existSomeone)
					{
						let previusNotify = this._notifyPromo.find((n: string) => n === promotion_id.trim());
						
						if(!previusNotify)
						{
							this._notifyPromo.push(promotion_id.trim());
							this._createToastAlert("Promoción", `El producto agregado puede participar en esta promoción: ${name}`, "default", 7000);
						}
					}

					if(condition_1.trim() === 'O')
					{
						for(let {quantity,material} of required)
						{
							let filterMatch = _filterMatNoPromo.filter((i: any) => {
								var _evalString = material.reduce((stringVal: string, item: any) => stringVal+= (stringVal.trim() == '' ? `'${item.material_id}' === '${i.materialId}'`:`|| '${item.material_id}' === '${i.materialId}'`), '');
								//console.log("print. ", _evalString)
								if(eval(_evalString)){ return i; }
							});

							console.log("x. ", filterMatch, '-', quantity);

							if(filterMatch.length >= parseInt(quantity)) //i.slice(0, 3);
							{
								isValidRequired = true; break;
							}
						}
					}
					else
					{
						let fullCondition: number = 0;
						let itemCartSale = _filterMatNoPromo.map(m => { return m.materialId; });

						for(let {quantity,material} of required)
						{
							let requiredList = material.map((m: any) => { return m.material_id; });
							//let _existMaterials = requiredList.every((m: any) => itemCartSale.includes(m));
							let _existMaterials = requiredList.some(r => itemCartSale.includes(r));
							//console.log("L-->", requiredList)//console.log("CART. ", itemCartSale, '-', _existMaterials);
							if(_existMaterials)
							{
								let filterMatch = _filterMatNoPromo.filter((i: any) => {
									var _evalString = material.reduce((stringVal: string, item: any) => stringVal+= (stringVal.trim() == '' ? `'${item.material_id}' === '${i.materialId}'`:`|| '${item.material_id}' === '${i.materialId}'`), '');
									//console.log("print. ", _evalString)
									if(eval(_evalString)){ return i; }
								});
	
								console.log("x. ", filterMatch, '-', quantity);
	
								if(filterMatch.length >= parseInt(quantity))
								{
									fullCondition += 1;
								}
							}
							else
							{
								isValidRequired = false; break;
							}

							console.log("Continue");
						}

						if(fullCondition === required.length)
						{
							isValidRequired = true;
						}
					}

					if(isValidRequired)
					{
						let _id = promotion_id.toString().trim();
						let existPromoInactive = this.activePromos.find((k: any) => k.promotion_id === _id);
						//this._createToastAlert("Promoción", `Se han cumplidor los requisitos para aplicar la promoción: ${name}`, "default", 8000);
						console.error("XXX. ", existPromoInactive, '-', [...this.activePromos]);
						if(existPromoInactive)
						{
							existPromoInactive.isActive = true;
							this.activePromos = [...this.activePromos];
							console.warn("E--> ", this.activePromos);
						}
						else
						{
							this.activePromos.push({ promotion_id: _id, condition_id, name, limit_use, condition_1, required, condition_2, discount, count: 0, isActive: true });
						}
					}
				}
			});
		}
	}

	applyPromotion(promoData: any)
	{
		var {promotion_id: promoId, name} = promoData;

		swal.fire({
			title: name.trim().toUpperCase(),
			text: "¿Esta seguro de aplicar esta promoción?",
			icon: 'info',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Si',
			cancelButtonText: 'Cancelar',
		}).then((result) => {
			if(result.isConfirmed)
			{
				let existPromo = this.activePromos.find(p => p.promotion_id.trim() === promoId.trim());
				
				if(existPromo && existPromo.isActive)
				{
					this._processDiscountPromo(promoId, existPromo);
				}
			}
		});
	}

	private _processDiscountPromo(promoId: string, promoInfo: any)
	{
		let {discount, condition_1, condition_2, limit_use, required, count} = promoInfo;
		var _typeEval: string = (condition_2.trim() == 'O') ? '||':'&&';
		var _typeEvalDiscount: string = (condition_2.trim() == 'O') ? '||':'&&';
		var _typeEvalRequired: string = (condition_1.trim() == 'O') ? '||':'&&';
		let _filterMatNoPromo = this.cartItemList.filter((e: any) => e.havePromo === false);

		console.warn("A-->", [...this.cartItemList]);
		console.warn("B__> ", [..._filterMatNoPromo]);

		this._checkItemDiscount(promoId.trim(), promoInfo.name.trim(), _typeEvalDiscount, discount, _typeEvalRequired, required);
		this._validToShowPromo();
		return 0;
		
		if(_typeEval === '||')
		{
			let itemCartSale = _filterMatNoPromo.map(m => { return m.materialId; });
			let allDiscounts = discount.map((d: any) => { return d.material_id; });
			let _existMaterials = allDiscounts.some((r: any) => itemCartSale.includes(r));

			if(_existMaterials)
			{
				// Agrupa los materiales de descuento por el tipo rappel, tipo alcance y cantidad
				var agroupByQuantity: any = [];

				discount.forEach((m: any) => {
					let {condition_id,material_id,material_quantity,min_quantity,type_rappel,type_scale,unit_quantity,value_by_direc,value_by_porc} = m;
					let objectComparation = { material_id, unit_quantity, value_by_direc, value_by_porc };
					let existAgroup = agroupByQuantity.find((ag: any) => (ag.material_quantity === m.material_quantity && ag.type_rappel === type_rappel && ag.type_scale === type_scale));

					if(!existAgroup)
					{
						//agroupByQuantity.push({ condition_id, material: [material_id], material_quantity, min_quantity, type_rappel, type_scale, unit_quantity, value_by_direc, value_by_porc, count: 0 });
						agroupByQuantity.push({ condition_id, material: [objectComparation], material_quantity, min_quantity, type_rappel, type_scale, count: 0 });
					}
					else
					{
						existAgroup.material.push(objectComparation);
					}
				});

				console.log("---> ", agroupByQuantity);

				// Valida que se encuentre la cantidad de materiales requeridos por agrupacion
				let conditionList: any;
				let canApplyPromo: boolean = false;
				
				for(let m of agroupByQuantity)
				{
					/*m.material.forEach((mat: any) => {
						let existInCart = _filterMatNoPromo.find((e: any) => e.materialId === mat.material_id);
						existInCart && (m.count += 1);
					});*/

					_filterMatNoPromo.forEach((e: any) => {
						let existInCart = m.material.find((mat: any) => mat.material_id === e.materialId);
						existInCart && (m.count += 1);
					});
					
					if(m.count >= m.material_quantity)
					{
						conditionList = m;
						canApplyPromo = true; break;
					}
				}

				console.log("CondList. ", conditionList);

				// Aplica descuento sobre la condición cumplida
				if(canApplyPromo)
				{
					let itemChangeStatus = [];
					let countCondition: number = 0;
					let promoNumberId: number = this._getRandomNumber();
					let {material_quantity,type_rappel,material} = conditionList;

					for(let e of _filterMatNoPromo)
					{
						let existInCart = material.find((mat: any) => mat.material_id === e.materialId);
						//console.warn("ExistCond. ", existInCart, '-', e.materialId);
						if(existInCart)
						{
							let {value_by_direc, value_by_porc} = existInCart;

							let originPrice = e.price;
							e['havePromo'] = true;
							e['promoName'] = promoInfo.name.trim();
							e['promoID'] = promoNumberId;
							e['promoCode'] = promoId;
							e['promoPrice'] = this._applyDiscount(type_rappel, originPrice, material_quantity, value_by_direc, value_by_porc);
							countCondition += 1;//console.error('XD. ', e, '-', countCondition);
						}
						
						if(countCondition === material_quantity)
						{
							if(parseInt(limit_use) != 0)
							{
								promoInfo.count = promoInfo.count + 1;

								if(promoInfo.count === parseInt(limit_use))
								{
									let existPromo = this.activePromos.find(p => p.promotion_id === promoId);
									existPromo.isActive = false;
									console.log("PromoInactive");
								}
							}

							console.log("Promo Apply"); break;
						}
					}

					/*for(let mat of material)
					{
						let {material_id, value_by_direc, value_by_porc} = mat;
						let existInCart = _filterMatNoPromo.find((e: any) => e.materialId === material_id);
						
						if(existInCart)
						{
							let originPrice = existInCart.price;
							existInCart['havePromo'] = true;
							existInCart['promoName'] = promoInfo.name;
							existInCart['promoID'] = promoNumberId;
							existInCart['promoPrice'] = this._applyDiscount(type_rappel, originPrice, material_quantity, value_by_direc, value_by_porc);
							countCondition += 1;
						}

						if(countCondition === material_quantity)
						{
							if(parseInt(limit_use) != 0)
							{
								promoInfo.count = promoInfo.count + 1;

								if(promoInfo.count === parseInt(limit_use))
								{
									let existPromo = this.activePromos.find(p => p.promotion_id === promoId);
									existPromo.isActive = false;
									console.log("PromoInactive");
								}
							}

							console.log("Promo Apply"); break;
						}
					}*/

					//console.log("Required list. ", required, '-', promoInfo);
					// Aplica status en havePromo para articulos de condicion required
					for(let {quantity,material} of required)
					{
						let countMatching = 0;
						let materialWithSamePromo = [], materialToApply = [];
						let canBreakStepOne: boolean = false,  canBreak: boolean = false;
						let promoCarts = this.cartItemList.filter((e: any) => e.havePromo === true);
						let noPromoCarts = this.cartItemList.filter((e: any) => e.havePromo === false);
						
						console.log("MATList. ", this.cartItemList);
						
						// STEP ONE VALIDATION WITH MATERIAL HAS PROMOID ASSIGNED
						for(let m of promoCarts)
						{
							var _evalString = material.reduce((stringVal: string, item: any) => stringVal+= (stringVal.trim() == '' ? `'${item.material_id}' === '${m.materialId}'`:`|| '${item.material_id}' === '${m.materialId}'`), '');
							//console.log("print. ", _evalString)
							if(eval(_evalString))
							{
								console.log("STEP-ONE -> ", countMatching, '-', parseInt(quantity), '-', m, '-', (m.promoID === promoNumberId));
								if(m.promoID === promoNumberId)
								{
									countMatching += 1;
									materialWithSamePromo.push(m.unique);
								}
							}

							if(countMatching === parseInt(quantity))
							{
								console.warn("STEP ONE DF, ", materialWithSamePromo);
								canBreakStepOne = true; break;
							}
						}

						if(canBreakStepOne)
						{
							console.log("Complete requiered before step two"); break;
						}
						
						// STEP TWO VALIDATION WITH NO PROMOID
						for(let i of noPromoCarts)
						{
							var _evalString = material.reduce((stringVal: string, item: any) => stringVal+= (stringVal.trim() == '' ? `'${item.material_id}' === '${i.materialId}'`:`|| '${item.material_id}' === '${i.materialId}'`), '');
							//console.log("print. ", _evalString)
							if(eval(_evalString))
							{
								console.log("X -> ", countMatching, '-', parseInt(quantity), '-', i, '-', !(i.promoID === promoNumberId));
								countMatching += 1;
								let existsInBeforeStep = materialWithSamePromo.find((n: number) => n === i.unique);
								!(existsInBeforeStep) && materialToApply.push(i.unique);
							}

							if(countMatching === parseInt(quantity))
							{
								console.warn("DF, ", materialToApply);
								canBreak = true; break;
							}
						}

						if(canBreak)
						{
							itemChangeStatus = [...materialToApply]; break;
						}
					}

					// Aplica cambio de status en base de id de articulo unique
					itemChangeStatus.forEach((e: number) => {
						let existMaterial = this.cartItemList.find((item: any) => item.unique === e);
						
						if(existMaterial)
						{
							existMaterial['promoCode'] = promoId.trim();
							existMaterial['promoName'] = promoInfo.name.trim();
							existMaterial['promoID'] = promoNumberId;
							existMaterial.havePromo = true;
						}
					});

					this._validToShowPromo()
				}

				console.log("AFTER PROMO --> ", this.cartItemList);
			}
			else
			{
				this._sweetAlert("Promoción", "No se encontraron los materiales necesarios para aplicar la promoción", "info");
			}
		}
		else
		{
			this._checkItemDiscount(promoId.trim(), promoInfo.name.trim(), _typeEval, discount, _typeEvalRequired, required);
		}
	}

	private _checkItemDiscount(promotionId: string, promotionName: string, typeCheckDiscount: string, itemsDiscount: any[], typeCheckRequired: string, itemsRequired: any[]): any
	{
		let canApplyCartItems: boolean = false;
		let promoNumberId: number = this._getRandomNumber();
		// Agrupa los materiales de descuento por el tipo rappel, tipo alcance y cantidad
		let agroupItemDiscount: any = this._agroupItemsDiscount(itemsDiscount);
		let _filterMatNoPromo = this.cartItemList.filter((e: any) => e.havePromo === false);

		if(typeCheckDiscount === '&&')
		{
			let materialApply: any[] = [];
			let isValidDiscount: boolean = true;

			// Get material list of validation
			for(let condReq of agroupItemDiscount)
			{
				let successfulCondition: boolean = false;
				let {is_group: isGroup, material, material_quantity: quantity} = condReq;
				let { type_rappel, type_scale, unit_quantity, value_by_direc, value_by_porc } = condReq;

				console.warn("CONDITION PROMOTION. ", condReq);

				if(!isGroup)
				{
					let itemsFindNoGroup = _filterMatNoPromo.filter((m: any) => m.materialId === material);
					
					console.log(`MATERIAL_ID: ${material} ${itemsFindNoGroup.length} >= ${quantity}`);
					
					if(itemsFindNoGroup.length >= parseInt(quantity))
					{
						let itemsFilter = itemsFindNoGroup.slice(0, parseInt(quantity)).map(m => (m.unique));

						materialApply.push({ type_rappel, type_scale, unit_quantity, value_by_direc, value_by_porc, items: [...itemsFilter], 'quantity': parseInt(quantity) });
						successfulCondition = true;
					}
				}
				else
				{
					for(let mat of material)
					{
						let itemsFindWithGroup = _filterMatNoPromo.filter((m: any) => m.materialId === mat.material_id);
						
						console.log(`MAT_ID: ${mat.material_id} => ${itemsFindWithGroup.length} >= ${quantity}`);
						
						if(itemsFindWithGroup.length >= parseInt(quantity))
						{
							let itemsFilter = itemsFindWithGroup.slice(0, parseInt(quantity)).map(m => (m.unique));
							
							materialApply.push({ type_rappel, type_scale, unit_quantity, value_by_direc, value_by_porc, items: [...itemsFilter], 'quantity': parseInt(quantity) });
							successfulCondition = true; break;
						}
					}
				}

				if(!successfulCondition)
				{
					this._sweetAlert(promotionName, "No se encontraron los materiales necesarios para aplicar la promoción", "info");
					console.log("Incompleted validation");
					isValidDiscount = false; break;
				}

				console.log("Pass validations. ", successfulCondition);
			}

			if(isValidDiscount)
			{
				console.info("Can Apply a discount in material list {AND}")

				materialApply.forEach((item: any) => {
					let { quantity, type_rappel, value_by_direc, value_by_porc } = item;

					for(let i of item.items)
					{
						let itemToApply = this.cartItemList.find((article: any) => article.unique === i);
						itemToApply['havePromo'] = true;
						itemToApply['promoID'] = promoNumberId;
						itemToApply['promoName'] = promotionName;
						itemToApply['promoCode'] = promotionId;
						itemToApply['promoPrice'] = this._applyDiscount(type_rappel, itemToApply.price, parseInt(quantity), value_by_direc, value_by_porc);
					}
				});

				canApplyCartItems = true;
			}
		}
		else
		{
			let materialApply: any[] = [];
			let isValidDiscount: boolean = true;
			let successfulCondition: boolean = false;

			// Get material list of validation
			for(let condReq of agroupItemDiscount)
			{
				let { is_group: isGroup, material, material_quantity: quantity } = condReq;
				let { uniqueId, type_rappel, type_scale, unit_quantity, value_by_direc, value_by_porc } = condReq;

				console.warn("CONDITION PROMOTION OR. ", condReq);

				if(!isGroup)
				{
					let itemsFindNoGroup = _filterMatNoPromo.filter((m: any) => m.materialId === material);
					
					console.log(`MATERIAL_ID OR: ${material} ${itemsFindNoGroup.length} >= ${quantity}`);
					
					if(itemsFindNoGroup.length >= parseInt(quantity))
					{
						let itemsFilter = itemsFindNoGroup.slice(0, parseInt(quantity)).map(m => (m.unique));

						materialApply.push({ uniqueId, type_rappel, type_scale, unit_quantity, value_by_direc, value_by_porc, items: [...itemsFilter], 'quantity': parseInt(quantity) });
						successfulCondition = true; break;
					}
				}
				else
				{
					let itemsMatch = [];

					for(let matId of material)
					{
						let itemsFindWithGroup = _filterMatNoPromo.filter((m: any) => m.materialId === matId);
						
						console.log(`MAT_ID OR: ${matId} => ${itemsFindWithGroup.length} >= ${quantity}`);

						(itemsFindWithGroup.length > 0) && itemsMatch.push(...itemsFindWithGroup);
					}

					console.log(`MATCH OR => ${itemsMatch.length} >= ${parseInt(quantity)}`);

					if(itemsMatch.length >= parseInt(quantity))
					{
						console.warn("PassValidation with LIST => ", itemsMatch);

						let itemsFilter = itemsMatch.slice(0, parseInt(quantity)).map(m => (m.unique));
						materialApply.push({ uniqueId, type_rappel, type_scale, unit_quantity, value_by_direc, value_by_porc, items: [...itemsFilter], 'quantity': parseInt(quantity) });
						
						successfulCondition = true; break;
					}
				}

				console.warn('Continue to next required list of materials', condReq.group_items);
			}

			if(successfulCondition)
			{
				console.info("Can Apply a discount in material list {OR} => ", materialApply, ' - Condition List => ', agroupItemDiscount)

				materialApply.forEach((item: any) => {
					let { uniqueId, quantity, type_rappel, value_by_direc, value_by_porc } = item;

					for(let i of item.items)
					{
						let itemToApply = this.cartItemList.find((article: any) => article.unique === i);
						itemToApply['havePromo'] = true;
						itemToApply['promoCode'] = promotionId;
						itemToApply['promoID'] = promoNumberId;
						itemToApply['promoName'] = promotionName;
						itemToApply['uniqueCondition'] = uniqueId;
						itemToApply['promoPrice'] = this._applyDiscount(type_rappel, itemToApply.price, parseInt(quantity), value_by_direc, value_by_porc);
					}
				});

				canApplyCartItems = true;
			}
			else
			{
				this._sweetAlert(promotionName, "No se encontraron los materiales necesarios para aplicar la promoción", "info");
			}

			console.log("Pass validations. ", isValidDiscount);
		}

		// Agrega el identificador de la agrupacion de esta promoción a los materiales del carrito que pertenecen a la lista de materiales del requerimiento
		if(canApplyCartItems)
		{
			let itemsApplyPromo: any[] = [];
			let filterCartItems = this.cartItemList.filter((e: any) => e.havePromo === false);

			if(typeCheckRequired === '&&')
			{
				for(let req of itemsRequired)
				{
					let matchList = [];
					let { group_type, group_id, quantity, material } = req;

					for(let {material_id} of material)
					{
						let matchItems = filterCartItems.filter((m: any) => m.materialId === material_id);
						
						console.log(`MAT_ID: ${material_id} => ${matchItems.length} >= ${parseInt(quantity)}`);
						
						(matchItems.length > 0) && matchList.push(...matchItems);
					}

					if(matchList.length >= parseInt(quantity))
					{
						console.log(`=> ${matchList.length} >= ${parseInt(quantity)}`);
						let itemsFilter = matchList.slice(0, parseInt(quantity)).map(m => (m.unique));
						itemsApplyPromo.push({ group_type, group_id, items: [...itemsFilter] });
					}
				}
			}
			else
			{
				let canBreakItems: boolean = true;

				for(let {uniqueId, material_quantity} of agroupItemDiscount)
				{
					let validQuatity = this.cartItemList.filter((m: any) => m.uniqueCondition === uniqueId).length;
					
					console.log(`[${uniqueId}] Check items befored update: ${material_quantity} = ${validQuatity}`);
					
					if(material_quantity === validQuatity)
					{
						canBreakItems = false; break;
					}
				}

				if(canBreakItems)
				{
					for(let req of itemsRequired)
					{
						let matchList = [];
						let { group_type, group_id, quantity, material } = req;

						for(let {material_id} of material)
						{
							let matchItems = filterCartItems.filter((m: any) => m.materialId === material_id);
							
							console.log(`MAT_ID OR: ${material_id} => ${matchItems.length} >= ${parseInt(quantity)}`);
							
							(matchItems.length > 0) && matchList.push(...matchItems);
						}

						if(matchList.length >= parseInt(quantity))
						{
							console.log(`OR => ${matchList.length} >= ${parseInt(quantity)}`);
							let itemsFilter = matchList.slice(0, parseInt(quantity)).map(m => (m.unique));
							itemsApplyPromo.push({ group_type, group_id, items: [...itemsFilter] }); break;
						}
						else
						{
							console.warn("No valid amount materials for condition Req => ", req);
						}
					}
				}
			}

			// Apply change status and assignament a promotion data in material required for condition
			itemsApplyPromo.forEach((item: any) => {
				for(let i of item.items)
				{
					let itemToApply = this.cartItemList.find((article: any) => article.unique === i);
					itemToApply['havePromo'] = true;
					itemToApply['promoID'] = promoNumberId;
					itemToApply['promoName'] = promotionName;
					itemToApply['promoCode'] = promotionId;
				}
			});

			this.showConfetti = true;
			setTimeout(()=> { this.showConfetti = false }, 6000);
			
			console.warn("Materials in cart has checked with required items of promotion");
		}
	}

	private _applyDiscount(typeDiscount: string, originPrice: any, quantity: number, absolutPrice: any, porcentPrice: any)
	{
		let price = 0;
		let _priceDouble: any = +originPrice;
		_priceDouble = +_priceDouble.toFixed(2);

		console.warn("AD--> ", typeDiscount, '-', `${originPrice}=>${_priceDouble}`, '-', quantity, '-', absolutPrice, '-', porcentPrice+'=>'+this._fillCeroToLeft(parseInt(porcentPrice), 2));

		switch(typeDiscount)
		{
			case 'R': 
				price = _priceDouble - absolutPrice; break; // Descuento Absoluto - Resta del total con un precio fijo
			case '%': 
				var finalPrice = 0.01;

				if(parseInt(porcentPrice) != 100)
				{
					var porcentaje: any = this._fillCeroToLeft(parseInt(porcentPrice), 2);
					porcentaje = `0.${porcentaje}`;
					finalPrice = _priceDouble - (_priceDouble * porcentaje);
				}

				price = finalPrice; break;
			case 'P': 
				var priceEach = +absolutPrice.toFixed(2) / quantity;
				price = priceEach; break; // Precio - El precio de descuento reemplaza al precio del material
			default: price = 0; break; // Especias
		}

		return price;
	}

	private _getRandomNumber(min = 1, max = 100000)
	{
		var _min = Math.ceil(min);
		var _max = Math.floor(max);

		return Math.floor(Math.random() * (_max - _min + 1)) + _min;
	}

	returnPromoActive()
	{
		let _filter = this.activePromos.filter(p => p.isActive === true);
		return _filter;
	}

	private _validToShowPromo()
	{
		this.promotionList.forEach((promo: any) => {
			let {promotion_id, required} = promo;

			let _listRequired: any = [];
			required.forEach((p: any) => { _listRequired.push(...p.material) });
			_listRequired = _listRequired.map((i: any) => i.material_id);

			let _filterMatNoPromo = this.cartItemList.filter(e => e.havePromo === false);
			let _itemsCart = _filterMatNoPromo.map(m => { return m.materialId; });
			let existSomeone = _listRequired.some((p: any) => _itemsCart.includes(p));

			if(!existSomeone)
			{
				this.activePromos.forEach((_p: any) => {
					(_p.promotion_id.trim() === promotion_id.trim()) && (_p.isActive = false);
				});

				this.activePromos = [...this.activePromos];
			}
		});

		console.log("Check. ", this.returnPromoActive());
	}

	private _agroupItemsDiscount(discountList: any[])
	{
		let agroupByGroup: any = [];

		discountList.forEach((m: any) => {
			let uniqueId: string = `X${this._getRandomNumber(9999, 99999999)}`;
			let {condition_id,material_id,material_quantity,min_quantity,type_rappel,type_scale,unit_quantity,value_by_direc,value_by_porc,group_material} = m;
		
			if(group_material.trim() === '') // No group material
			{
				agroupByGroup.push({ uniqueId, condition_id, items_group: group_material.trim(), is_group: false, material: material_id, material_quantity, min_quantity, type_rappel, type_scale, unit_quantity, value_by_direc, value_by_porc, count: 0 });
			}
			else // have material group
			{
				let existAgroup = agroupByGroup.find((ag: any) => (ag.group_items === group_material.trim()));

				if(!existAgroup)
				{
					agroupByGroup.push({ uniqueId, condition_id, group_items: group_material.trim(), is_group: true, material: [material_id], material_quantity, min_quantity, type_rappel, type_scale, unit_quantity, value_by_direc, value_by_porc, count: 0 });
				}
				else
				{
					existAgroup.material.push(material_id);
				}
			}
		});

		return agroupByGroup;
	}

	addChar(input_index,value)
	{
		if(this.amoutPayArr[input_index] == undefined)
		{
			this.amoutPayArr[input_index] = '';
		}

		if(value == "C")
		{
			this.amoutPayArr[input_index] = '0';
		}
		else if(value == "D")
		{
			this.amoutPayArr[input_index] = this.amoutPayArr[input_index].slice(0, -1);
		}
		else
		{
			if(this.amoutPayArr[input_index].includes(".")){
				if(value != "."){
					var tempArr = this.amoutPayArr[input_index].split(".");
					if(tempArr[1].length < 2){
						this.amoutPayArr[input_index] = this.amoutPayArr[input_index] + value;
					}
				}
			}else{
				this.amoutPayArr[input_index] = this.amoutPayArr[input_index] + value;
			}
		}
	}

	removePaymentMethod(input_index)
	{
		if(this.paymentSell.find( payment => payment.id == this.paymentIdModal )){
			var temp = this.paymentSell.find( payment => payment.id == this.paymentIdModal )
			this.paymentSell.splice(this.paymentSell.indexOf(temp), 1); 
		}
		this.amoutPayArr[input_index] = ""
		delete this.amoutPayArr[input_index] 
	}

	_autoSaveFile(componentNameId: string, imgWidth: number = 208, fileName: string)
	{
		let data = document.getElementById(componentNameId);
		console.warn("begin autosave", data);
		html2canvas(data, { allowTaint: false, useCORS: true }).then(canvas => {
			// Few necessary setting options 
			var pageHeight = 295;
			var imgHeight = canvas.height * imgWidth / canvas.width;  
			var heightLeft = imgHeight;

			console.info('C.', imgHeight, '-', canvas);

			const contentDataURL = canvas.toDataURL('image/png');
			console.info('C.', contentDataURL);

			document.body.appendChild(canvas);

			let pdf = new jsPDF('p', 'mm', 'A4'); // A4 size page of PDF  
			var position = 0;
			pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight)  
			pdf.save(`cans.pdf`); // Generated PDF
		});
	}

	_autoSaveFile2(componentNameId: string, imgWidth: number = 208)
	{
		let data = document.getElementById(componentNameId);
		console.warn("begin autosave", data);
		html2canvas(data, { allowTaint: false, useCORS: true }).then(canvas => {
			// Few necessary setting options 
			var imgHeight = canvas.height * imgWidth / canvas.width;  

			console.info('C.', imgHeight, '-', canvas);

			const contentDataURL = canvas.toDataURL('image/png');
			console.info('C.', contentDataURL);

			document.body.appendChild(canvas);

			let pdf = new jsPDF('p', 'px', 'A4'); // A4 size page of PDF  
			var position = 0;
			pdf.addImage(contentDataURL, 'PNG', 0, position, 780, 2600);
			pdf.save(`cans.pdf`); // Generated PDF
		});
	}

	changeSalesman()
	{
		this._salesmanService.changeActiveSaleman(false, true, true);
	}

}
