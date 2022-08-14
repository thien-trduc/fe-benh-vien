import { ThueGiuong } from './model/benh-an.thue-giuong.model';
import { ChiTietDichVu } from './model/benh-an.dich-vu.model';
import { Kham } from './model/benh-an.kham.model';
import { BaseRespone } from './../helper/response';
import { BenhAn } from './model/benh-an.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseClient } from '../helper/client';
import { BENH_AN_ROUTE } from '../helper/constant';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BenhAnService extends BaseClient<BenhAn> {

  constructor(http: HttpClient) {
    super(http, BENH_AN_ROUTE);
  }

  async fetchKham(
    maBA: string,
    pageIndex: number = 0,
    pageSize: number = 10,
    sortField: string,
    sortOrder: string,
    query: any = {},
  ): Promise<BaseRespone<Kham>> {
    try {
      const sort: any = {};
      if (sortField && sortOrder) {
        sort[sortField] = sortOrder.replace('end', '').toUpperCase();
      }
      query = {...query, maBA};
      return await this.http.post<BaseRespone<Kham>>(`${environment.apiUrl}/kham/list`, { pageIndex, pageSize, sort, query }).toPromise();
    } catch (error) {
      throw error;
    }
  }

  async getKhamById(idkham: string): Promise<Kham> {
    try {
      return await this.http.get<Kham>(`${environment.apiUrl}/kham/${idkham}`).toPromise();
    } catch (error) {
      throw error;
    }
  }

  async createKham(body: any = {}): Promise<any> {
    try {
      return await this.http.post<any>(`${environment.apiUrl}/kham`, { ...body }).toPromise();
    } catch (error) {
      throw error;
    }
  }

  async updateKham(idKham: string, body: any): Promise<void> {
    try {
      return await this.http.put<any>(`${environment.apiUrl}/kham/${idKham}`, { ...body }).toPromise();
    } catch (error) {
      throw error;
    }
  }

  async deleteKham(idKham: string): Promise<void> {
    try {
      return await this.http.delete<any>(`${environment.apiUrl}/kham/${idKham}`).toPromise();
    } catch (error) {
      throw error;
    }
  }

  async searchKhams(maBA: string, pageIndex: number, pageSize: number, query: any = {}): Promise<BaseRespone<Kham>> {
    try {
      query = {...query, maBA};
      return await this.http.post<BaseRespone<Kham>>(`${environment.apiUrl}/kham/search`, {
        pageIndex,
        pageSize,
        sort: { ngayKham: 'DESC' },
        query
      }).toPromise();
    } catch (error) {
      throw error;
    }
  }

  // dich vụ sử dụng
  async getDichVuSuDung(
    maBA: string,
    pageIndex: number = 0,
    pageSize: number = 10,
    sortField: string,
    sortOrder: string,
    query?: any
  ): Promise<BaseRespone<ChiTietDichVu>> {
    try {
      const sort: any = {};
      if (sortField && sortOrder) {
        sort[sortField] = sortOrder.replace('end', '').toUpperCase();
      }
      query = {...query, maBA};
      return await this.http.post<BaseRespone<ChiTietDichVu>>(
        `${environment.apiUrl}/dich-vu-su-dung/list`,
        { pageIndex, pageSize, sort, query }
      ).toPromise();
    } catch (error) {
      throw error;
    }
  }

  async getDichVuSuDungById(id: string): Promise<ChiTietDichVu> {
    try {
      return await this.http.get<any>(`${environment.apiUrl}/dich-vu-su-dung/${id}`).toPromise();
    } catch (error) {
      throw error;
    }
  }

  async createChiTietDichVuSuDung(maBA: string, formData: any = {}): Promise<any> {
    try {
      try {
        return await this.http.post<any>(`${environment.apiUrl}/dich-vu-su-dung`, { ...formData, maBA }).toPromise();
      } catch (error) {
        throw error;
      }
    } catch (error) {
      throw error;
    }
  }

  async updateChiTietDichVuSuDung(id: string, formData: any): Promise<any> {
    try {
      try {
        return await this.http.patch<any>(`${environment.apiUrl}/dich-vu-su-dung/${id}`, { ...formData }).toPromise();
      } catch (error) {
        throw error;
      }
    } catch (error) {
      throw error;
    }
  }

  async deleteDichVuSuDung(id: string): Promise<any> {
    try {
      return await this.http.delete<any>(`${environment.apiUrl}/dich-vu-su-dung/${id}`).toPromise();
    } catch (error) {
      throw error;
    }
  }

  async deleteHinhAnhDichVuSuDung(id: string): Promise<any> {
    try {
      return await this.http.delete<any>(`${environment.apiUrl}/dich-vu-su-dung/hinh-anh?idHinhAnh=${id}`).toPromise();
    } catch (error) {
      throw error;
    }
  }

  async searchDichVuSuDung(maBA: string, pageIndex: number, pageSize: number, query: any): Promise<BaseRespone<any>> {
    try {
      return await this.http.post<BaseRespone<any>>(`${environment.apiUrl}/dich-vu-su-dung/search`, {
        pageIndex,
        pageSize,
        sort: { ngay: 'DESC' },
        query : {...query, maBA}
      }).toPromise();
    } catch (error) {
      throw error;
    }
  }

  async uploadImageDichVuV2(id: string, hinhAnh: any): Promise<any> {
    try {
      const formData = new FormData();
      formData.append('image', hinhAnh);
      await this.http.patch(`${this.baseUrl}/${id}/dich-vu-su-dung/upload`, formData).toPromise();
    } catch (error) {
      throw error;
    }
  }
  async getImageDichVuV2(id: string, hinhanh: string): Promise<any> {
    try {
      return await this.http.get(`${this.baseUrl}/${id}/dich-vu-su-dung/upload`, {
        headers: {
          hinhanh,
        }
      }).toPromise();
    } catch (error) {
      throw error;
    }
  }


  // phòng
  async getThueGiuongs(
    maBA: string,
    pageIndex: number = 0,
    pageSize: number = 10,
    sortField: string,
    sortOrder: string,
    query?: any
  ): Promise<BaseRespone<ThueGiuong>> {
    try {
      const sort: any = {};
      if (sortField && sortOrder) {
        sort[sortField] = sortOrder.replace('end', '').toUpperCase();
      }
      query = {...query, maBA};
      return await this.http.post<BaseRespone<ThueGiuong>>(
        `${environment.apiUrl}/thue-giuong/list`,
        { pageIndex, pageSize, sort, query }
      ).toPromise();
    } catch (error) {
      throw error;
    }
  }

  async getThueGiuongById(maBA: string, idctgiuong: string): Promise<any> {
    try {
      return await this.http.get<any>(`${environment.apiUrl}/thue-giuong?idCtGiuong=${idctgiuong}&&maBA=${maBA}`).toPromise();
    } catch (error) {
      throw error;
    }
  }

  async createThueGiuong(maBA: string, formData: any = {}): Promise<any> {
    try {
      try {
        return await this.http.post<any>(`${environment.apiUrl}/thue-giuong`, { ...formData, maBA }).toPromise();
      } catch (error) {
        throw error;
      }
    } catch (error) {
      throw error;
    }
  }

  async updateThueGiuong(maBA: string, idctgiuong: string, formData: any): Promise<any> {
    try {
      try {
        return await this.http.patch<any>(`${environment.apiUrl}/thue-giuong?idCtGiuong=${idctgiuong}&&maBA=${maBA}`, { ...formData }).toPromise();
      } catch (error) {
        throw error;
      }
    } catch (error) {
      throw error;
    }
  }

  async deleteThueGiuongById(maBA: string, idctgiuong: string): Promise<any> {
    try {
      return await this.http.delete(`${environment.apiUrl}/thue-giuong?idCtGiuong=${idctgiuong}&&maBA=${maBA}`).toPromise();
    } catch (error) {
      throw error;
    }
  }

  async searchThueGiuongs(maBA: string, pageIndex: number, pageSize: number, query: any): Promise<BaseRespone<any>> {
    try {
      query = {...query, maBA};
      return await this.http.post<BaseRespone<any>>(`${environment.apiUrl}/thue-giuong/search`, {
        pageIndex,
        pageSize,
        sort: { ngayThue: 'DESC' },
        query
      }).toPromise();
    } catch (error) {
      throw error;
    }
  }

  async thongKeBenhAn(): Promise<any> {
    try {
      return await this.http.get<any>(`${this.baseUrl}/thong-ke`).toPromise();
    } catch (error) {
      throw error;
    }
  }

  async uploadChiTietDichVu(file: any): Promise<any> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      return await this.http.post(`${environment.apiUrl}/upload/dich-vu-su-dung`, formData).toPromise();
    } catch (error) {
      throw error;
    }
  }
}