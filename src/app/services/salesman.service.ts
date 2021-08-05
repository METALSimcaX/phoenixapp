import swal from 'sweetalert2';
import { Injectable } from '@angular/core';
import { CatalogsService } from './catalogs.service';
import { GenericAlertService } from '../utils/generic-alert.service';
import { Router } from '@angular/router';

@Injectable({
	providedIn: 'root'
})
export class SalesmanService
{
	constructor(private _catalogService: CatalogsService, private _router: Router, private _genericAlertService: GenericAlertService)
	{}

	async changeActiveSaleman(showActionButton: boolean, showAbortButton: boolean, showConfirmModal: boolean): Promise<boolean>
	{
		let HTMLSalesman = '', salesmanList = [];

		try
		{
			let centerConfig = localStorage.getItem('centro');
			let requestResult: any = await this._catalogService.getSalesmanListByCenter(centerConfig).toPromise();

			if(requestResult.status === 'success')
			{
				let {data: salesmans} = requestResult;

				salesmanList = [...salesmans];
				salesmans.forEach((item: any) => {
					HTMLSalesman += `<div id="salesman-${item.id}-div" class="media align-items-center salesman-box p-1 mt-2">
						<span id="salesman-${item.id}-span" class="avatar avatar-sm rounded-circle"><img id="salesman-${item.id}-img" alt="Image placeholder" src="assets/ico_perrito.png"></span>
						<div id="salesman-${item.id}-div-span" class="media-body ml-2 d-none d-lg-block"><span id="salesman-${item.id}-name" class="mb-0 text-lg font-weight-bold">${item.name}</span></div>
					</div>`;
				});
			}
		}
		catch (err: any)
		{
			console.error('Ocurrió un error al obtener la lista de vendedores', err);
			//this._router.navigate(['dashboard']);
			//localStorage.removeItem("activeSalesman");
			this._genericAlertService.createSweetAlert(`Ocurrió un error al obtener la lista de vendedores`, '', 'warning');
			return false;
		}

		let _salesmanName: string = '';

		let result: { isDismissed: boolean, isDenied: boolean, isConfirmed: boolean, value: any, dismiss: any }|any = await swal.fire({
			title: 'Seleccióne su usuario de vendedor para registrar sus ventas',
			showDenyButton: showActionButton,
			showCancelButton: showAbortButton,
			showConfirmButton: false,
			denyButtonText: `Ir al Dashboard`,
			cancelButtonText: 'Cancelar',
			html: `<div style="min-width: 70%; max-width: 85%; display: inline-block;">${HTMLSalesman}</div>`,
			allowEnterKey: false,
			allowEscapeKey: false,
			allowOutsideClick: false,
			didOpen()
			{
				var salesmanElements: any = document.getElementsByClassName('salesman-box');

				for(let element of salesmanElements)
				{
					element.addEventListener('dblclick', (event: any) => {
						let {1: salemanId} = (event.target.id).split('-');
						let findSalesman = salesmanList.find(s => s.id === +salemanId);
						localStorage.setItem('activeSalesman', JSON.stringify(findSalesman));
						_salesmanName = findSalesman.name;
						swal.close();
					});
				}
			},
		});

		console.warn('R.', result);
		if(result.hasOwnProperty('dismiss') && result['dismiss'] === 'cancel') return true;
		
		if(result.isDenied)
		{
			this._router.navigate(['dashboard']);
			localStorage.removeItem("activeSalesman");
			return false;
		}
		else if(result.isDismissed)
		{
			if(showConfirmModal) this._genericAlertService.createSweetAlert(`Ha iniciado sus credenciales de vendedor como ${_salesmanName}`, '', 'info');
			return true;
		}
	}

	existActiveSalesman(): boolean
	{
	   return (localStorage.getItem("activeSalesman") !== null && localStorage.getItem("activeSalesman").trim() !== '');
	}

}
