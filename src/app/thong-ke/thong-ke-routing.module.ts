import { BENH_NHAN_PHONG_ROUTE } from './../helper/constant';

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DoanhThuComponent } from './doanh-thu/doanh-thu.component';
import { BenhNhanPhongComponent } from './benh-nhan-phong/benh-nhan-phong.component';
import { DOANH_THU_ROUTE } from '../helper/constant';

const routes: Routes = [
  { path: `${DOANH_THU_ROUTE}`, component:  DoanhThuComponent},
  { path: `${BENH_NHAN_PHONG_ROUTE}`, component:  BenhNhanPhongComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ThongKeRoutingModule {}
