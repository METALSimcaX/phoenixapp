import { CollapseModule } from 'ngx-bootstrap/collapse';
import { ToastrModule } from 'ngx-toastr';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavHeaderComponent } from './nav-header.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [NavHeaderComponent],
  imports: [
    CommonModule,
    RouterModule,
    BsDropdownModule,
    ToastrModule,
    CollapseModule
  ],
  exports: [NavHeaderComponent]
})
export class NavHeaderModule { }
