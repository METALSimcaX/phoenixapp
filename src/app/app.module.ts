import { AuthModule } from './modules/auth/auth.module';
import { NgModule, Pipe, PipeTransform, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule, DomSanitizer } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { BsDropdownModule } from "ngx-bootstrap/dropdown";
import { ToastrModule } from "ngx-toastr";
import { TagInputModule } from "ngx-chips";
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { NgxSpinnerModule } from "ngx-spinner";

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { DrawerClosureComponent } from './modules/drawer-closure/drawer-closure.component';
import { DrawerOpertureComponent } from './modules/drawer-operture/drawer-operture.component';
import { CashRegisterComponent } from './modules/cash-register/cash-register.component';
import { DepositComponent } from './modules/deposit/deposit.component';
import { DrawersComponent } from './modules/drawers/drawers.component';
import { SettingsComponent } from './modules/settings/settings.component';
import { NgxPrinterModule } from 'ngx-printer';
import { ThermalPrintModule } from 'ng-thermal-print';
import { SalesComponent } from './modules/sales/sales.component';
import { DatePipe } from '@angular/common';
import {NgParticlesModule} from "ng-particles";

@NgModule({
  declarations: [
    AppComponent,
    DrawerClosureComponent,
    DrawerOpertureComponent,
    CashRegisterComponent,
    DepositComponent,
    DrawersComponent,
    SettingsComponent,
    SalesComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
    AppRoutingModule,
    AuthModule,
    BsDropdownModule.forRoot(),
    ToastrModule.forRoot(),
    CollapseModule.forRoot(),
    AccordionModule.forRoot(),
    TagInputModule,
    NgxSpinnerModule,
    NgxPrinterModule.forRoot({ printOpenWindow: false }),
    ThermalPrintModule,
    NgParticlesModule 
  ],
  exports: [AccordionModule],
  providers: [DatePipe],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
