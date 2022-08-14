import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BaseRespone } from './response';

export class BaseClient<T> {
    protected baseUrl: string;
    http: HttpClient;

    constructor(http: HttpClient, router: string) {
        this.baseUrl = `${environment.apiUrl}/${router}`;
        this.http = http;
    }

    async fetch(
        pageIndex: number = 0,
        pageSize: number = 10,
        sortField: string,
        sortOrder: string,
        query?: Partial<Record<keyof T, unknown>>,
    ): Promise<BaseRespone<T>> {
        try {
            const sort: any = {};
            if (sortField && sortOrder) {
                sort[sortField] = sortOrder.replace('end', '').toUpperCase();
            }
            console.log(sort)
            return await this.http.post<BaseRespone<T>>(`${this.baseUrl}/list`, { pageIndex, pageSize, sort, query }).toPromise();
        } catch (error) {
            throw error;
        }
    }

    async getGias(
        id: string,
        pageIndex: number = 0,
        pageSize: number = 10,
        sortField: string,
        sortOrder: string,
        query?: Partial<Record<keyof T, unknown>>,
    ): Promise<BaseRespone<any>> {
        try {
            const sort: any = {};
            if (sortField && sortOrder) {
                sort[sortField] = sortOrder.replace('end', '').toUpperCase();
            }
            return await this.http.post<BaseRespone<T>>(
                `${this.baseUrl}/${id}/gia`,
                { pageIndex, pageSize, sort, query }
            ).toPromise();
        } catch (error) {
            throw error;
        }
    }


    async search(pageIndex: number, pageSize: number, query: Partial<Record<keyof T, unknown>>): Promise<BaseRespone<T>> {
        try {
            return await this.http.post<BaseRespone<T>>(`${this.baseUrl}/search`, {
                pageIndex,
                pageSize,
                sort: { updatedAt: 'DESC' },
                query
            }).toPromise();
        } catch (error) {
            throw error;
        }
    }

    async searchBenhAnByCMND(pageIndex: number, pageSize: number, query: Partial<Record<keyof T, unknown>>): Promise<BaseRespone<T>> {
        try {
            return await this.http.post<BaseRespone<T>>(`${this.baseUrl}/search-benh-an-cmnd`, {
                pageIndex,
                pageSize,
                sort: { updatedAt: 'DESC' },
                query
            }).toPromise();
        } catch (error) {
            throw error;
        }
    }

    async searchNhanVien(
        pageIndex: number,
        pageSize: number,
        sortField: string,
        sortOrder: string,
        query: any = {},
    ): Promise<BaseRespone<T>> {
        let sort: any = {};
        if (sortField && sortOrder) {
            sort[sortField] = sortOrder.replace('end', '').toUpperCase();
        }
        sort = { ...sort, updatedAt: 'DESC' };
        try {
            return await this.http.post<BaseRespone<T>>(`${this.baseUrl}/search-nhan-vien-benh-an`, {
                pageIndex,
                pageSize,
                sort,
                query,
            }).toPromise();
        } catch (error) {
            throw error;
        }
    }

    async store(body: any = {}): Promise<any> {
        try {
            return await this.http.post<any>(`${this.baseUrl}`, { ...body }).toPromise();
        } catch (error) {
            throw error;
        }
    }

    async storeGia(id: string, body: any = {}): Promise<any> {
        try {
            return await this.http.post<any>(`${this.baseUrl}/${id}/gia/them`, { ...body }).toPromise();
        } catch (error) {
            throw error;
        }
    }


    async update(id: string, body: any): Promise<T> {
        try {
            return await this.http.put<T>(`${this.baseUrl}/${id}`, { ...body }).toPromise();
        } catch (error) {
            throw error;
        }
    }

    async delete(id: string): Promise<any> {
        try {
            return await this.http.delete(`${this.baseUrl}/${id}`).toPromise();
        } catch (error) {
            throw error;
        }
    }

    async deleteGia(id: string, ngayCapNhat: string): Promise<any> {
        try {
            return await this.http.delete(`${this.baseUrl}/${id}/gia`, {
                headers: {
                    ngay: ngayCapNhat
                }
            }).toPromise();
        } catch (error) {
            throw error;
        }
    }

    async getById(id: string): Promise<T> {
        try {
            return await this.http.get<T>(`${this.baseUrl}/${id}`).toPromise();
        } catch (error) {
            throw error;
        }
    }

    async upload(id: string, hinhAnh: any): Promise<void> {
        try {
            const formData = new FormData();
            formData.append('image', hinhAnh);
            await this.http.post(`${this.baseUrl}/${id}/upload`, formData).toPromise();
        } catch (error) {
            throw error;
        }
    }

    async editUpload(id: string, hinhAnh: any): Promise<void> {
        try {
            const formData = new FormData();
            formData.append('image', hinhAnh);
            await this.http.patch(`${this.baseUrl}/${id}/upload`, formData).toPromise();
        } catch (error) {
            throw error;
        }
    }

    async getImageUrl(id: string): Promise<any> {
        try {
            return await this.http.get(`${this.baseUrl}/${id}/upload`).toPromise();
        } catch (error) {
            throw error;
        }
    }
}