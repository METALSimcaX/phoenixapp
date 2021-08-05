import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from './services/auth.service';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit
{
	constructor()
	{
		localStorage.removeItem("authUser");
		localStorage.removeItem("activeSalesman");
	}

	ngOnInit()
	{}

}
