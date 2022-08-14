import { GIUONG_ROUTE } from '../helper/constant';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseClient } from '../helper/client';
import { Giuong } from './giuong.model';

@Injectable({
  providedIn: 'root'
})
export class GiuongService extends BaseClient<Giuong> {

  constructor(http: HttpClient) {
    super(http, GIUONG_ROUTE);
  }
}
