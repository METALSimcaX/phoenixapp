import { RouterModule } from '@angular/router';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidemenuComponent } from './sidemenu.component';


import { DxVectorMapModule, DxPieChartModule } from 'devextreme-angular';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = { suppressScrollX: true };

@NgModule({
  declarations: [SidemenuComponent],
  imports: [
    CommonModule,
    RouterModule,
    CollapseModule.forRoot(),
    PerfectScrollbarModule,
    BsDropdownModule.forRoot(),
    DxVectorMapModule,
    DxPieChartModule
  ],
  exports: [SidemenuComponent],
  providers: [
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    }
  ]
})
export class SidemenuModule { }
