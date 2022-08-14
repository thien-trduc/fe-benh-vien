import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { NzDatePickerModule, NzTypographyModule } from 'ng-zorro-antd';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzStepsModule } from 'ng-zorro-antd/steps';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzUploadModule } from 'ng-zorro-antd/upload';

import { BenhAnRoutingModule } from './benh-an.routing.module';
import { AddComponent } from './component/add/add.component';
import { BacSiComponent } from './component/bac-si/bac-si.component';
import { BenhNhanComponent } from './component/benh-nhan/benh-nhan.component';
import { CtDichVuComponent } from './component/ct-dich-vu/ct-dich-vu.component';
import { DichVuComponent } from './component/dich-vu/dich-vu.component';
import { EditComponent } from './component/edit/edit.component';
import { KhamComponent } from './component/kham/kham.component';
import { ListComponent } from './component/list/list.component';
import { ThueGiuongComponent } from './component/thue-giuong/thue-giuong.component';
import { YtaComponent } from './component/yta/yta.component';
import { PhongGiuongComponent } from './component/phong-giuong/phong-giuong.component';


@NgModule({
  declarations: [
    AddComponent,
    EditComponent,
    ListComponent,
    BenhNhanComponent,
    YtaComponent,
    BacSiComponent,
    KhamComponent,
    ThueGiuongComponent,
    CtDichVuComponent,
    DichVuComponent,
    PhongGiuongComponent],
  imports: [
    BenhAnRoutingModule,
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
    NzTabsModule,
    NgxChartsModule,
    NzStepsModule,
    NzTypographyModule,
    NzListModule,
  ]
})
export class BenhAnModule { }
