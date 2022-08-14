import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ThongKeService {
    private baseUrl = environment.apiUrl;

    constructor(private http: HttpClient) {
    }

    async thongKeDoanhThu(tuNgay: Date, denNgay: Date): Promise<any> {
        return this.http.post(`${this.baseUrl}/thong-ke/doanh-thu`, { tuNgay, denNgay }).toPromise();
    }

    async thongKeBenhNhanPhong(maKhoa: string): Promise<any> {
        return this.http.post(`${this.baseUrl}/thong-ke/benh-nhan-phong`, { maKhoa }).toPromise();
    }
}
