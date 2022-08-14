import { BaseRespone } from './../helper/response';
import { TOA_THUOC_ROUTE } from './../helper/constant';
import { HttpClient } from '@angular/common/http';
import { BaseClient } from './../helper/client';
import { Injectable } from '@angular/core';
import { ToaThuoc } from './model/toa-thuoc.model';


@Injectable({
  providedIn: 'root'
})
export class ToaThuocService extends BaseClient<ToaThuoc> {
  constructor(http: HttpClient) {
    super(http, TOA_THUOC_ROUTE);
  }

  async createChiTietToaThuoc(id: string, formData: any): Promise<any> {
    try {
      return await this.http.post<any>(`${this.baseUrl}/${id}/chi-tiet-toa`, formData).toPromise();
    } catch (error) {
      throw error;
    }
  }

  async updateChiTietToaThuoc(id: string, mathuoc: string, formData: any): Promise<any> {
    try {
      return await this.http.patch<any>(`${this.baseUrl}/${id}/chi-tiet-toa`, formData, {
        headers: {
          mathuoc,
        }
      }).toPromise();
    } catch (error) {
      throw error;
    }
  }

  async getChiTietToaThuoc(
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
        `${this.baseUrl}/${id}/chi-tiet-toa/list`, { pageIndex, pageSize, sort, query }
      ).toPromise();
    } catch (error) {
      throw error;
    }
  }

  async deleteChiTietToaThuoc(id: string, maThuoc: string): Promise<any> {
    try {
      return await this.http.delete(`${this.baseUrl}/${id}/chi-tiet-toa`, {
        headers: {
          mathuoc: maThuoc,
        }
      }).toPromise();
    } catch (error) {
      throw error;
    }
  }

  async getChiTietById(id: string, maThuoc: string): Promise<any> {
    try {
      return await this.http.get<any>(`${this.baseUrl}/${id}/chi-tiet-toa`, {
        headers: {
          mathuoc: maThuoc,
        }
      }).toPromise();
    } catch (error) {
      throw error;
    }
  }

  async existToaThuocKham(makham: number): Promise<any> {
    try {

      return await this.http.get<boolean>(`${this.baseUrl}/kham-exist`, {
        headers: {
          makham: makham.toString(),
        }
      }).toPromise();
    } catch (error) {
      throw error;
    }
  }

  async exportToacThuoc(id: string): Promise<any> {
    try {

      const response = await this.http.get(`${this.baseUrl}/${id}/export`, { responseType: 'blob' as 'blob' }).toPromise();
      const dataType = 'application/octet-stream';
      const binaryData = [];
      binaryData.push(response);
      let downloadLink = document.createElement('a');
      downloadLink.href = window.URL.createObjectURL(new Blob(binaryData, { type: dataType }));
      downloadLink.setAttribute('download', `${id}_${(new Date()).toLocaleTimeString()}.xlsx`);

      document.body.appendChild(downloadLink);
      downloadLink.click();
    } catch (error) {
      throw error;
    }
  }
}
