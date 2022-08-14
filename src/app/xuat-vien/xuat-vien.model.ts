import { NhanVien } from '../nhan-vien/model/nhan-vien.model';
import { BenhAn } from '../benh-an/model/benh-an.model';

export class XuatVien {
    maPXV: string;
    ngayLap: Date;
    lyDo: string;
    ghiChu: string;
    benhAn: BenhAn;
    nhanVien: NhanVien;
}