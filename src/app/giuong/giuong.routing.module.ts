import { GIUONG_DETAIL_ROUTE, GIUONG_ADD_ROUTE } from '../helper/constant';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListComponent } from './list/list.component';


const routes: Routes = [
  { path: '', component: ListComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GiuongRoutingModule {}
