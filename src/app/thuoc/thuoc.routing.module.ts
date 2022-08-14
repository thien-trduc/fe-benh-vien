import { THUOC_DETAIL_ROUTE, THUOC_ADD_ROUTE } from '../helper/constant';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EditComponent } from './component/edit/edit.component';
import { ListComponent } from './component/list/list.component';
import { AddComponent } from './component/add/add.component';

const routes: Routes = [
  { path: '', component: ListComponent },
  { path: `${THUOC_DETAIL_ROUTE}/:id`, component:  EditComponent},
  { path: `${THUOC_ADD_ROUTE}`, component:  AddComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ThuocRoutingModule {}
