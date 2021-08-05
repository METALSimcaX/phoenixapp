import { Component, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { DrawerService } from 'src/app/services/drawer.service';
import { SaleService } from 'src/app/services/sale.service';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import swal from "sweetalert2";
import { DatePipe } from '@angular/common';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-deposit',
  templateUrl: './deposit.component.html',
  styleUrls: ['./deposit.component.css']
})
export class DepositComponent implements OnInit {

  drawers = [];
  drawersClosed = [];
  closuresToDeliver = [];
  banks = [];
  bills = [];
  public fecha_apertura;
  public invalid = true;
  public noClosures = true;
  public completed = true;
  public folio = ""
  public bank_selected:any;
  public formDeposit: FormGroup;
  public monto_total:number = 0;
  public diferencia_total:number = 0;
  private id_apertura = 0;
  private centro = "";
  private id_drawer = 0;
  public salesMap:any;
  public sales:any = [];
  public fecha_deposito;
  private has_difference = false;

  constructor(
    private modalService: NgbModal,
    private drawerService: DrawerService, 
    private _router: Router, 
    private saleService: SaleService, 
    private datepipe: DatePipe,
    private _spinnerService: NgxSpinnerService) {
    
  }

  ngOnInit(): void {
    var localDrawer = JSON.parse(localStorage.getItem("currentDrawer"));
    this.centro = localDrawer.centro;
    this.id_drawer = localDrawer.id;
    this.getDrawers(localDrawer.centro);
    //this.getDrawersClosed(localDrawer.centro);
    //this.getDrawers(localDrawer.centro,localDrawer.id);
    this.getBanks();
    this.getDenominations();
  }


  closuresMap:any = [];
  private getDrawersClosed(centro,openDrawers){
    this.drawerService.getDrawersClosed(centro).subscribe((resp:any) => {
      this.drawersClosed = resp;
      this.noClosures = this.drawersClosed.length == 0;
      this.drawersClosed.forEach(closure => {
        closure["estatus_drawer"] = "C" //this.drawers.find(x => x.caja == closure.caja).estatus;
        closure["delivery"] = true;
        closure.fecha_apertura = new Date(closure.fecha_apertura).toDateString();//.toLocaleDateString();//.toISOString().split('T')[0]
        console.log("closure.fecha_apertura:", closure.fecha_apertura);
        //this.getSales(closure.centro,closure.id_apertura);
      });

      var today = new Date()
      openDrawers.forEach(drawer => {
        console.log("---->",drawer);
        this.drawersClosed.push({
          fecha: today,
          fecha_apertura: new Date(today).toDateString(),//.toLocaleDateString(),//.toISOString().split('T')[0],
          caja: drawer.caja,
          estatus_drawer: drawer.estatus,
          delivery: false
        });
      });

      console.log("drawersClosed:",this.drawersClosed);
      this.drawersClosed.sort((a,b) => (new Date(a.fecha_apertura) > new Date(b.fecha_apertura)) ? 1 : ((new Date(b.fecha_apertura) > new Date(a.fecha_apertura)) ? -1 : 0));

      this.closuresMap = this.groupBy(this.drawersClosed,closure => closure.fecha_apertura);

      console.log("closuresMap:",this.closuresMap);
      //this.closuresMap = this.groupBy(this.drawersClosed,closure => closure.fecha);
    })
  }

  private getDrawers(centro){
		this.drawerService.getDrawersMonto(centro).subscribe((resp: any) => {
			//this.drawerService.setLocalDrawers(resp);
      this.drawers = resp;
      
      console.log("RESPONSE GET DRAWERS CENTER", resp);

      var openDrawers = this.drawers.filter(
        drawer => drawer.estatus == 'A'
      );
      this.invalid = openDrawers.length > 0

      this.getDrawersClosed(centro,openDrawers);

		}, err => { console.error("Error: ", err); });
	}

  getBanks(){
    this.drawerService.getBanks().subscribe((response:any) => {
      this.banks = response;
    })
  }
  
