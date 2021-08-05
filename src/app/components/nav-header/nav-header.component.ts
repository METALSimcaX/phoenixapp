import { AuthService } from './../../services/auth.service';
import { RouteInfo } from '../../interfaces/route-info.interface';
import { Location } from '@angular/common';
import { Component, ElementRef, OnInit } from '@angular/core';
import { NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { SalesmanService } from 'src/app/services/salesman.service';

@Component({
	selector: 'app-nav-header',
	templateUrl: './nav-header.component.html',
	styleUrls: ['./nav-header.component.css']
})
export class NavHeaderComponent implements OnInit
{
	public focus;
	public userName: string = '';
	public listTitles: any[];
	public location: Location;
	sidenavOpen: boolean = true;
	public ROUTES: RouteInfo[] = [
		{
		  path: "/dashboards",
		  title: "Dashboards",
		  type: "sub",
		  icontype: "ni-shop text-primary",
		  isCollapsed: true,
		  children: [
			 { path: "dashboard", title: "Dashboard", type: "link" },
			 { path: "alternative", title: "Alternative", type: "link" }
		  ]
		},
		{
		  path: "/examples",
		  title: "Examples",
		  type: "sub",
		  icontype: "ni-ungroup text-orange",
		  collapse: "examples",
		  isCollapsed: true,
		  children: [
			 { path: "pricing", title: "Pricing", type: "link" },
			 { path: "login", title: "Login", type: "link" },
			 { path: "register", title: "Register", type: "link" },
			 { path: "lock", title: "Lock", type: "link" },
			 { path: "timeline", title: "Timeline", type: "link" },
			 { path: "profile", title: "Profile", type: "link" }
		  ]
		},
		{
		  path: "/components",
		  title: "Components",
		  type: "sub",
		  icontype: "ni-ui-04 text-info",
		  collapse: "components",
		  isCollapsed: true,
		  children: [
			 { path: "buttons", title: "Buttons", type: "link" },
			 { path: "cards", title: "Cards", type: "link" },
			 { path: "grid", title: "Grid", type: "link" },
			 { path: "notifications", title: "Notifications", type: "link" },
			 { path: "icons", title: "Icons", type: "link" },
			 { path: "typography", title: "Typography", type: "link" },
			 {
				path: "multilevel",
				isCollapsed: true,
				title: "Multilevel",
				type: "sub",
				collapse: "multilevel",
				children: [
				  { title: "Third level menu" },
				  { title: "Just another link" },
				  { title: "One last link" }
				]
			 }
		  ]
		},
		{
		  path: "/forms",
		  title: "Forms",
		  type: "sub",
		  icontype: "ni-single-copy-04 text-pink",
		  collapse: "forms",
		  isCollapsed: true,
		  children: [
			 { path: "elements", title: "Elements", type: "link" },
			 { path: "components", title: "Components", type: "link" },
			 { path: "validation", title: "Validation", type: "link" }
		  ]
		},
		{
		  path: "/tables",
		  title: "Tables",
		  type: "sub",
		  icontype: "ni-align-left-2 text-default",
		  collapse: "tables",
		  isCollapsed: true,
		  children: [
			 { path: "tables", title: "Tables", type: "link" },
			 { path: "sortable", title: "Sortable", type: "link" },
			 { path: "ngx-datatable", title: "Ngx Datatable", type: "link" }
		  ]
		},
		{
		  path: "/maps",
		  title: "Maps",
		  type: "sub",
		  icontype: "ni-map-big text-primary",
		  collapse: "maps",
		  isCollapsed: true,
		  children: [
			 { path: "google", title: "Google Maps", type: "link" },
			 { path: "vector", title: "Vector Map", type: "link" }
		  ]
		},
		{
		  path: "/widgets",
		  title: "Widgets",
		  type: "link",
		  icontype: "ni-archive-2 text-green"
		},
		{
		  path: "/charts",
		  title: "Charts",
		  type: "link",
		  icontype: "ni-chart-pie-35 text-info"
		},
		{
		  path: "/calendar",
		  title: "Calendar",
		  type: "link",
		  icontype: "ni-calendar-grid-58 text-red"
		}
	];

	constructor(location: Location, private _salesmanService: SalesmanService, private _router: Router, private _authService: AuthService, private _spinnerService: NgxSpinnerService)
	{
		this.location = location;
		this.userName = '';
		this._router.events.subscribe((event: any) => {
			if (event instanceof NavigationStart) {
				// Show loading indicator

			}
			if (event instanceof NavigationEnd) {
				// Hide loading indicator

				if (window.innerWidth < 1200) {
					document.body.classList.remove("g-sidenav-pinned");
					document.body.classList.add("g-sidenav-hidden");
					this.sidenavOpen = false;
				}
			}

			if (event instanceof NavigationError) {
				// Hide loading indicator

				// Present error to user
				console.log(event.error);
			}
		});
	}

	ngOnInit()
	{
		this._spinnerService.hide();
		this.listTitles = this.ROUTES.filter(listTitle => listTitle);
	}

	getActiveUsername(): string
	{
		let usernameActive: string = '';

		if(this._salesmanService.existActiveSalesman())
		{
			let salesmanName: any = localStorage.getItem('activeSalesman');
			salesmanName = JSON.parse(salesmanName);
			usernameActive = salesmanName.name;
		}
		else
		{
			let userName: any = localStorage.getItem('authUser');
			userName = userName ? this._getFullName(JSON.parse(userName)):'Anonimo';
			usernameActive = userName;
		}

		return usernameActive;
	}

	getTitle()
	{
		var titlee = this.location.prepareExternalUrl(this.location.path());
		if (titlee.charAt(0) === "#") {
			titlee = titlee.slice(1);
		}

		for (var item = 0; item < this.listTitles.length; item++) {
			if (this.listTitles[item].path === titlee) {
			return this.listTitles[item].title;
			}
		}
		return "Dashboard";
	}

	openSearch()
	{
		document.body.classList.add("g-navbar-search-showing");
		setTimeout(function() {
			document.body.classList.remove("g-navbar-search-showing");
			document.body.classList.add("g-navbar-search-show");
		}, 150);
		setTimeout(function() {
			document.body.classList.add("g-navbar-search-shown");
		}, 300);
	}

	closeSearch() {
		document.body.classList.remove("g-navbar-search-shown");
		setTimeout(function() {
			document.body.classList.remove("g-navbar-search-show");
			document.body.classList.add("g-navbar-search-hiding");
		}, 150);
		setTimeout(function() {
			document.body.classList.remove("g-navbar-search-hiding");
			document.body.classList.add("g-navbar-search-hidden");
		}, 300);
		setTimeout(function() {
			document.body.classList.remove("g-navbar-search-hidden");
		}, 500);
	}

	openSidebar() {
		if (document.body.classList.contains("g-sidenav-pinned")) {
			document.body.classList.remove("g-sidenav-pinned");
			document.body.classList.add("g-sidenav-hidden");
			this.sidenavOpen = false;
		} else {
			document.body.classList.add("g-sidenav-pinned");
			document.body.classList.remove("g-sidenav-hidden");
			this.sidenavOpen = true;
		}
	}
	
	toggleSidenav() {
		if (document.body.classList.contains("g-sidenav-pinned")) {
			document.body.classList.remove("g-sidenav-pinned");
			document.body.classList.add("g-sidenav-hidden");
			this.sidenavOpen = false;
		} else {
			document.body.classList.add("g-sidenav-pinned");
			document.body.classList.remove("g-sidenav-hidden");
			this.sidenavOpen = true;
		}
	}

	private _getFullName(userInfo: any): string
	{
		return `${userInfo.name.trim()} ${userInfo.surname.trim()}`;
	}

	logout()
	{
		this._authService.removeSession();
	}

}
