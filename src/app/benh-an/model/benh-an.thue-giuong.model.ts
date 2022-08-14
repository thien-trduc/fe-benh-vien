import { ChiTietPhongGiuong } from './../../phong/model/phong.ct-giuong.dto';
import { BenhAn } from './benh-an.model';

export class ThueGiuong {
    ctPhongGiuong: ChiTietPhongGiuong;
    ngayThue: Date;
    ngayTra: Date;
    donGia: number;
    benhAn: BenhAn;
}