  private getStatus(status){
    switch (status) {
      case "C":
        return "CERRADA"
      case "A":
        return "ABIERTA"
    }
  }

  private getStatusCierre(status){
    switch (status) {
      case "C":
        return "ENTREGADO"
      case "P":
        return "PENDIENTE"
    }
  }

  private getStatusDrawer(drawer){
    return this.drawers.find(x => x.caja == drawer).estatus;
  }

  private getType(type){
    switch (type) {
      case "P":
        return "PRINCIPAL"
      case "B":
        return "BASICA"
    }
  }

  allClosed(closures){
    var temp = closures.filter(
      drawer => drawer.estatus_drawer == 'A'
    )
    return temp.length == 0;
  }

  toogleDeliver(closure){
    this._spinnerService.show();
    if(this.closuresToDeliver.includes(closure)){
      this.closuresToDeliver.splice(this.closuresToDeliver.indexOf(closure),1);
    }else{
      this.closuresToDeliver.push(closure);
    }
    this.sales = []; this.monto_total = 0;
    this.closuresToDeliver.sort((a,b) => (new Date(a[0].fecha_apertura) < new Date(b[0].fecha_apertura)) ? 1 : ((new Date(b[0].fecha_apertura) < new Date(a[0].fecha_apertura)) ? -1 : 0));
    if (this.closuresToDeliver.length > 0){
      this.fecha_apertura = this.closuresToDeliver[0][0].fecha_apertura;
    }
    this.closuresToDeliver.forEach(day => {
      day.forEach(closure => {
        console.log("String:", closure.fecha_apertura);
        console.log("Date:", new Date(closure.fecha_apertura));
        this.monto_total += closure.monto; //Monto de cierre para el total
        this.getSales(closure.centro,closure.id_apertura);
      });
    });

    this._spinnerService.hide();
  }

