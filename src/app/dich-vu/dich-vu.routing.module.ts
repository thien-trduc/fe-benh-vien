import { DICH_VU_DETAIL_ROUTE, DICH_VU_ADD_ROUTE } from '../helper/constant';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListComponent } from './component/list/list.component';
import { EditComponent } from './component/edit/edit.component';
import { AddComponent } from './component/add/add.component';

const routes: Routes = [
  { path: '', component: ListComponent },
  { path: `${DICH_VU_DETAIL_ROUTE}/:id`, component:  EditComponent},
  { path: `${DICH_VU_ADD_ROUTE}`, component:  AddComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DichVuRoutingModule {}
