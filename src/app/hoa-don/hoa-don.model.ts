import { NhanVien } from '../nhan-vien/model/nhan-vien.model';
import { BenhAn } from '../benh-an/model/benh-an.model';
import { Abstract } from '../helper/handling-abstract';

export class HoaDon extends Abstract {
    maHD: string;
    ngayLap: Date;
    tienThuoc: number;
    tienDichVu: number;
    tienGiuong: number;
    tongTamUng: number;
    tongTien: number;
    thucTra: number;
    ghiChu: string;
    benhAn: BenhAn;
    nhanVien: NhanVien;
}