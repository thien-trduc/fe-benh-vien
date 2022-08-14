import { NHAN_VIEN_ROUTE } from '../helper/constant';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseClient } from '../helper/client';
import { NhanVien } from './model/nhan-vien.model';
import { LoaiNhanVien } from './model/loai-nhan-vien.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NhanVienService extends BaseClient<NhanVien> {

  constructor(http: HttpClient) {
    super(http, NHAN_VIEN_ROUTE);
  }

  async getLoaiNhanVien(): Promise<LoaiNhanVien[]> {
    try {
      return await this.http.get<LoaiNhanVien[]>(`${this.baseUrl}/loai`).toPromise();
    } catch (error) {
      throw error;
    }
  }

  async uploadV2(file: any): Promise<any> {
    try {
        const formData = new FormData();
        formData.append('file', file);
        return await this.http.post(`${environment.apiUrl}/upload/${NHAN_VIEN_ROUTE}`, formData, {
          headers: {

        }}).toPromise();
    } catch (error) {
        throw error;
    }
  }

  async fetchByLoaiNhanVien(
    pageIndex: number = 0,
    pageSize: number = 10,
    sortField: string,
    sortOrder: string,
    query?: any,
): Promise<any> {
    try {
        const sort: any = {};
        if (sortField && sortOrder) {
            sort[sortField] = sortOrder.replace('end', '').toUpperCase();
        }
        console.log(sort)
        return await this.http.post<any>(`${this.baseUrl}/find-by-loai`, { pageIndex, pageSize, sort, query }).toPromise();
    } catch (error) {
        throw error;
    }
}
}
