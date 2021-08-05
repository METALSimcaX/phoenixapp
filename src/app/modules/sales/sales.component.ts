import { Component, OnInit } from '@angular/core';
import { SaleService } from '../../services/sale.service'

@Component({
  selector: 'app-sales',
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.css']
})
export class SalesComponent implements OnInit {

  isCollapsed = true;

  sales = [];
  salesMap:any;
  private tickets: any = [];
  public ticketSearch = "";
  public sellerSearch = "";
  public dateSearch = "";
  public showFilter = false;

  filter = {
    centro: "",
    apertura: "",
    vendedor: "",
    ticket: "",
    fecha: ""
  }

  constructor(private saleService: SaleService) { }

  ngOnInit(): void {
    var localDrawer = JSON.parse(localStorage.getItem("currentDrawer"));
    this.filter.centro = localDrawer.centro;
    var apertureId = "";
    if(localDrawer.estatus == "A"){
      apertureId = localDrawer.id_estatus;
    }else{
      var localDrawerAperture = JSON.parse(localStorage.getItem("currentDrawerAperture"));
      if(localDrawerAperture != undefined){
        apertureId = localDrawerAperture.id
      }else{
        apertureId = "0"
      }
    }
    this.filter.apertura = apertureId;
    this.getSales();
  }

  public getSales(){
    console.log("OBTENER VENTAS CON FILTROS ", this.filter);
    this.saleService.getSalesWithFilter(this.filter).subscribe((responseSales: any) => {
      console.log("EXITO OBTENER VENTAS CON FILTROS");
      var salesTemp = [];
      responseSales.forEach(responseSale => {
        var temp = {
          fecha: responseSale[0],
          ticket: responseSale[1],
          vendedor: responseSale[2],
          cantidad: responseSale[3],
          importe: responseSale[4],
          material: parseInt(responseSale[5],10),
          nombre: responseSale[6]
        }
        salesTemp.push(temp);  
      });
      var salesMap = this.groupBy(salesTemp,sale => sale.ticket);
      console.log(salesMap);
      this.salesMap = salesMap;
      //this.sales = salesTemp;
    },err => {
      console.log("ERROR OBTENER VENTAS CON FILTRO",err);
    });
  }

  private sumQuantity(sales){
    let sum: number = sales.map(a => a.cantidad).reduce(function(a, b)
    {
      return a+ b;
    });
    return sum;
  }

  
  private sumAmount(sales){
    let sum: number = sales.map(a => a.importe).reduce(function(a, b)
    {
      return a + b;
    });
    return sum;
  }

  private toogleTicket(ticket){
    if(this.tickets.includes(ticket)){
      this.tickets.splice(this.tickets.indexOf(ticket),1);
    }else{
      this.tickets.push(ticket);
    }
  }

  private isShowing(ticket){
    return this.tickets.includes(ticket);
  }

  private applyFilters(){
    this.filter.fecha = this.dateSearch;
    this.filter.ticket = this.ticketSearch;
    this.filter.vendedor = this.sellerSearch;
    this.getSales();
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

}
