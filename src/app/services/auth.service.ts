import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
   providedIn: 'root'
})
export class AuthService
{
   private _URL: string;
   private readonly VALID_USERNAME = ['FCANUL', 'RQUINTAL', 'PSANCHEZ'];

   constructor(private _httpClient: HttpClient, private _router: Router)
   {
      this._URL = `${localStorage.getItem("ipsw")}/auth`;
   }

   login(formLogin: any): Observable<any>
   {
      return this._httpClient.post(`${this._URL}/signin`, formLogin);
   }

   logout(): Observable<any>
   {
      return this._httpClient.post(`${this._URL}/signout`, null);
   }

   listar(): Observable<any>
   {
      return this._httpClient.get(`${this._URL}`);
   }

   createLocalSession(jwtAuth: any): void
   {
      localStorage.removeItem("authUser");
      localStorage.setItem("authUser", JSON.stringify(jwtAuth));
   }

   removeSession()
   {
      localStorage.removeItem("authUser");
      localStorage.removeItem("activeSalesman");
      this._router.navigate(['login']);
   }

   existAuthetification()
   {
      let activeAuth = localStorage.getItem("authUser") ? true:false;

      if(!activeAuth)
      {
         this._router.navigate(['login']);
         return false;
      }
      
      return true;
   }

   isAuthorizeUser(): boolean
   {
      let existAuthUser: any = localStorage.getItem('authUser');

      if(existAuthUser !== null)
      {
         existAuthUser = (JSON.parse(existAuthUser).username).trim();
         return this.VALID_USERNAME.includes(existAuthUser.toUpperCase());
      }
      else
      {
         return false;
      }
   }

}
