import { Component, Input, OnInit } from '@angular/core';
import * as moment from 'moment/moment';

enum typeMethods
{
	CONT = "contado",
	FIN = "financiamiento",
	RFIN = "reanudacion",
	SERV = "servicios",
	TAE = "tiempo aire"
}

@Component({
	selector: 'app-ticket',
	templateUrl: './ticket.component.html',
	styleUrls: ['./ticket.component.css']
})
export class TicketComponent implements OnInit
{
	dateTicket: string;
	@Input() ticketInfo: any;

	constructor()
	{
		this.dateTicket = '';
	}

	ngOnInit(): void
	{
		this.dateTicket = moment().format('YYYY-MM-DD HH:mm:ss');
	}

	isPaidAccountTicket(): boolean
	{
		return (this.ticketInfo.typeTicket === typeMethods.FIN);
	}

	isFinancingTicket(): boolean
	{
		return (this.ticketInfo.typeTicket === typeMethods.FIN || this.ticketInfo.typeTicket === typeMethods.RFIN);
	}

	pad(num:number): string
	{
		let s = num+"";
		while (s.length < 10) s = "0" + s;
		return s;
	}

	formatNumber(phone)
	{
		return phone.slice(0,2) + " - " + phone.slice(3,5) + " - " + phone.slice(5,phone.length)
	}

	calculateTotalIVA(): number
	{
		return (this.ticketInfo.total / 1.16) * 0.16;
	}

	calculateSubTotal(): number
	{
		return (this.ticketInfo.total / 1.16);
	}

}
