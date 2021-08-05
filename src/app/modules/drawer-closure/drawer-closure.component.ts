import { Component, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { DrawerService } from 'src/app/services/drawer.service';
import { SaleService } from 'src/app/services/sale.service';
import { Router,ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import * as printerjs from 'print-js';

@Component({
  selector: 'app-drawer-closure',
  templateUrl: './drawer-closure.component.html',
  styleUrls: ['./drawer-closure.component.css']
})
export class DrawerClosureComponent implements OnInit {

  current_step = "Arqueo"
  step = "1"
  closeResult: string;
  public formDrawer: FormGroup;
  public hasDrawerClosed = false;
  public blind_close = false;

  public drawer_id = 0;
  private centro = "";
  public id_estatus = 0;
  private caja = "";
  private drawerApertureData:any = "";
  private cash_total:number = 0;
  private manual_cash = 0;
  private t_bbva:number = 0;
  private t_banamex:number = 0;
  private t_hsbc:number = 0;
  private t_bbva_esperado:number = 0;
  private t_banamex_esperado:number = 0;
  private t_hsbc_esperado:number = 0;
  private username = ""
  private cash_expected = 0;
  private localAperture:any = "";
  today: number = Date.now();
  public salesMap:any;
  public sales:any;
  public salesTicket:any;
  public hasFinishClose = false;

  bills = [];

  cuentas = [
    {
      zuonr:"",
      kntobject:"",
      wtbtr:"",
    }
  ]

  constructor(private modalService: NgbModal,private drawerService: DrawerService, private saleService: SaleService , private _router: Router, private route: ActivatedRoute) {
    this.route
      .queryParams
      .subscribe(params => {
        if(params['drawer_id']){
          this.drawer_id = +params['drawer_id'] || 0;
          this.id_estatus = +params['id_estatus'] || 0;
          this.centro = params["centro"] || "";
          this.caja = params["caja"];
        }else{
          var localDrawer = JSON.parse(localStorage.getItem("currentDrawer"));
          this.drawer_id = localDrawer.id;
          this.id_estatus = localDrawer.id_estatus;
          this.centro = localDrawer.centro;
          this.caja = localDrawer.caja;
        }
        this.initializeForm();
        this.localAperture = JSON.parse(localStorage.getItem("currentDrawerAperture"));
        var localDrawer = JSON.parse(localStorage.getItem("currentDrawer"));
        this.hasDrawerClosed = localDrawer.estatus == "C";

      });
    
    //localStorage.removeItem("denominations");
    /*this.bills = JSON.parse(localStorage.getItem("denominations"))
    if(this.bills == undefined){
      this.getDenominations();
    }else{
      this.processDenominations();
    }*/
    this.getDenominations();
  }

  ngOnInit(): void {
    this.getSales();
    this.getSalesWithName()
    this.getSalesAmmout()
  }

  private getSales(){
    var filter = {
      centro:this.centro,
      id_apertura:this.id_estatus
    }
    this.saleService.getSalesOfAperture(filter).subscribe((responseSales: any) => {
      //this.sales = responseSales;
      //this.sales = this.groupBy(responseSales,responseSale => responseSale.payment_method_id);
      //console.log(this.sales);
      var salesTemp = [];
      responseSales.forEach(responseSale => {
        var temp = {
          id_venta: responseSale[0],
          fecha: responseSale[1],
          metodo_pago: responseSale[2],
          pago_sap_id: responseSale[3],
          importe: responseSale[4],
          bank_id: responseSale[5]

        }
        salesTemp.push(temp);  
      });
      this.sales = salesTemp;
      this.salesMap = this.groupBy(salesTemp,sale => sale.metodo_pago);

      var tempArr = [];
      tempArr = this.sales.filter(function( obj ) {
        return obj.bank_id == '1';
      });
      this.t_bbva_esperado = tempArr.length;
      tempArr = [];

      tempArr = this.sales.filter(function( obj ) {
        return obj.bank_id == '2';
      });
      this.t_banamex_esperado = tempArr.length;
      tempArr = [];

      tempArr = this.sales.filter(function( obj ) {
        return obj.bank_id == '3';
      });
      this.t_hsbc_esperado = tempArr.length;
      tempArr = [];

      var efectivoEsperado:number = 0;

      if(this.salesMap.get("01 Efectivo") != undefined){
        efectivoEsperado = this.salesMap.get("01 Efectivo").map(a => a.importe).reduce(function(a, b)
        {
          return a + b;
        });
      }

    this.cash_expected = efectivoEsperado + this.drawerApertureData.monto_apertura;

      console.log(this.salesMap);
      //console.log(this.sales.get("Efectivo")[0])
    },err => {
      console.log(err);
    });
  }

  private claveEfectivo = "";
  private claveBancomer = "";
  private claveBanamex = "";
  private claveHSBC = "";
  private claveSobrante = "";
  private claveFaltante = "";
  private processDenominations(){

    this.claveEfectivo = this.bills.find(bill => bill.descripcion === '1000').clave;
    this.claveBancomer = this.bills.find(bill => bill.descripcion === 'Transacción BBVA').clave;
    this.claveBanamex = this.bills.find(bill => bill.descripcion === 'Transacción CITIBANAMEX').clave;
    this.claveHSBC = this.bills.find(bill => bill.descripcion === 'Transacción HSBC').clave;
    this.claveSobrante = this.bills.find(bill => bill.descripcion === 'Sobrante').clave;
    this.claveFaltante = this.bills.find(bill => bill.descripcion === 'Faltante').clave;


    this.bills = this.bills.filter(function( obj ) {
      return obj.tipo !== 'C';
    });

    this.bills = this.bills.map((value) => {
      return {
        "id_apertura":this.id_estatus,
        "id_denominacion": value.id,
        "cantidad":0,
        "imagen":value.imagen,
        "valor":value.descripcion,
        "tipo":value.tipo,
        "clave":value.clave
      }
    })
  }

  public groupBy(list, keyGetter) {
    const map = new Map();
    list.forEach((item) => {
         const key = keyGetter(item);
         const collection = map.get(key);
         if (!collection) {
             map.set(key, [item]);
         } else {
             collection.push(item);
         }
    });
    return map;
}

  initializeForm(){
    let dateTime = new Date()
    var userName = localStorage.getItem('authUser');
		userName = userName ? JSON.parse(userName).username:'Anonimo';
    this.username = userName;
		this.formDrawer = new FormGroup({
      id_apertura: new FormControl(this.id_estatus),
			centro: new FormControl(this.centro),
			caja: new FormControl(this.caja),
      fecha: new FormControl(dateTime),
      monto: new FormControl('', [Validators.required]),
      estatus: new FormControl('P'),
      usuario: new FormControl(userName)
		});
	}

  open(content, type, modalDimension) {
    this.modalService.open(content, { windowClass: 'modal-danger', centered: true }).result.then((result) => {
      console.log(result)
  }, (reason) => {
      console.log(reason);
  });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
        return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
        return 'by clicking on a backdrop';
    } else {
        return  'with: $reason';
    }
  }

  private showConfirmation(confirmation){
    this.modalService.dismissAll();
    this.modalService.open(confirmation, { windowClass: 'modal-danger', centered: true }).result.then((result) => {
      console.log(result)
  }, (reason) => {
      console.log(reason);
  });
  }

  imprimir() {
    //window.print();
    var x = document.getElementById("ticket").outerHTML;
    console.log(x);
    printerjs({ printable: x, type: 'raw-html' });
  }

  public calculateTotalCash(index){
    this.bills[index].cantidad = (this.bills[index].cantidad < 0 || this.bills[index].cantidad == undefined) ? 0:this.bills[index].cantidad;
    var cash = this.bills.filter(bill => bill.tipo === 'E');
      var total_cash:number = 0;
      cash.forEach(item => {
        total_cash += item.valor * item.cantidad
      });

      this.cash_total = total_cash;
  }

  public calculateTotalTransacctions(value,index){
    this.bills[index].cantidad = (this.bills[index].cantidad < 0 || this.bills[index].cantidad == undefined)  ? 0:this.bills[index].cantidad;
    value = this.bills[index]; //value.cantidad >= 0 ? value.cantidad : 0;
    switch (value.valor) {
      case "Transacción CITIBANAMEX":
        this.t_banamex = value.cantidad;
        break;
      case "Transacción BBVA":
        this.t_bbva = value.cantidad;
        break;
      case "Transacción HSBC":
        this.t_hsbc = value.cantidad;
        break;
    }
  }

  private showDetail(){
    this.step = "2";
    this.current_step = "Validar caja";
    this.drawerService.setStep("2",this.drawer_id);
    this.modalService.dismissAll();
  }

  private backToCash(){
    this.step = "1";
    this.current_step = "Arqueo";
    this.drawerService.setStep("1",this.drawer_id);
    this.modalService.dismissAll();
  }

  private next(){

    this.drawerService.registerCash(this.bills).subscribe((resp: any) => {
      console.log("RESPONSE REGISTER CASH: ", resp);
      this.modalService.dismissAll();

      var cash = this.bills.filter(bill => bill.tipo === 'E');
      var total_cash:number = 0;
      cash.forEach(item => {
        total_cash += item.valor * item.cantidad
      });

      this.cash_total = total_cash;

      //this.drawerService.setCash(""+total_cash,this.drawer_id);
      //this.drawerService.setDrawerAperture(resp,this.drawer_id);
      this.drawerApertureData = resp;

      this.closeDrawerNM();

      }, err => { 
        this.modalService.dismissAll();
        console.error("Error: ", err); 
      });

  }

  
  private closeDrawerNM(){
    var diferencia = 0;
    let dateTime = new Date()
    var userName = localStorage.getItem('authUser');
		userName = userName ? JSON.parse(userName).username:'Anonimo';
    var efectivoEsperado:number = 0;

    if(this.salesMap.get("01 Efectivo") != undefined){
      efectivoEsperado = this.salesMap.get("01 Efectivo").map(a => a.importe).reduce(function(a, b)
      {
        return a + b;
      });
    }

    //this.cash_expected = efectivoEsperado;
    this.cash_expected = efectivoEsperado + this.drawerApertureData.monto_apertura;
    

    console.log(efectivoEsperado + this.drawerApertureData.monto_apertura);

    diferencia = this.cash_total - (efectivoEsperado + this.drawerApertureData.monto_apertura);
    var ventas = this.generateSaleClosureHead(diferencia);

    var statusCloseToSend = "P"
    if(this.sales.length == 0){
      statusCloseToSend = "C"
    }

    var close = {
      id_apertura: this.id_estatus,
			centro: this.centro,
      id_caja: this.drawer_id,
			caja: this.caja,
      fecha: dateTime,
      monto: this.cash_total,
      estatus: statusCloseToSend,
      usuario: userName,
      diferencia: this.cash_total - (efectivoEsperado + this.drawerApertureData.monto_apertura),
      datosVentas: ventas
		}

    var closeSendString = JSON.stringify(close);

    //close['cierre_obj'] = closeSendString;

    console.log("DRAWER CLOSURE PAYLOAD ",close);
    //console.log("DRAWER DATETIME ",dateTime.toISOString().split('T')[0]);
    this.drawerService.closeDrawer(close).subscribe((resp: any) => {
			console.log("RESPONSE DRAWER CLOSURE", resp);
      var current_drawer = JSON.parse(localStorage.getItem("currentDrawer"));
      current_drawer.estatus = "C";
      current_drawer.id_estatus = resp.id;
      if(this.blind_close){
        this.step = "2";
        this.current_step = "Validar caja";
      }
      this.drawerService.createLocalDrawer(current_drawer);
      //this._router.navigate(['dashboard']);
      this.hasFinishClose = true;

		}, err => { console.error("ERROR DRAWER CLOSURE", err); });
  }

  private generateSaleClosureHead(diferencia){
    var tempSales = [];
    var zuonrTmp = "";
    var kntobjectTmp = "";
    this.sales.forEach(sale => {

      zuonrTmp = "";
      kntobjectTmp = "";
      switch (sale.bank_id) {
        case 0:
          zuonrTmp = "DEPOSITO EN EFECTIVO",
          kntobjectTmp = this.claveEfectivo;
          break;
        case 1:
          zuonrTmp = "TC BBVA",
          kntobjectTmp = this.claveBancomer;
          break;
        case 2:
          zuonrTmp = "TC BANAMEX",
          kntobjectTmp = this.claveBanamex;
          break;
        case 3:
          zuonrTmp = "TC HSBC",
          kntobjectTmp = this.claveHSBC;
          break;
      }

      var temp = {
        zuonr: zuonrTmp,
        kntobject: kntobjectTmp,
        wrbtr: sale.importe
      }
      tempSales.push(temp);
    });

    if(diferencia != 0){
      if(diferencia > 0){
        zuonrTmp = "SOBRANTE",
        kntobjectTmp = this.claveSobrante;
      }else{
        zuonrTmp = "FALTANTE",
        kntobjectTmp = this.claveFaltante;
      }

      var temp = {
        zuonr: zuonrTmp,
        kntobject: kntobjectTmp,
        wrbtr: diferencia
      }
      tempSales.push(temp);
      
    }
    

    return tempSales;
  }

  public goToDashboard(){
    this._router.navigate(['dashboard']);
  }

  private closeDrawer( modal ){
    let dateTime = new Date()
    var userName = localStorage.getItem('authUser');
		userName = userName ? JSON.parse(userName).user:'Anonimo';
    var close = {
      id_apertura: this.id_estatus,
			centro: this.centro,
      id_caja: this.drawer_id,
			caja: this.caja,
      fecha: dateTime,
      monto: this.cash_total,
      estatus: "P",
      usuario: userName,
      diferencia: this.cash_total - 30000
		}

    this.drawerService.closeDrawer(close).subscribe((resp: any) => {
			console.log("RESPONSE: ", resp);
      var drawers = JSON.parse(localStorage.getItem("localDrawers"))
      drawers.find(drawer => drawer.id == this.drawer_id).estatus = "C"
      drawers.find(drawer => drawer.id == this.drawer_id).id_estatus = resp.id
      this.drawerService.setLocalDrawers(drawers);
      this._router.navigate(['dashboard']);

      //localStorage.removeItem("cash_"+this.drawer_id);
      //localStorage.removeItem("current_step_"+this.drawer_id);
      
      this.modalService.open(modal, { centered: true }).result.then((result) => {
        console.log(result)
      }, (reason) => {
        console.log(reason);
      });

		}, err => { console.error("Error: ", err); });
  }

  private getDenominations(){
    this.drawerService.getDenominations().subscribe((resp: any) => {
			console.log("Success: ", resp);
      this.bills = resp;
      this.drawerService.createLocalDenominations(resp);
      this.processDenominations();
		}, err => { 
      console.error("Error: ", err); 
      this.bills = JSON.parse(localStorage.getItem("denominations"));
      this.processDenominations();
    });
  }

  public total_amount_sales = 0;
  public getSalesWithName(){
    var body = {
      centro:this.centro,
      apertura:this.id_estatus,
      vendedor: "",
      ticket: "",
      fecha: ""
    }
    console.log("OBTENER VENTAS CON FILTROS ", body);
    this.saleService.getSalesWithFilter(body).subscribe((responseSales: any) => {
      console.log("EXITO OBTENER VENTAS CON FILTROS");
      var salesTemp = [];
      responseSales.forEach(responseSale => {
        var temp = {
          fecha: responseSale[0],
          ticket: responseSale[1],
          vendedor: responseSale[2],
          cantidad: responseSale[3],
          importe: responseSale[4],
          material: responseSale[5],
          nombre: responseSale[6]
        }
        salesTemp.push(temp);  
        this.total_amount_sales += responseSale[4];
      });
      this.salesTicket = salesTemp;
      console.log("SALE TICKETS",this.salesTicket)
    },err => {
      console.log("ERROR OBTENER VENTAS CON FILTRO",err);
    });
  }

  public salesTable = [];
  private getSalesAmmout(){
    var filter = {
      centro:this.centro,
      id_apertura:this.id_estatus
    }
    console.log("OBTENER VENTAS METODO DE PAGO PAYLOAD",filter);
    this.saleService.getSalesOfAperture(filter).subscribe((responseSales: any) => {
      var salesTemp = [];
      responseSales.forEach(responseSale => {
        var temp = {
          id_venta: responseSale[0],
          fecha: responseSale[1],
          metodo_pago: responseSale[2],
          pago_sap_id: responseSale[3],
          importe: responseSale[4],
          bank_id: responseSale[5]

        }
        
        salesTemp.push(temp);  
      });

      var salesGrouped = this.groupBy(salesTemp,sale => sale.metodo_pago);
      //console.log(salesGrouped);

      
      salesGrouped.forEach((mapa:any,key) => {
        console.log(mapa);
        var totalSale = 0;
        /*mapa.forEach(element => {
          totalSale += element.importe;
        });*/
        totalSale = mapa.map(a => a.importe).reduce(function(a, b){
          return a + b;
        });
        var temp = {
          importe: totalSale,
          metodo: key
        }
        this.salesTable.push(temp);
      })

      //console.log(this.salesTable);

    },err => {
      console.log(err);
    });
  }

}
