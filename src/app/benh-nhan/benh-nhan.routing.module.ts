import { BENH_NHAN_DETAIL_ROUTE, BENH_NHAN_ADD_ROUTE } from '../helper/constant';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListComponent } from './list/list.component';
import { EditComponent } from './edit/edit.component';
import { AddComponent } from './add/add.component';

const routes: Routes = [
  { path: '', component: ListComponent },
  { path: `${BENH_NHAN_DETAIL_ROUTE}/:id`, component:  EditComponent},
  { path: `${BENH_NHAN_ADD_ROUTE}`, component:  AddComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BenhNhanRoutingModule {}
