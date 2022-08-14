import { BenhAn } from './benh-an.model';
import { NhanVien } from './../../nhan-vien/model/nhan-vien.model';
import { DichVu } from 'src/app/dich-vu/model/dich-vu.model';
import { BenhAnDichVuHinhAnh } from './benh-an-ctdv-hinh-anh.model';

export class ChiTietDichVu {
    id: string;
    dichVu: DichVu;
    ngay: Date;
    ketQua: string;
    donGia: number;
    bacSi: NhanVien;
    nhanVien: NhanVien;
    benhAnDichVuHinhAnhs: BenhAnDichVuHinhAnh[];
}