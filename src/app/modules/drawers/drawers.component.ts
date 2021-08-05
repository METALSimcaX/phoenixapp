import { Component, OnInit } from '@angular/core';
import { DrawerService } from 'src/app/services/drawer.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-drawers',
  templateUrl: './drawers.component.html',
  styleUrls: ['./drawers.component.css']
})
export class DrawersComponent implements OnInit {

  drawers = [];

  constructor(private drawerService: DrawerService, private _router: Router) {
    this.drawers = JSON.parse(localStorage.getItem("localDrawers"))
    console.log(this.drawers);
  }

  private getStatus(status){
    switch (status) {
      case "C":
        return "CERRADA"
      case "A":
        return "ABIERTA"
    }
  }

  private getType(type){
    switch (type) {
      case "P":
        return "PRINCIPAL"
      case "B":
        return "BASICA"
    }
  }

  private closeDrawer(drawer_id,centro,id_estatus,caja){
    this._router.navigate(['drawerClosure'],{ queryParams: { drawer_id: drawer_id, centro: centro, id_estatus:id_estatus,caja:caja}})
  }

  private openDrawer(drawer_id,centro){
    this._router.navigate(['drawerOperture'],{ queryParams: { drawer_id: drawer_id, centro: centro}})
  }

  newDrawer(){
    var mainDrawer = this.drawers[0];
    //var lastDrawer = this.drawers[this.drawers.length-1]
		var newDrawer = {
      "centro":mainDrawer.centro,
      "caja":this.drawers.length + 1,
      "tipo":"B",
      "estatus":"C"
    }
    console.log(newDrawer)
    this.drawerService.createDrawer(newDrawer).subscribe((response:any) => {
      console.log(response)
      this.drawers.push(response);
      this.drawerService.setLocalDrawers(this.drawers);
    })
	}

  ngOnInit(): void {
  }

}
