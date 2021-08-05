import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalModule } from 'ngx-bootstrap/modal';
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { PaginationModule } from "ngx-bootstrap/pagination";
import { NgxMaskModule, IConfig } from 'ngx-mask';
import { PendingPaymentComponent } from './pending-payment.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

export const options: Partial<IConfig> | (() => Partial<IConfig>) = null;

@NgModule({
  declarations: [PendingPaymentComponent],
  imports: [
    CommonModule, 
    ModalModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    NgxDatatableModule,
    PaginationModule.forRoot(),
    NgxMaskModule.forRoot()
  ],
  providers: [],
  //schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PendingPaymentModule { }
