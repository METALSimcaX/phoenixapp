import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DrawerService } from 'src/app/services/drawer.service';
import { Router,ActivatedRoute } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-drawer-operture',
  templateUrl: './drawer-operture.component.html',
  styleUrls: ['./drawer-operture.component.css']
})
export class DrawerOpertureComponent implements OnInit {

  cash = 0;
  public formDrawer: FormGroup;
  public hasDrawerOpen = false;
  private drawer_id = 0;
  private drawer_number = 0;
  private centro = "";

  constructor(private drawerService: DrawerService, private _router: Router, private route: ActivatedRoute,private modalService: NgbModal) { 
    this.route
      .queryParams
      .subscribe(params => {
        if(params['drawer_id']){
          // Defaults to 0 if no query param provided.
          this.drawer_id = +params['drawer_id'];
          this.centro = params["centro"];
        }else{
          var localDrawer = JSON.parse(localStorage.getItem("currentDrawer"));
          this.drawer_id = localDrawer.id;
          this.drawer_number = localDrawer.caja;
          this.centro = localDrawer.centro;
        }
        
        var localDrawer = JSON.parse(localStorage.getItem("currentDrawer"));
        this.hasDrawerOpen = localDrawer.estatus == "A";
        console.log(localDrawer)
        console.log(this.hasDrawerOpen)
        this.initializeForm();
      });
  }

  ngOnInit(): void {}

  initializeForm(){
    let dateTime = new Date()
    var userName = localStorage.getItem('authUser');
		userName = userName ? JSON.parse(userName).username:'Anonimo';
    console.log(">", userName)
		this.formDrawer = new FormGroup({
      id_caja: new FormControl(this.drawer_id),
			centro: new FormControl(this.centro),
			caja: new FormControl(this.drawer_number),
      fecha: new FormControl(dateTime),
      monto_apertura: new FormControl('', [Validators.required]),
      usuario: new FormControl(userName)
		});
	}


  public openDrawer(modal){
    let dateTime = new Date()
    let dataForm = this.formDrawer.value;
    console.log("OPEN DRAWER PAYLOAD ", dataForm);
		this.drawerService.openDrawer(dataForm).subscribe((resp: any) => {
      console.log("RESPONSE OPEN DRAWER",resp);
      /*var drawers = JSON.parse(localStorage.getItem("localDrawers"))
      drawers.find(drawer => drawer.id == this.drawer_id).estatus = "A"
      drawers.find(drawer => drawer.id == this.drawer_id).id_estatus = resp.id
      this.drawerService.setLocalDrawers(drawers);*/

      var current_drawer = JSON.parse(localStorage.getItem("currentDrawer"));
      current_drawer.estatus = "A";
      current_drawer.id_estatus = resp.id;

      this.drawerService.createLocalDrawer(current_drawer);
      this.drawerService.createLocalAperture(resp);

			this._router.navigate(['dashboard']);

      this.modalService.open(modal, { centered: true }).result.then((result) => {
        console.log(result)
      }, (reason) => {
        console.log(reason);
      });

		}, err => { console.error("ERROR OPEN DRAWER", err); });
  }

}
