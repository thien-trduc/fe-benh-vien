import { XuatVien } from './xuat-vien.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { BaseClient } from '../helper/client';
import { XUAT_VIEN_ROUTE } from '../helper/constant';

@Injectable({
  providedIn: 'root'
})
export class XuatVienService extends BaseClient<XuatVien> {

  constructor(http: HttpClient) {
    super(http, XUAT_VIEN_ROUTE);
  }
}
