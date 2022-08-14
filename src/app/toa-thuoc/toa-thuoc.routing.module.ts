import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TOA_THUOC_ADD_ROUTE, TOA_THUOC_DETAIL_ROUTE } from './../helper/constant';
import { AddComponent } from './component/add/add.component';
import { EditComponent } from './component/edit/edit.component';
import { ListComponent } from './component/list/list.component';

const routes: Routes = [
  { path: '', component: ListComponent },
  { path: `${TOA_THUOC_DETAIL_ROUTE}/:id`, component:  EditComponent},
  { path: `${TOA_THUOC_ADD_ROUTE}`, component:  AddComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ToaThuocRoutingModule {}
