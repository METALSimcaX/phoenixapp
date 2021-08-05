import swal from "sweetalert2";
import { Component, OnInit, HostListener, ElementRef } from '@angular/core';
import { CatalogsService } from 'src/app/services/catalogs.service';
import { DrawerService } from 'src/app/services/drawer.service';
import { AuthService } from "src/app/services/auth.service";

declare var require: any;

@Component({
	selector: 'app-dashboard',
  	templateUrl: './dashboard.component.html',
  	styleUrls: ['./dashboard.component.css'] 
})
export class DashboardComponent implements OnInit
{
	selectedSalesman: any;
	isMobileResolution: boolean;

	constructor(private drawerService: DrawerService, private catalogService: CatalogsService, private _authService: AuthService)
	{
		this.selectedSalesman = null;

		if (window.innerWidth < 1200) {
			this.isMobileResolution = true;
		} else {
			this.isMobileResolution = false;
		}
		
		var centro_c = localStorage.getItem("config_centro");
		var caja_c = localStorage.getItem("config_caja");
		this.drawerService.setCenter(centro_c);
		
		if(localStorage.getItem("currentDrawer") == undefined){
			this.createDrawer(centro_c,caja_c);
		}
		if(localStorage.getItem("profit_center") == undefined){
			this.getCenterData(centro_c);
		}
	}

	async ngOnInit() 
	{}

	@HostListener("window:resize", ["$event"])
	isMobile(event) {
		if (window.innerWidth < 1200) {
			this.isMobileResolution = true;
		} else {
			this.isMobileResolution = false;
		}
	}

  	private getCenterData(centro){
		this.catalogService.getCenterName(centro).subscribe((response:any) => {
			console.log("RESPONSE PROFIT",response);
			localStorage.setItem("profit_center",response.data.profitCenter);
		})
	}

	private createDrawer(centro,caja){
		var tipo = caja == "1" ? "P" : "B";
		var newDrawer = {
			"centro":centro,
			"caja":caja,
			"tipo":tipo,
			"estatus":"C"
		}
		console.log("CREACION DE CAJA PAYLOAD", newDrawer)
		this.drawerService.createDrawer(newDrawer).subscribe((response:any) => {
			console.log("RESPUESTA CREACION DE CAJA",response)
			this.drawerService.createLocalDrawer(response);
			//this.drawerService.setLocalDrawers(drawers);
		})
	}

	private getDrawers(centro,caja){
		this.drawerService.getDrawers(centro).subscribe((resp: any) => {
			var drawers:any = resp;
			if(drawers.length == 0){
				console.log("vacio");
				var newDrawer = {
					"centro":centro,
					"caja":caja,
					"tipo":"P",
					"estatus":"C"
				}
				this.drawerService.createDrawer(newDrawer).subscribe((response:any) => {
					console.log(response)
					var drawers = []
					drawers.push(response);
					this.drawerService.setLocalDrawers(drawers);
				})
			}else{
				this.drawerService.setLocalDrawers(resp);
			}
		}, err => { console.error("Error: ", err); });
	}

	eventoTest(e)
	{
		console.log("evento", e);
	}

}
