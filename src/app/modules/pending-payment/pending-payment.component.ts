import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { SaleHeader } from 'src/app/interfaces/sale-header.interface';
import { CatalogsService } from 'src/app/services/catalogs.service';
import { SaleService } from 'src/app/services/sale.service';
import { GenericAlertService } from 'src/app/utils/generic-alert.service';
import * as moment from 'moment/moment';

enum SelectionType
{
	single = "single",
	multi = "multi",
	multiClick = "multiClick",
	cell = "cell",
	checkbox = "checkbox"
}

@Component({
	selector: 'app-pending-payment',
	templateUrl: './pending-payment.component.html',
	styleUrls: ['./pending-payment.component.css']
})
export class PendingPaymentComponent implements OnInit
{
	pendingList: Array<any>;
	userSalemanName: any;
	userName: string;
	userCenter: string;
	userSaleman: any;
	apertureId: string;
	cajaId: any;
	columnDataTable: any[];
	dataSourceTable: any[];
	originSourceTable: any[];
	centerList: any[];
	selectedCenter: string;

	// DataSource Table Variables
	entries: number = 10;
	selected: any[] = [];
	activeRow: any;
	SelectionType = SelectionType;

	@ViewChild('promotionModal', { static: true }) modalPromotions: ModalDirective;
	@ViewChild('tablependingWrapper') tablependingWrapper: any;
  	@ViewChild(DatatableComponent) tablepending: DatatableComponent;
	@ViewChild('inputcodebar') inputCodeBar: ElementRef;

	constructor(private _saleService: SaleService, private _ngxSpinner: NgxSpinnerService, private _genericAlertService: GenericAlertService, private _catalogService: CatalogsService)
	{
		this.selectedCenter = '0';
		this.pendingList = [];
	}

	async ngOnInit()
	{
		this._ngxSpinner.show();
		this._setCashboxInfo();
		this.centerList = [];
		this.columnDataTable = ['referencia', 'ticket_id', 'apertura_id', 'pagado', 'fecha', 'processed'];

		await this._getPendingPayments();
		this._ngxSpinner.hide();
	}

	onChangeCenter(selectedValue: any)
	{
		this.selectedCenter = selectedValue.trim();
		this.dataSourceTable = (this.selectedCenter.trim() !== '0' ? this.originSourceTable.filter(e => e.centro.trim() === this.selectedCenter):[...this.originSourceTable]);
	}

	private async _getPendingPayments()
	{
		this._ngxSpinner.show();
		this.dataSourceTable = [];
		this.originSourceTable = [];

		try
		{
			let requestList: { status: string, data: any } = await this._saleService.getPaidPending().toPromise();
			
			if(requestList.data.length > 0)
			{
				let _requestList = requestList.data.map((e: any) => ({ ...e.header, referencia: e.header.refClienteUno, pagado: (e.detail[0].importe).toFixed(2), detail: e.detail }));
				this.dataSourceTable = [..._requestList];
				this.originSourceTable = [..._requestList];
				this.centerList = [...new Set(_requestList.map((e: any) => e.centro.trim()))];

				this._ngxSpinner.hide();
			}
			else
			{
				this._ngxSpinner.hide();
				this._genericAlertService.createSweetAlert('Abonos', 'No se encontrarón abonos pendientes para procesar', 'info');
			}
		}
		catch(err)
		{
			this._ngxSpinner.hide();
			console.error('Error catching: ', err);
		}	
	}

	private _setCashboxInfo()
	{
		let storageAuth = localStorage.getItem('authUser') ? JSON.parse(localStorage.getItem('authUser')):null;
		this.userSalemanName = storageAuth ? `${storageAuth.name} ${storageAuth.surname}`:'Vendedor no registrado';
		this.userName = storageAuth ? storageAuth.username:'';
		this.userCenter = localStorage.getItem('centro') ? localStorage.getItem('centro'):'';
		this.userSaleman = storageAuth ? storageAuth.salesmanId:'';
		this.apertureId = localStorage.getItem('currentDrawerAperture') ? JSON.parse(localStorage.getItem('currentDrawerAperture')).id:0;
		this.cajaId = localStorage.getItem('currentDrawer') ? JSON.parse(localStorage.getItem('currentDrawer')).caja:0;
	}

