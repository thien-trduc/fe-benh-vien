import { LoaiNhanVien } from './loai-nhan-vien.model';
import { Abstract } from '../../helper/handling-abstract';
import { Khoa } from '../../khoa/khoa.model';

export class NhanVien extends Abstract {
    maNV: string;
    hoTen: string;
    gioiTinh: string;
    ngaySinh: Date;
    diaChi: string;
    soDienThoai: string;
    email: string;
    hinhAnh: string;
    chucVu: string;
    loaiNV: LoaiNhanVien;
    khoa: Khoa;
}
