import { EditComponent } from './edit/edit.component';
import { KHOA_ADD_ROUTE, KHOA_DETAIL_ROUTE } from './../helper/constant';
import { AddComponent } from './add/add.component';
import { ListComponent } from './list/list.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', component: ListComponent },
  { path: `${KHOA_DETAIL_ROUTE}/:id`, component: EditComponent },
  { path: KHOA_ADD_ROUTE, component: AddComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class KhoaRoutingModule { }
