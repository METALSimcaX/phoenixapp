import swal from 'sweetalert2';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

interface QuestionAlert
{ 
	colorConfirm: string, 
	colorCancel: string, 
	textConfirm: string, 
	textCancel: string
}

@Injectable({
	providedIn: 'root'
})
export class GenericAlertService
{

	constructor(private _toastService: ToastrService)
	{}

  	createSweetAlert(titleInfo: string, textInfo: string, iconType: 'info'|'success'|'warning' = 'info')
	{
		return swal.fire({
			title: titleInfo,
			text: textInfo,
			icon: iconType,
			buttonsStyling: false,
			customClass: { confirmButton: "btn btn-"+iconType }
		});
	}

	createToastAlert(toastTitle: string, toastMessage: string, typeAlert: 'success'|'danger'|'info'|'warning'|'default' = 'info', timeSpoiler: number = 5000)
	{
		this._toastService.show(
			`<span class="alert-icon ni ni-bell-55" data-notify="icon"></span> <div class="alert-text"> 
			<span class="alert-title" data-notify="title">${toastTitle}</span> <span data-notify="message">${toastMessage}</span></div>`,
			"",
			{
				timeOut: timeSpoiler,
				closeButton: true,
				enableHtml: true,
				tapToDismiss: false,
				titleClass: "alert-title",
				positionClass: "toast-top-center",
				toastClass: `ngx-toastr alert alert-dismissible alert-${typeAlert} alert-notify`
			}
		);
	}

	questionSweetAlert(title: string, question: string, iconType: 'info'|'warning'|'success'|'error' = 'info', buttonConfig: QuestionAlert = { textConfirm: 'Continuar', textCancel: 'Cancelar', colorConfirm: '#3085d6', colorCancel: '#d33' })
	{
		return swal.fire({
			title,
			text: question,
			icon: iconType,
			showCancelButton: true,
			confirmButtonColor: buttonConfig.colorConfirm,
			cancelButtonColor: buttonConfig.colorCancel,
			confirmButtonText: buttonConfig.textConfirm,
			cancelButtonText: buttonConfig.textCancel
		});
	}
}
