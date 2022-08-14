import { HoaDon } from './hoa-don.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { BaseClient } from '../helper/client';
import { HOA_DON_ROUTE } from '../helper/constant';

@Injectable({
  providedIn: 'root'
})
export class HoaDonService extends BaseClient<HoaDon> {

  constructor(http: HttpClient) {
    super(http, HOA_DON_ROUTE);
  }
}
