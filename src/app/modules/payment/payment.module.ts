import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaymentComponent } from './payment.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { PaginationModule } from "ngx-bootstrap/pagination";
import { TicketComponent } from './ticket/ticket.component';
import { NgxMaskModule, IConfig } from 'ngx-mask';
import {NgParticlesModule} from "ng-particles";

export const options: Partial<IConfig> | (() => Partial<IConfig>) = null;

@NgModule({
  declarations: [PaymentComponent, TicketComponent],
  imports: [
    CommonModule, 
    ModalModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    NgxDatatableModule,
    PaginationModule.forRoot(),
    NgxMaskModule.forRoot(),
    NgParticlesModule 
  ],
  providers: []
})
export class PaymentModule { }
