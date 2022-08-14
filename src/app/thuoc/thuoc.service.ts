import { THUOC_ROUTE } from './../helper/constant';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { BaseClient } from '../helper/client';
import { Thuoc } from './model/thuoc.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ThuocService extends BaseClient<Thuoc> {

  constructor(http: HttpClient) {
    super(http, THUOC_ROUTE);
  }

  async uploadV2(file: any): Promise<any> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      return await this.http.post(`${environment.apiUrl}/upload/${THUOC_ROUTE}`, formData).toPromise();
    } catch (error) {
      throw error;
    }
  }
}
