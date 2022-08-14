import { DichVu } from './model/dich-vu.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseClient } from '../helper/client';
import { DICH_VU_ROUTE } from '../helper/constant';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DichVuService extends BaseClient<DichVu> {

  constructor(http: HttpClient) {
    super(http, DICH_VU_ROUTE);
  }

  async uploadV2(file: any): Promise<any> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      return await this.http.post(`${environment.apiUrl}/upload/${DICH_VU_ROUTE}`, formData).toPromise();
    } catch (error) {
      throw error;
    }
  }
}
