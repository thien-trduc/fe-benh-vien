import { BenhNhan } from './../../benh-nhan/benh-nhan.model';
import { NhanVien } from './../../nhan-vien/model/nhan-vien.model';
import { Abstract } from './../../helper/handling-abstract';


export class BenhAn extends Abstract {
    maBA: string;
    nhanVien: NhanVien;
    benhNhan: BenhNhan;
    chieuCao: number;
    canNang: number;
    tienSu: string;
    ngayLap: Date;
    trangThai: number;
}
