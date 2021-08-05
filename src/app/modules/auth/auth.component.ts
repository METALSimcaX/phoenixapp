import swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CatalogsService } from 'src/app/services/catalogs.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { GenericAlertService } from 'src/app/utils/generic-alert.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit
{
	public formLogin: FormGroup;
	loginStateButton: boolean;

	constructor(
		private _authService: AuthService, 
		private _catalogService: CatalogsService,
		private _router: Router, 
		private _toastService: ToastrService,
		private _spinnerService: NgxSpinnerService,
		private _alertService: GenericAlertService)
	{
		localStorage.removeItem("authUser");  
		this.initializeForm();
	}

	ngOnInit()
	{
		this.closeSession();
		this.loginStateButton = true;
	}

	initializeForm()
	{
		this.formLogin = new FormGroup({
			username: new FormControl('', [Validators.required]),
			password: new FormControl('', [Validators.required, Validators.minLength(8)])
		});
	}

	signin()
	{
		let dataForm = this.formLogin.value;
		this._spinnerService.show();

		console.log("LOGIN PAYLOAD",dataForm);
		this._authService.login(dataForm).subscribe(async (resp: any) => {
			if(resp)
			{
				console.log("RESPONSE LOGIN", resp);

				if(resp.status === 'success')
				{
					try
					{
						let _response = await this._catalogService.findCredentialInfoBy(dataForm.username).toPromise();
						console.log("RESPONSE LOGIN SAP", _response);
						this._authService.createLocalSession(_response);
						this._router.navigate(['dashboard']);
					}
					catch (err)
					{
						this._spinnerService.hide();
						console.error("ERROR LOGIN SAP", err);
						this._createToastAlert('Autentificación', 'Ocurrió un error al validar sus credenciales!', 'danger');
					}
				}
				else
				{
					this._spinnerService.hide();
					let {0: message} = resp.data;
					var _lastMessage = (message.split(':')[1]) ? ((message.split(':')[1]).trim().split(' on ')[0]):message.trim();
					this._sweetAlert("Advertencia", _lastMessage, "info");
				}
			}
			else
			{
				this._spinnerService.hide();
			}
		}, err => {
			this._spinnerService.hide();
			console.error("ERROR LOGIN SPRING", err);
			this._createToastAlert('Autentificación', 'Ocurrió un error al validar sus credenciales!', 'danger')
		});
	}

	async signInApplication()
	{
		this._spinnerService.show();

		let credentialInfo: any =  null;
		let dataForm = this.formLogin.value;
		let centerConfig = localStorage.getItem('centro');

		console.log("LOGIN PAYLOAD: ", dataForm);

		try
		{
			let _response: any = await this._catalogService.findCredentialInfoBy(dataForm.username).toPromise();
			
			console.log("RESPONSE BD. ", _response);
			if(!_response.hasOwnProperty('message'))
			{
				if(_response.costCenter.trim() === '')
				{
					this.formLogin.reset();
					this._spinnerService.hide();
					this._alertService.createSweetAlert('La cuenta ingresada no cuenta con la configuración de un centro de servicio; por favor, contactar a mesa de ayuda para mayor información.', '', 'info');
					return true;
				}

				if(_response.costCenter.trim() !== centerConfig.trim())
				{
					this.formLogin.reset();
					this._spinnerService.hide();
					this._alertService.createSweetAlert('La cuenta ingresada pertenece a un centro de servicio diferente', '', 'info');
					return true;
				}

				credentialInfo = { ..._response };
			}
			else
			{
				this._spinnerService.hide();
				this._alertService.createSweetAlert('No se encontraron datos relacionados a la cuenta ingresada, verifique sus credenciales', '', 'info');
				return true;
			}
		}
		catch (err)
		{
			this._spinnerService.hide();
			console.error("ERROR LOGIN SAP", err);
			this._alertService.createSweetAlert('Credenciales', 'Ocurrió un error al procesar la petición; intenté mas tarde!', 'warning');
			return true;
		}

		console.log("Step signIn in SAP");

		try
		{
			let resultRequest: any = await this._authService.login(dataForm).toPromise();

			console.log("RESPONSE LOGIN. ", resultRequest);

			if(resultRequest.status === 'success')
			{
				this._authService.createLocalSession(credentialInfo);
				this._router.navigate(['dashboard']);
			}
			else
			{
				this._spinnerService.hide();
				let {0: message} = resultRequest.data;
				var _lastMessage = (message.split(':')[1]) ? ((message.split(':')[1]).trim().split(' on ')[0]):message.trim();
				this._alertService.createSweetAlert(_lastMessage, '', "info");
			}
		}
		catch (err)
		{
			this._spinnerService.hide();
			console.error("ERROR LOGIN SPRING", err);
			this._alertService.createSweetAlert('Autentificación', 'Ocurrió un error al intentar validar sus credenciales en SAP', 'warning');	
		}
	}

	private closeSession()
	{
		this._authService.logout().subscribe(async (resp: any) => {
			console.log("SESSION BORRADA")
			console.log(resp)
		}, err => { 
			console.log("ERROR AL CERRAR SESION")
			console.log(err)
		});
	}

	private _createToastAlert(toastTitle: string, toastMessage: string, typeAlert: 'success'|'danger'|'info'|'warning' = 'info')
	{
		this._toastService.show(
			`<span class="alert-icon ni ni-bell-55" data-notify="icon"></span> <div class="alert-text"> 
			<span class="alert-title" data-notify="title">${toastTitle}</span> <span data-notify="message">${toastMessage}</span></div>`,
			"",
			{
				timeOut: 3000,
				closeButton: true,
				enableHtml: true,
				tapToDismiss: false,
				titleClass: "alert-title",
				positionClass: "toast-top-center",
				toastClass: `ngx-toastr alert alert-dismissible alert-${typeAlert} alert-notify`
			}
		);
	}

	private _sweetAlert(titleInfo: string, textInfo: string, iconType: 'info'|'success'|'warning' = 'info')
	{
		return swal.fire({
			title: titleInfo,
			text: textInfo,
			icon: iconType,
			buttonsStyling: false,
			customClass: { confirmButton: "btn btn-"+iconType }
		});
	}
}
