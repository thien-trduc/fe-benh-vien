import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzFormModule } from 'ng-zorro-antd/form';
import { ReactiveFormsModule } from '@angular/forms';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzDatePickerModule, NzTabsModule } from 'ng-zorro-antd';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { FormsModule } from '@angular/forms';

import { AddComponent } from './add/add.component';
import { EditComponent } from './edit/edit.component';
import { ListComponent } from './list/list.component';
import { BenhNhanRoutingModule } from './benh-nhan.routing.module';



@NgModule({
  declarations: [AddComponent, EditComponent, ListComponent],
  imports: [
    BenhNhanRoutingModule,
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
    NzTabsModule
  ]
})
export class BenhNhanModule { }
