import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzDatePickerModule } from 'ng-zorro-antd';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NgxCurrencyModule } from "ngx-currency";


import { AddComponent } from './component/add/add.component';
// import { EditComponent } from './component/edit/edit.component';
import { ListComponent } from './component/list/list.component';
import { TamUngRoutingModule } from './tam-ung.routing.module';



@NgModule({
  declarations: [
    AddComponent,
    ListComponent],
  imports: [
    TamUngRoutingModule,
    CommonModule,
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
    NzInputNumberModule,
    NgxCurrencyModule
  ]
})
export class TamUngModule { }

