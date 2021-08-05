import { DrawerService } from 'src/app/services/drawer.service';
import { RouteInfo } from '../../interfaces/route-info.interface';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

var misc: any = { sidebar_mini_active: true };

@Component({
   selector: 'app-sidemenu',
   templateUrl: './sidemenu.component.html',
   styleUrls: ['./sidemenu.component.css']
})
export class SidemenuComponent implements OnInit
{
   public menuItems: any[];
   public isCollapsed = true;

   public menuList: RouteInfo[] = [
      { path: '/dashboard', title: 'Dashboard', type: 'link', icontype: 'ni ni-chart-bar-32 text-red' },
      {
         path: "city",
         title: "Mérida",
         type: "sub",
         icontype: "ni-shop text-primary",
         isCollapsed: true,
         children: [
            { path: 'dashboard', title: 'Dashboard', type: 'link'},
            { path: "servicios", title: "Punto de Venta", type: "link"},
            { path: "drawerOperture", title: "Abrir caja", type: "link"},
            { path: "drawerClosure", title: "Cerrar caja", type: "link"},
            { path: "deposit", title: "Registrar deposito", type: "link"},
            { path: "sales", title: "Registro de ventas", type: "link" },
            //{ path: "pendings", title: "Venta sin procesar", type: "link" }
         ]
       },
       {
         path: "#",
         title: "Viaticos",
         type: "sub",
         icontype: "ni-bus-front-12 text-green",
         isCollapsed: true,
         children: [
            { path: '#', title: 'Dashboard', type: 'link'},
            { path: '#', title: 'Mis viajes', type: 'link'}
         ]
       },
       {
         path: "#",
         title: "Pedidos",
         type: "sub",
         icontype: "ni-box-2 text-red",
         isCollapsed: true,
         children: [
            { path: '#', title: 'Dashboard', type: 'link'},
            { path: '#', title: 'Mis solicitudes', type: 'link'}
         ]
       },
       {
         path: "#",
         title: "Mercancía",
         type: "sub",
         icontype: "ni-app text-yellow",
         isCollapsed: true,
         children: [
            { path: '#', title: 'Dashboard', type: 'link'},
            { path: '#', title: 'Recepcionar', type: 'link'},
            { path: '#', title: 'Envíar', type: 'link'}
         ]
       },
       {
         path: "#",
         title: "Inventario",
         type: "sub",
         icontype: "ni-single-copy-04 text-orange",
         isCollapsed: true,
         children: [
            { path: '#', title: 'Dashboard', type: 'link'},
            { path: '#', title: 'Mis inventarios', type: 'link'}
         ]
       }
      /* 
      { path: '/dashboard', title: 'Dashboard', type: 'link', icontype: 'ni ni-chart-bar-32 text-red' },
      { path: "/viaticos", title: "Viaticos", type: "link", icontype: "ni-bus-front-12 text-green" },
      { path: "/servicios", title: "Punto de Venta", type: "link", icontype: "ni-money-coins text-primary" },
      { path: "/drawerOperture", title: "Abrir caja", type: "link", icontype: "ni-shop text-yellow" },
      { path: "/drawerClosure", title: "Cerrar caja", type: "link", icontype: "ni-shop text-yellow" },
      { path: "/deposit", title: "Registrar deposito", type: "link", icontype: "ni-briefcase-24 text-brown" },
      //{ path: "/sales", title: "Registro de ventas", type: "link", icontype: "ni-book-bookmark text-orange" },
      { path: "/settings", title: "Configuraciones", type: "link", icontype: "ni-ui-04 text-brown" }
      */
   ];
    
   constructor(private _router: Router, private _drawerService: DrawerService, private _authService: AuthService)
   {}

   ngOnInit()
   {
      if(this._authService.isAuthorizeUser())
      {
         this.menuList[1].children.push({ path: "pendings", title: "Venta sin procesar", type: "link" });
      }

      this.menuItems = this.menuList.filter(menuItem => menuItem);
      this._router.events.subscribe(event => { this.isCollapsed = true; });
   }

   onApertureOpen(): boolean
   {
      return this._drawerService.existAperture();
   }

   onMouseEnterSidenav()
   {
      if (!document.body.classList.contains("g-sidenav-pinned")) {
         document.body.classList.add("g-sidenav-show");
      }
   }

   onMouseLeaveSidenav()
   {
      if (!document.body.classList.contains("g-sidenav-pinned")) {
         document.body.classList.remove("g-sidenav-show");
      }
   }

   minimizeSidebar()
   {
      const sidenavToggler = document.getElementsByClassName("sidenav-toggler")[0];
      const body = document.getElementsByTagName("body")[0];
      
      if (body.classList.contains("g-sidenav-pinned")) {
         misc.sidebar_mini_active = true;
      } else {
         misc.sidebar_mini_active = false;
      }
      if (misc.sidebar_mini_active === true) {
         body.classList.remove("g-sidenav-pinned");
         body.classList.add("g-sidenav-hidden");
         sidenavToggler.classList.remove("active");
         misc.sidebar_mini_active = false;
      } else {
         body.classList.add("g-sidenav-pinned");
         body.classList.remove("g-sidenav-hidden");
         sidenavToggler.classList.add("active");
         misc.sidebar_mini_active = true;
      }
   }
}
