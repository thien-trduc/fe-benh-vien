import { BaseRespone } from './../helper/response';
import { PhongGiuongCreate } from './phong.type';
import { PHONG_ROUTE } from '../helper/constant';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseClient } from '../helper/client';
import { Phong } from './model/phong.model';

@Injectable({
  providedIn: 'root'
})
export class PhongService extends BaseClient<Phong> {
  constructor(http: HttpClient) {
    super(http, PHONG_ROUTE);
  }

  async storeCtGiuong(formData: PhongGiuongCreate): Promise<void> {
    try {
      const { maPhong } = formData;
      await this.http.post(`${this.baseUrl}/${maPhong}/giuong/them`, formData).toPromise();
    } catch (error) {
      throw error;
    }
  }

  async fetchChiTietGiuongs(
    id: string,
    pageIndex: number = 0,
    pageSize: number = 10,
    sortField: string,
    sortOrder: string,
    query?: any,
  ): Promise<BaseRespone<any>> {
    try {
      const sort: any = {};
      if (sortField && sortOrder) {
        sort[sortField] = sortOrder.replace('end', '').toUpperCase();
      }
      return await this.http.post<BaseRespone<any>>(
        `${this.baseUrl}/${id}/giuong/list`, { pageIndex, pageSize, sort, query }
      ).toPromise();
    } catch (error) {
      throw error;
    }
  }

  async deleteGiuongs(id: string, idChiTiet: string): Promise<any> {
    try {
      return await this.http.delete(`${this.baseUrl}/${id}/giuong/${idChiTiet}`).toPromise();
    } catch (error) {
      throw error;
    }
  }

  async getPhongGiuongByID(id: string, idChiTiet: number): Promise<any> {
    try {
      return await this.http.get(`${this.baseUrl}/${id}/giuong/${idChiTiet}`).toPromise();
    } catch (error) {
      throw error;
    }
  }
}
