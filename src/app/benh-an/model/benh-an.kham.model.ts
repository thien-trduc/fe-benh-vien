import { Abstract } from '../../helper/handling-abstract';
import { BenhAn } from './benh-an.model';
import { NhanVien } from '../../nhan-vien/model/nhan-vien.model';
export class Kham {
    id: number;
    benhAn: BenhAn;
    bacSi: NhanVien;
    yta?: NhanVien;
    ngayKham: Date;
    chanDoan: string;
    tinhTrang: string;
    existToaThuoc?: boolean;
}