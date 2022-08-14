import { NgxChartsModule } from '@swimlane/ngx-charts';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  NzAlertModule,
  NzBreadCrumbModule,
  NzButtonModule,
  NzCardModule,
  NzDatePickerModule,
  NzDividerModule,
  NzEmptyModule,
  NzFormModule,
  NzGridModule,
  NzIconModule,
  NzInputModule,
  NzMessageModule,
  NzModalModule,
  NzPageHeaderModule,
  NzPopconfirmModule,
  NzSelectModule,
  NzSpinModule,
  NzTableModule,
  NzUploadModule,
} from 'ng-zorro-antd';

import { BenhNhanPhongComponent } from './benh-nhan-phong/benh-nhan-phong.component';
import { DoanhThuComponent } from './doanh-thu/doanh-thu.component';
import { ThongKeRoutingModule } from './thong-ke-routing.module';
import { ThongKeService } from './thong-ke.service';



@NgModule({
  declarations: [
    DoanhThuComponent,
    BenhNhanPhongComponent],
  imports: [
    CommonModule,
    ThongKeRoutingModule,
    HttpClientModule,
    NzTableModule,
    NzButtonModule,
    NzIconModule,
    NzCardModule,
    NzPageHeaderModule,
    NzGridModule,
    NzFormModule,
    ReactiveFormsModule,
    NzAlertModule,
    NzMessageModule,
    NzSpinModule,
    NzPopconfirmModule,
    NzDatePickerModule,
    NzSelectModule,
    NzInputModule,
    FormsModule,
    NzBreadCrumbModule,
    NzEmptyModule,
    NzUploadModule,
    NzModalModule,
    NzDividerModule,
    NgxChartsModule
  ]
})
export class ThongKeModule { }
