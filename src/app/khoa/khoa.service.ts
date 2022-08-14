import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { KHOA_ROUTE } from 'src/app/helper/constant';

import { BaseClient } from './../helper/client';
import { Khoa } from './khoa.model';

@Injectable({
  providedIn: 'root'
})
export class KhoaService extends BaseClient<Khoa> {

  constructor(http: HttpClient) {
    super(http, KHOA_ROUTE);
  }
}
