import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BaseClient } from '../helper/client';
import { BENH_NHAN_ROUTE } from '../helper/constant';
import { BenhNhan } from './benh-nhan.model';

@Injectable({
  providedIn: 'root'
})
export class BenhNhanService extends BaseClient<BenhNhan> {

  constructor(http: HttpClient) {
    super(http, BENH_NHAN_ROUTE);
  }

  async uploadV2(file: any): Promise<any> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      return await this.http.post(`${environment.apiUrl}/upload/${BENH_NHAN_ROUTE}`, formData).toPromise();
    } catch (error) {
      throw error;
    }
  }
}