	findBySale(textInput: any)
	{
		
	}

	entriesChange($event)
	{
		this.entries = $event.target.value;
	}

	filterTable($event)
	{
		let val = $event.target.value;

		this.dataSourceTable = this.originSourceTable.filter((d) => {
			//console.log('X.', d)
			for(var key in d)
			{
				//console.log('a. ', key)
				if(d[key] != undefined)
				{
					if((d[key].toString()).toUpperCase().indexOf(val) !== -1)
					{
						return true;
					}
				}
				else
				{
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
			console.log('Select, ', eventRow.row);
			let sale = eventRow.row;

			this._genericAlertService.questionSweetAlert('Alerta', `¿Desea realizar el procesamiento del ticket [${sale.ticketId}]`).then((result) => 
			{
				if(result.isConfirmed)
				{
					if(sale.tipoVenta == "ZVS")
					{
						this._processPaidSale(sale);
					}
					else
					{
						this._processPaidAccount(sale, sale.pagado.toString());
					}
				}
			});
		}
	}

	ngAfterViewChecked()
	{
		this.tablepending.recalculate();
	}

	changeColumnName(propiertieName: string)
	{
		let columnName = '';

		switch(propiertieName)
		{
			case 'grupo_vendedor': columnName = 'VENDEDOR ID'; break;
			case 'processed': columnName = 'STATUS'; break;
			default: columnName = propiertieName.replace('_', ' '); break;
		}

		return columnName;
	}

	private _processPaidSale(paymentInfo)
	{
		this._ngxSpinner.show();

		//var tempSales = this.pendingList.filter(obj => { return obj.header.ticketId == paymentInfo.ticketId; })

		var sale = this.generateHeaderSap(paymentInfo);//tempSales[0]);

		console.log("PAYMENT PENDING INFO",sale);
		this._saleService.processPendingSale(sale).subscribe(async (response:any) => 
		{
			if(response.status === 'success')
			{
				let updateRequest = await this._saleService.updatePaidPending(paymentInfo.id, { canReplace: false }).toPromise();
				this._ngxSpinner.hide();
				this._genericAlertService.createSweetAlert("Información", `Se ha realizador el procesamiento del Ticket: ${paymentInfo.ticketId}`, "success").then((e: any) => { this._getPendingPayments() });
			}
			else
			{
				this._ngxSpinner.hide();
				this._genericAlertService.createSweetAlert("Error", response.data, "warning");
			}

			this._reloadPendingList();
		}, err => {
			this._ngxSpinner.hide();
			this._genericAlertService.createSweetAlert("Error", "Ocurrió un error al realizar la petición con el servidor", "warning").then((e: any) => { this._reloadPendingList(); });
		});
	}

	generateHeaderSap(sale)
	{
		console.log("generateHeaderSap. ", sale);
		var header = sale;
		var details = sale.detail;
		var ticketId = header.ticketId; //(header.ticketId.trim().length > 16) ? header.ticketId.trim().slice(4):header.ticketId;

		let headerSAP =
		{
			ticket: ticketId, //header.ticketId,
			auart: header.tipoVenta,
			vtweg: header.canalDistribucion,
			plant: header.centro,
			uname: this.userName.toString(),
			bstkd: header.refClienteUno,
			bstkd2: header.refClienteDos,
			salesgrp: header.grupoVendedor,
			salesclerkid: '',
			budat: header.ticketId.substring(0,8),
			vstel: header.centro,
			vkbur: header.centro,
			bukrs: header.sociedad,
			gjahr: header.anoEjercicio,
			dzterm: 'ZGM1',
			dzlsch: header.metodoPagoId, 
			currency: 'MXN',
			conexchrat: '1.00000',
			usocfdi: 'P01',
			kunnr: header.deudorId,
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
			apertura: header.aperturaId,
			startsale: header.startSale,
			endsale: header.endSale
		};

		var detailsSAP = [];

		details.forEach((detail: any) => {
			var detailTemp = 
			{
				ticket: ticketId,
				auart: detail.tipoVenta,
				matnr: detail.materialId,
				plant: header.centro,
				menge: detail.cantidad,
				kbetr: detail.importe,
				serialno: "",
				uii: "",
				itcat: "",
				enganche: "0.00",
				interes: "0.00",
				importe_cupon: "0.00",
				charg: "",
				currency: ""
			};

			detailsSAP.push(detailTemp); 
		});

		sale.header = headerSAP;
		sale.detail = detailsSAP;
		return sale;
	}

	private async _processPaidAccount(paymentInfo: SaleHeader, totalPayment: string)
	{
		this._ngxSpinner.show();

		let dataUpdate: any = {};
		let ticketSL = paymentInfo.refClienteUno;
		let ticketNotSL = ticketSL.substr(2, ticketSL.length);
		let indexByLength = paymentInfo.ticketId.trim().length - 16;
		let isGreatLength: boolean = (paymentInfo.ticketId.trim().length > 16);
		let ticketId = (paymentInfo.ticketId.trim().length > 16) ? paymentInfo.ticketId.trim().slice(indexByLength):paymentInfo.ticketId;
		//var headerTransacc = _typeTransacc === 'MP' ? 'MACROPAY':'PAYJOY';
		let formatDate = moment(paymentInfo.fecha);

		let recordFinancing = {
			customer: '', // no se llena
			companyCode: '', // no se llena
			fiDocument: '', // no se llena
			fiscalYear: formatDate.format('YYYY'),
			postingDate: formatDate.format('YYYYMMDD'),
			cashPayment: totalPayment,
			plant: paymentInfo.centro,
			referenceData: ticketId, //paymentInfo.ticketId,
			textCab: `PAGO MACROPAY`,
			ticketFinan: ticketSL,
			ticket: ticketId, //paymentInfo.ticketId,
			bstkd: ticketNotSL,
			bstkd2: 'MP',
			dzlsch: paymentInfo.metodoPagoId
		};

		dataUpdate = (isGreatLength ? { ticketBefore: paymentInfo.ticketId, ticketAfter: ticketId }:{});
		dataUpdate['canReplace'] = isGreatLength;

		//console.log("-->", recordFinancing);

		this._catalogService.saveFinancingSAP(recordFinancing).subscribe(async (record: { status: string, data: any }|null) => {
			let dataAlert: any = ["Información", `Intente mas tarde procesar del Ticket: ${ticketId}`, "info"];

			if(record.status === 'success')
			{
				dataAlert = ["Información", `Se ha realizador el procesamiento del Ticket: ${ticketId}`, "success"];
				let updateRequest = await this._saleService.updatePaidPending(paymentInfo.id, dataUpdate).toPromise();
				//console.log("Response update => ", updateRequest);
			}

			this._ngxSpinner.hide();
			this._genericAlertService.createSweetAlert(dataAlert[0], dataAlert[1], dataAlert[2]).then((e: any) => { this._getPendingPayments() }).then(_ => {  this._reloadPendingList(); });
		}, err => {
			this._ngxSpinner.hide();
			this._genericAlertService.createSweetAlert("Error", "Ocurrió un error al realizar la petición con el servidor", "warning").then(_ => { this._reloadPendingList(); });
		});
	}

	private async _reloadPendingList()
	{
		this.selectedCenter = '0';
		this.centerList = [];
		this.dataSourceTable = [];
		this.originSourceTable = [];
		await this._getPendingPayments();
	}

}
