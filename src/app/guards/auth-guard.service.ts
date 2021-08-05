import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Injectable({
	providedIn: 'root'
})
export class AuthGuardService
{
	constructor(private _authService: AuthService)
	{}

	canActivate(): boolean
	{
		return this._authService.existAuthetification();
	}

	canLoad(): boolean
	{
		return this._authService.existAuthetification()
	}
}
