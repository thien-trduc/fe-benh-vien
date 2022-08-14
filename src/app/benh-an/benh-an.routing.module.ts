import { BENH_AN_DETAIL_ROUTE, BENH_AN_ADD_ROUTE } from '../helper/constant';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListComponent } from './component/list/list.component';
import { EditComponent } from './component/edit/edit.component';
import { AddComponent } from './component/add/add.component';

const routes: Routes = [
  { path: '', component: ListComponent },
  { path: `${BENH_AN_DETAIL_ROUTE}/:id`, component:  EditComponent},
  { path: `${BENH_AN_ADD_ROUTE}`, component:  AddComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BenhAnRoutingModule {}