  askDeposit(content, type){
    this.modalService.open(content, { windowClass: type, centered: true }).result.then((result) => {
      
  }, (reason) => {
      
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

  private finishDeposit(){
    let dateTime = new Date()
    var ids = [];
    var userName = localStorage.getItem('authUser');
    var monto_total = 0;
    var diferencia_total = 0;
		userName = userName ? JSON.parse(userName).username:'Anonimo';

    /*this.drawersClosed = this.drawersClosed.filter(function( obj ) {
      return obj.monto != undefined && obj.estatus != undefined;
    });

    this.drawersClosed.forEach(drawer => {
      ids.push(drawer.id)
      monto_total += drawer.monto;
      diferencia_total += drawer.diferencia;
    });*/

    this.closuresToDeliver.forEach(day => {
      day.forEach(drawer => {
        ids.push(drawer.id)
        monto_total += drawer.monto;
        diferencia_total += drawer.diferencia;
      });
    });

    var diferencia:number = diferencia_total;
    var ventas = this.generateSaleClosureHead(diferencia, monto_total);

    var deposit = {
      fecha: new Date(this.fecha_deposito + "GMT-5:00"), 
      fecha_apertura: new Date(this.fecha_apertura + "GMT-5:00"),
      id_banco: this.bank_selected,
      usuario: userName,
      folio: this.folio,
      ids_cierre: ids,
      monto: monto_total,
      id_apertura: this.id_apertura,
      centro: this.centro,
      datosVentas: ventas,
      id_caja: this.id_drawer
    }

    /*if(this.has_difference){
      var profit_center = localStorage.getItem("profit_center");
      if(profit_center != undefined){
        deposit["profit"] = profit_center
      }else{
        deposit["profit"] = ""
      }
      
    }*/

    console.log("DEPOSIT PAYLOAD ",deposit);

    this.drawerService.registerDeposit(deposit).subscribe((response:any) => {
      this.modalService.dismissAll();
      this.invalid = true;
      this._router.navigate(['dashboard']);
      swal.fire({
				icon: 'success',
				title: 'Deposito registrado exitosamente',	
			})
      console.log("DEPOSIT SUCCESS");
    },(err)=>{
      swal.fire({
				icon: 'error',
				title: 'Ocurrió un error al realizar el depósito',
        text: "Intenta más tarde, si el error persiste contacta con tu gerente de zona."	
			})
      console.log("ERROR DEPOSIT",err)
    })

    this.modalService.dismissAll()
  }

  private getDrawers2(centro){
		this.drawerService.getDrawersClosed(centro).subscribe((resp: any) => {
			//var drawers:any = resp;
			//this.drawers = resp.filter(drawer => drawer.estatus === 'C');
      this.drawers = resp;
      console.log(resp);
		}, err => { console.error("Error: ", err); });
	}

  private getDenominations(){
    this.drawerService.getDenominations().subscribe((resp: any) => {
      this.bills = resp;
      this.drawerService.createLocalDenominations(resp);
      this.processDenominations();
		}, err => { 
      this.bills = JSON.parse(localStorage.getItem("denominations"));
      this.processDenominations();
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

    this.bills = this.bills.map((value) => {
      return {
        "id_apertura":this.id_apertura,
        "id_denominacion": value.id,
        "cantidad":0,
        "imagen":value.imagen,
        "valor":value.descripcion,
        "tipo":value.tipo,
        "clave":value.clave
      }
    })
  }

  private getSales(centro,apertura){
    var filter = {
      centro:centro,
      id_apertura:apertura
    }
    this.id_apertura = apertura;
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
        /*if(temp.metodo_pago == "01 Efectivo"){
          this.monto_total += temp.importe;
        }*/
        salesTemp.push(temp);  
      });
      /*if(salesTemp.length == 0){
        var date = this.datepipe.transform(new Date, 'dd/MM/yyyy')
        this.fecha_apertura = date;
      }else{
        this.fecha_apertura = salesTemp[0].fecha;
      }*/
      salesTemp = salesTemp.filter(function( obj ) {
        return obj.metodo_pago != undefined;
      })
      this.sales = this.sales.concat(salesTemp);
      console.log("VENTAS CENTRO: " + filter.centro + " APERTURA: " + filter.id_apertura, salesTemp)
    },err => {
      console.log(err);
    });
  }


  private generateSaleClosureHead(diferencia, lv_montototal){
    var tempSales = [];
    var sumSales = [];
    var zuonrTmp = "";
    var kntobjectTmp = "";
    var bank = this.banks.find(x => x.id == this.bank_selected);

    this.sales.forEach(sale => {

      zuonrTmp = "";
      kntobjectTmp = "";
      switch (sale.bank_id) {
        case 0:
          zuonrTmp = "DEPOSITO EN EFECTIVO",
          kntobjectTmp = bank.cuenta_sap; //this.claveEfectivo;
          return;
          //break;
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
        wrbtr: sale.importe,
        kostl: ""
      }
      tempSales.push(temp);
    });

    if(diferencia != 0){
      var profit_center = (localStorage.getItem("profit_center") != undefined)?localStorage.getItem("profit_center"):"";

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
        wrbtr: diferencia,
        kostl: profit_center
      }
      tempSales.push(temp);
      this.has_difference = true;
    }

    if(lv_montototal > 0){
      var tempm = {
        zuonr: "DEPOSITO EN EFECTIVO",
        kntobject: bank.cuenta_sap,
        wrbtr: lv_montototal,
        kostl: ""
      }
      tempSales.push(tempm);
    }

    //Agrupación por via de pago
    tempSales.reduce(function(res, value) {
      if (!res[value.zuonr]) {
        res[value.zuonr] = { zuonr: value.zuonr, kntobject: value.kntobject, kostl:value.kostl, wrbtr: 0 };
        sumSales.push(res[value.zuonr])
      }
      res[value.zuonr].wrbtr += value.wrbtr;
      return res;
    }, {})

    return sumSales;
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

  asIsOrder(a, b) {
    return 1;
  }

}
