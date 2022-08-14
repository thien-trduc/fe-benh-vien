import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { XUAT_VIEN_ADD_ROUTE, XUAT_VIEN_DETAIL_ROUTE } from '../helper/constant';
import { AddComponent } from './component/add/add.component';
import { ListComponent } from './component/list/list.component';

const routes: Routes = [
  { path: '', component: ListComponent },
  { path: `${XUAT_VIEN_ADD_ROUTE}`, component: AddComponent },
  { path: `${XUAT_VIEN_DETAIL_ROUTE}/:id`, component: AddComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class XuatVienRoutingModule { }