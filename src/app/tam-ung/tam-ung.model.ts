import { NhanVien } from './../nhan-vien/model/nhan-vien.model';
import { BenhAn } from '../benh-an/model/benh-an.model';
import { Abstract } from '../helper/handling-abstract';

export class TamUng extends Abstract {
    maPTU: string;
    ngayLap: Date;
    soTien: string;
    lyDo: string;
    ghiChu: string;
    benhAn: BenhAn;
    nhanVien: NhanVien;
}