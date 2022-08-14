import { ThongKeModule } from './thong-ke/thong-ke.module';
import { HomeComponent } from './home/home.component';
import { AppComponent } from './app.component';
import { UserComponent } from './login/user/user.component';
import { AuthGuard } from './login/auth.guard';
import {
  KHOA_ROUTE,
  BENH_NHAN_ROUTE,
  NHAN_VIEN_ROUTE,
  THUOC_ROUTE,
  PHONG_ROUTE,
  GIUONG_ROUTE,
  DICH_VU_ROUTE,
  BENH_AN_ROUTE,
  TOA_THUOC_ROUTE,
  TAM_UNG_ROUTE,
  XUAT_VIEN_ROUTE,
  HOA_DON_ROUTE,
  DOANH_THU_ROUTE,
  THONG_KE_ROUTE
} from './helper/constant';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: KHOA_ROUTE,
    loadChildren: () => import('./khoa/khoa.module').then(m => m.KhoaModule),
    canActivate: [AuthGuard]
  },
  {
    path: BENH_AN_ROUTE,
    loadChildren: () => import('./benh-an/benh-an.module').then(m => m.BenhAnModule),
    canActivate: [AuthGuard]
  },
  {
    path: BENH_NHAN_ROUTE,
    loadChildren: () => import('./benh-nhan/benh-nhan.module').then(m => m.BenhNhanModule),
    canActivate: [AuthGuard]
  },
  {
    path: NHAN_VIEN_ROUTE,
    loadChildren: () => import('./nhan-vien/nhan-vien.module').then(m => m.NhanVienModule),
    canActivate: [AuthGuard]
  },
  {
    path: THUOC_ROUTE,
    loadChildren: () => import('./thuoc/thuoc.module').then(m => m.ThuocModule),
    canActivate: [AuthGuard]
  },
  {
    path: PHONG_ROUTE,
    loadChildren: () => import('./phong/phong.module').then(m => m.PhongModule),
    canActivate: [AuthGuard],
  },
  {
    path: GIUONG_ROUTE,
    loadChildren: () => import('./giuong/giuong.module').then(m => m.GiuongModule),
    canActivate: [AuthGuard]
  },
  {
    path: DICH_VU_ROUTE,
    loadChildren: () => import('./dich-vu/dich-vu.module').then(m => m.DichVuModule),
    canActivate: [AuthGuard]
  },
  {
    path: TOA_THUOC_ROUTE,
    loadChildren: () => import('./toa-thuoc/toa-thuoc.module').then(m => m.ToaThuocModule),
    canActivate: [AuthGuard]
  },
  {
    path: TAM_UNG_ROUTE,
    loadChildren: () => import('./tam-ung/tam-ung.module').then(m => m.TamUngModule),
    canActivate: [AuthGuard]
  },
  {
    path: XUAT_VIEN_ROUTE,
    loadChildren: () => import('./xuat-vien/xuat-vien.module').then(m => m.XuatVienModule),
    canActivate: [AuthGuard]
  },
  {
    path: HOA_DON_ROUTE,
    loadChildren: () => import('./hoa-don/hoa-don.module').then(m => m.HoaDonModule),
    canActivate: [AuthGuard]
  },
  {
    path: THONG_KE_ROUTE,
    loadChildren: () => import('./thong-ke/thong-ke.module').then(m => m.ThongKeModule),
    canActivate: [AuthGuard]
  },
  // {
  //   path: '',
  //   component: HomeComponent,
  //   canActivate: [AuthGuard]
  // },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then(m => m.LoginModule),
  },
  { path: '**', redirectTo: '/benh-an' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
